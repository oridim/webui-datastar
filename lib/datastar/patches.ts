import type { WebUI } from '@webui/deno-webui';

import type { HTMLNamespaces } from '../html.ts';
import { HTML_NAMESPACES } from '../html.ts';

import type { DatastarWatchers, PatchElementsModes } from './types.ts';
import {
    DATASTAR_EVENTS,
    DATASTAR_WATCHERS,
    PATCH_ELEMENTS_MODES,
} from './types.ts';

function dispatchDatastarFetchEvent(
    window: WebUI,
    type: DatastarWatchers,
    argsRaw: Record<string, string>,
) {
    const stringifiedArgs = JSON.stringify(argsRaw);

    window.run(`
        document.dispatchEvent(new CustomEvent('${DATASTAR_EVENTS.fetch}', {
            detail: { type: '${type}', el: document.documentElement, argsRaw: ${stringifiedArgs} }
        }));
    `);
}

export function dispatchElementPatch(
    window: WebUI,
    id: string | null,
    elements: string,
    mode: PatchElementsModes = PATCH_ELEMENTS_MODES.outer,
    namespace: HTMLNamespaces = HTML_NAMESPACES.html,
    useViewTransition: boolean = false,
    viewTransitionSelector: string = '',
): void {
    const argsRaw: Record<string, string> = {
        elements,
        mode,
        useViewTransition: String(useViewTransition),
        namespace,
        viewTransitionSelector,
    };

    if (id) {
        argsRaw.selector = `#${id}`;
    }

    dispatchDatastarFetchEvent(
        window,
        DATASTAR_WATCHERS.patchElements,
        argsRaw,
    );
}

export function dispatchSignalPatch(
    window: WebUI,
    signals: Record<string, unknown>,
    onlyIfMissing = false,
): void {
    dispatchDatastarFetchEvent(
        window,
        DATASTAR_WATCHERS.patchSignals,
        {
            signals: JSON.stringify(signals),
            onlyIfMissing: String(onlyIfMissing),
        },
    );
}
