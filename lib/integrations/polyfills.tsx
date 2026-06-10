import type { JSX } from '../preact/components.ts';

import { defineConstantFile, defineGroup } from '../router/directives.ts';

import SCRIPT_VIEW_TRANSITIONS_POLYFILL from '../assets/view-transitions-polyfill.min.js';

const FEATURE_POLYFILLS = [
    {
        enablementCondition: '!("startViewTransition" in document)',
        src: 'view-transitions-polyfill.min.js',
    },
] as const;

export const POLYFILLS_GROUP = defineGroup('polyfills', [
    defineConstantFile(
        '/view-transitions-polyfill.min.js',
        SCRIPT_VIEW_TRANSITIONS_POLYFILL,
    ),
]);

export function PolyfillsHead(): JSX.Element {
    const conditions = FEATURE_POLYFILLS.map(
        (polyfill) =>
            `{ enabled: ${polyfill.enablementCondition}, src: "${polyfill.src}" }`,
    ).join(',\n');

    const detectionScript = `
        (() => {
            const polyfills = [
                ${conditions}
            ];
            
            for (const {enabled, src} of polyfills) {
                if (enabled) {
                    document.write('<script src="/__datastar-deno-server/polyfills/' + src + '"><\\/script>');
                }
            }
        })();
    `;

    return <script dangerouslySetInnerHTML={{ __html: detectionScript }} />;
}
