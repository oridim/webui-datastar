export default `
async function handleWebUIReady() {
    const {
        action,
        filtered,
        startPeeking,
        stopPeeking,
    } = await import('/__webui-datastar/integrations/datastar.min.js');

    function dispatchLifecycle(type, el, argsRaw = {}) {
        document.dispatchEvent(
            new CustomEvent('datastar-fetch', {
                detail: { type, el, argsRaw },
            }),
        );
    };

    async function performNavigation(path, options = {}) {
        const { pushHistory = true, useViewTransition = false } = options;

        const { origin, pathname, search } = new URL(path, location.origin);

        if (location.origin !== origin) {
            location.href = url;
            return;
        }

        path = pathname + search;

        if (pushHistory) {
            history.pushState({ useViewTransition }, '', path);
        }

        dispatchLifecycle('started', document.documentElement);

        try {
            await webui.call(
                '__webui-datastar_navigate',
                path,
                useViewTransition,
            );
        } finally {
            dispatchLifecycle('finished', document.documentElement);
        }
    }

    action({
        name: 'ipc',
        apply: async (context, ipcFunctionName, options = {}) => {
            const { el, evt } = context;
            const {
                contentType = 'json',
                filterSignals: { include = /.*/, exclude = /(^|\.)_/ } = {},
                selector,
                payload,
            } = options;

            dispatchLifecycle('started', el);

            let data = payload;
            let cleanupFn = () => {};

            if (contentType === 'json' && data === undefined) {
                startPeeking();
                data = filtered({ include, exclude });
                stopPeeking();
            } else if (contentType === 'form') {
                const formElement = selector
                    ? document.querySelector(selector)
                    : el.closest('form');

                if (!formElement) {
                    throw new Error('form element not found for submission');
                }

                if (!formElement.noValidate && !formElement.checkValidity()) {
                    return formElement.reportValidity();
                }

                const formData = new FormData(formElement);
                let submitter = el;

                if (el === formElement && evt instanceof SubmitEvent) {
                    submitter = evt.submitter;
                } else {
                    const preventDefault = (e) => e.preventDefault();

                    formElement.addEventListener('submit', preventDefault);
                    cleanupFn = () =>
                        formElement.removeEventListener(
                            'submit',
                            preventDefault,
                        );
                }

                if (
                    submitter?.name &&
                    submitter.matches('button, input[type="submit"]')
                ) {
                    formData.append(submitter.name, submitter.value);
                }

                data = {};

                formData.forEach((value, key) => {
                    data[key] = key in data
                        ? [].concat(data[key], value)
                        : value;
                });
            }

            try {
                await webui.call(ipcFunctionName, JSON.stringify(data ?? {}));
            } catch (error) {
                dispatchLifecycle('error', el, { error: String(error) });
                throw error;
            } finally {
                dispatchLifecycle('finished', el);
                cleanupFn();
            }
        },
    });

    action({
        name: 'navigate',
        apply: async (_context, url, options = {}) => {
            const { useViewTransition = false } = options;

            await performNavigation(url, { useViewTransition });
        },
    });

    document.addEventListener('click', async (event) => {
        const linkElement = event.target.closest('a');

        if (
            !linkElement || !linkElement.href ||
            linkElement.getAttribute('target') === '_blank'
        ) {
            return;
        }

        event.preventDefault();

        const url = new URL(linkElement.href, location.origin);
        const useViewTransition = linkElement.hasAttribute(
            'data-use-view-transition',
        );

        await performNavigation(url, { useViewTransition });
    });

    window.addEventListener('popstate', async () => {
        const { useViewTransition = false } = history.state || {};

        event.preventDefault();

        await performNavigation(location, {
            pushHistory: false,
            useViewTransition,
        });
    });

    window.webUIDatastar = {
        performNavigation,
    };
}

document.addEventListener('DOMContentLoaded', () => {
    if (webui.isConnected()) {
        handleWebUIReady();
    } else {
        webui.setEventCallback((event) => {
            switch (event) {
                case webui.event.CONNECTED:
                    handleWebUIReady();
                    webui.setEventCallback(undefined);
                    break;
            }
        });
    }
});
`.trim();
