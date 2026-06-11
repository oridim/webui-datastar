import { defineStream } from '@oridim/datastar-serve';

import type { Signals } from '../signals.ts';
import { VIEW_MODES } from '../signals.ts';

export const saveFile = defineStream<Signals>(
    '/streams/saveFile',
    async function* ({ signals }) {
        const { workspace } = signals;
        const { fileContent, filePath } = workspace;

        if (!filePath) {
            return;
        }

        yield {
            patchSignals: {
                signals: {
                    status: {
                        isLoading: true,
                        isVisible: true,
                        message: 'Saving...',
                    },
                },
            },
        };

        await Deno.writeTextFile(filePath, fileContent);

        yield {
            patchSignals: {
                signals: {
                    status: {
                        isVisible: false,
                    },
                },
            },
        };
    },
);

export default function WorkspaceEditor() {
    return (
        <textarea
            class='workspace-editor'
            data-attr:disabled='!$workspace.filePath'
            data-bind='workspace.fileContent'
            data-class={`{ 'is-split': $shell.viewMode === '${VIEW_MODES.split}' }`}
            data-show={`$shell.viewMode === '${VIEW_MODES.split}' || $shell.viewMode === '${VIEW_MODES.edit}'`}
            data-on:input__debounce__2000ms='@post("/streams/saveFile")'
        />
    );
}
