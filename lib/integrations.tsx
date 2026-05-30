import type { ActionRegistry } from './actions.ts';
import { PATCH_ELEMENTS_MODES } from './datastar.ts';
import type { JSX } from './preact.ts';
import type { Router } from './router.ts';
import { defineConstantFile, defineGroup, matchRoute } from './router.ts';
import { WEBUI_BASE_URL } from './webui.tsx';

import SCRIPT_DATASTAR from './assets/datastar.min.js';
import SCRIPT_DATASTAR_INTEGRATIONS from './assets/datastar.integrations.js';

interface NavigateOptions {
    readonly path: string;

    readonly useViewTransition?: boolean;
}

export const INTEGRATIONS_GROUP = defineGroup('integrations', [
    defineConstantFile('/datastar.min.js', SCRIPT_DATASTAR),
    defineConstantFile(
        '/datastar.integrations.js',
        SCRIPT_DATASTAR_INTEGRATIONS,
    ),
]);

export function initIntegrations(actions: ActionRegistry, router?: Router) {
    if (router) {
        actions.registerInternalAction<NavigateOptions>(
            '__webui-datastar_navigate',
            async (payload) => {
                const { path, useViewTransition = true } = payload;

                const url = new URL(path, WEBUI_BASE_URL);
                const response = await matchRoute(router, url);

                if (response) {
                    const responseText = new TextDecoder().decode(
                        response,
                    );

                    const bodyDelimiterIndex = responseText.indexOf('\r\n\r\n');
                    const bodyText = bodyDelimiterIndex !== -1
                        ? responseText.slice(bodyDelimiterIndex + 4)
                        : responseText;

                    return {
                        elements: bodyText,
                        mode: PATCH_ELEMENTS_MODES.outer,
                        useViewTransition,
                    };
                }
            },
        );
    }
}

export function IntegrationsHead(): JSX.Element {
    return (
        <>
            <script
                type='module'
                src='/__webui-datastar/integrations/datastar.min.js'
            >
            </script>

            <script
                type='module'
                src='/__webui-datastar/integrations/datastar.integrations.js'
            >
            </script>
        </>
    );
}
