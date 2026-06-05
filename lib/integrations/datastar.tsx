import type { WebUI } from '@webui/deno-webui';

import type { ActionRegistry } from '../actions/action-registry.ts';

import { dispatchElementPatch } from '../datastar/patches.ts';
import { PATCH_ELEMENTS_MODES } from '../datastar/types.ts';

import type { JSX } from '../preact/components.ts';

import { defineConstantFile, defineGroup } from '../router/directives.ts';
import type { Router } from '../router/router.ts';
import { matchRoute } from '../router/router.ts';

import { HTML_NAMESPACES } from '../utilities/html.ts';

import { WEBUI_BASE_URL } from './constants.ts';

import SCRIPT_DATASTAR from '../assets/datastar.min.js';
import SCRIPT_DATASTAR_INTEGRATIONS from '../assets/datastar.integrations.js';

export const INTEGRATIONS_GROUP = defineGroup('integrations', [
    defineConstantFile('/datastar.min.js', SCRIPT_DATASTAR),
    defineConstantFile(
        '/datastar.integrations.js',
        SCRIPT_DATASTAR_INTEGRATIONS,
    ),
]);

export function initIntegrations(
    window: WebUI,
    actionRegistry: ActionRegistry,
    router?: Router,
) {
    if (router) {
        window.bind(
            '__webui-datastar_navigate',
            (event) => {
                const path = event.arg.string(0);
                const useViewTransition = event.arg.boolean(1);

                const url = new URL(path, WEBUI_BASE_URL);

                (async () => {
                    const response = await matchRoute(router, url);

                    if (response) {
                        const responseText = new TextDecoder().decode(
                            response,
                        );

                        const bodyDelimiterIndex = responseText.indexOf(
                            '\r\n\r\n',
                        );
                        const bodyText = bodyDelimiterIndex !== -1
                            ? responseText.slice(bodyDelimiterIndex + 4)
                            : responseText;

                        dispatchElementPatch(
                            window,
                            null,
                            bodyText,
                            PATCH_ELEMENTS_MODES.outer,
                            HTML_NAMESPACES.html,
                            useViewTransition,
                        );
                    }
                })();
            },
        );
    }
}

export function IntegrationsHead(): JSX.Element {
    return (
        <>
            <script
                type='module'
                src='/__webui-datastar/integrations/datastar.integrations.js'
            >
            </script>
        </>
    );
}
