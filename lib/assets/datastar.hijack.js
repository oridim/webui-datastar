export default `
let abortController = null;

function dispatchDatastarFetchEvent(type, el, argsRaw = {}) {
    document.dispatchEvent(
        new CustomEvent('datastar-fetch', {
            detail: { type, el, argsRaw },
        }),
    );
}

async function navigate(input, options = {}) {
    const { pushHistory = true, useViewTransition = false, scrollY } = options;
    
    const { href, origin, pathname, search, hash } = new URL(
        input,
        location.origin,
    );
    
    if (location.origin !== origin) {
        location.href = href;
        return;
    }
    
    input = pathname + search + hash;
    
    if (pushHistory) {
        history.replaceState(
            { ...(history.state ?? {}), scrollY: globalThis.scrollY },
            '',
        );
        
        history.pushState({ useViewTransition }, '', input);
    }
    
    if (abortController) {
        abortController.abort();
    }
    
    abortController = new AbortController();
    
    const { signal } = abortController;
    
    dispatchDatastarFetchEvent('started', document.documentElement);
    
    try {
        let response;
        
        try {
            response = await fetch(input, { signal });
        } catch (error) {
            if (error instanceof DOMException) {
                return;
            }
            
            throw error;
        }
        
        if (response.redirected) {
            history.replaceState(history.state, '', response.url);
        }
        
        const elements = await response.text();
        
        if (signal.aborted) {
            return;
        }
        
        dispatchDatastarFetchEvent('patchElements', document.documentElement, {
            elements,
            mode: 'outer',
            namespace: 'html',
            useViewTransition: String(useViewTransition),
            viewTransitionSelector: '',
        });
        
        if (!hash) {
            if (scrollY !== undefined) {
                globalThis.scrollTo(0, scrollY);
            } else if (pushHistory) {
                globalThis.scrollTo(0, 0);
            }
        }
    } finally {
        dispatchDatastarFetchEvent('finished', document.documentElement);
    }
}

document.addEventListener('click', async (event) => {
    const { altKey, button, ctrlKey, metaKey, shiftKey, target } = event;
    
    if (button !== 0 || altKey || ctrlKey || metaKey || shiftKey) {
        return;
    }
    
    const linkElement = target.closest('a');
    
    if (
        !linkElement || !linkElement.href ||
        linkElement.hasAttribute('download') ||
        (linkElement.hasAttribute('target') &&
        linkElement.getAttribute('target') !== '_self')
    ) {
        return;
    }
    
    const url = new URL(linkElement.href, location.origin);
    
    if (
        (location.origin !== url.origin) || (
            url.hash &&
            url.pathname === location.pathname &&
            url.search === location.search
        )
    ) {
        return;
    }
    
    event.preventDefault();
    
    const useViewTransition = linkElement.hasAttribute(
        'data-use-view-transition',
    );
    
    await navigate(url, { useViewTransition });
});

globalThis.addEventListener('popstate', async () => {
    const { useViewTransition = false, scrollY } = history.state ?? {};
    
    await navigate(location, {
        pushHistory: false,
        useViewTransition,
        scrollY,
    });
});

history.scrollRestoration = 'manual';

Object.assign(globalThis, {
    datastarHijack: {
        navigate,
    },
});
`.trim();
