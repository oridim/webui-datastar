import type { JSX } from '../preact/components.ts';

import { defineConstantFile, defineGroup } from '../router/directives.ts';

import SCRIPT_DATASTAR from '../assets/datastar.min.js';
import SCRIPT_DATASTAR_HIJACK from '../assets/datastar.hijack.js';

export const INTEGRATIONS_GROUP = defineGroup('integrations', [
    defineConstantFile('/datastar.min.js', SCRIPT_DATASTAR),
    defineConstantFile(
        '/datastar.integrations.js',
        SCRIPT_DATASTAR_HIJACK,
    ),
]);

export function IntegrationsHead(): JSX.Element {
    return (
        <>
            <script
                type='module'
                src='/__datastar-serve/integrations/datastar.min.js'
            >
            </script>

            <script
                type='module'
                src='/__datastar-serve/integrations/datastar.integrations.js'
            >
            </script>
        </>
    );
}
