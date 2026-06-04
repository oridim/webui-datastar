import type { WebUI } from '@webui/deno-webui';

import type { ActionRegistry } from './actions/action-registry.ts';
import {
    defineActionRegistry,
    initActions,
} from './actions/action-registry.ts';

import {
    initIntegrations,
    INTEGRATIONS_GROUP,
    IntegrationsHead,
} from './integrations/datastar.tsx';
import { POLYFILLS_GROUP, PolyfillsHead } from './integrations/polyfills.tsx';
import { WebUIHead } from './integrations/webui.tsx';

import type { JSX } from './preact/components.ts';

import { defineGroup } from './router/directives.ts';
import { defineRouter, initRouter } from './router/router.ts';
import type { Router } from './router/router.ts';
import type { RouteItem } from './router/types.ts';

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
