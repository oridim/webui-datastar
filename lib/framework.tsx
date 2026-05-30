import type { WebUI } from '@webui/deno-webui';

import type { ActionRegistry } from './actions.ts';
import { defineActionRegistry, initActions } from './actions.ts';
import {
    initIntegrations,
    INTEGRATIONS_GROUP,
    IntegrationsHead,
} from './integrations.tsx';
import { POLYFILLS_GROUP, PolyfillsHead } from './polyfills.tsx';
import type { JSX } from './preact.ts';
import type { RouteItem, Router } from './router.ts';
import { defineGroup, defineRouter, initRouter } from './router.ts';
import { WebUIHead } from './webui.tsx';

export interface WebUIDatastarOptions {
    readonly actions?: ActionRegistry;

    readonly router?: Router;

    readonly window: WebUI;
}

export function defineWebUIDatastarRouter(items: RouteItem[]): Router {
    return defineRouter([
        defineGroup('/__webui-datastar', [
            ...POLYFILLS_GROUP,
            ...INTEGRATIONS_GROUP,
        ]),
        ...items,
    ]);
}

export function WebUIDatastarHead(): JSX.Element {
    return (
        <>
            <PolyfillsHead />
            <WebUIHead />
            <IntegrationsHead />
        </>
    );
}

export function initWebUIDatastar(options: WebUIDatastarOptions) {
    const {
        actions = defineActionRegistry(),
        router,
        window,
    } = options;

    if (router) {
        initRouter(window, router);
    }

    initIntegrations(actions, router);
    initActions(window, actions);
}
