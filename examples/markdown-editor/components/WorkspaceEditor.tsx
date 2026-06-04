import { defineAction } from '@oridim/webui-datastar';

import type { PartialSignals, Signals } from '../signals.ts';
import { VIEW_MODES } from '../signals.ts';

export const saveFile = defineAction<Signals, PartialSignals>(
    async function* (signals) {
        const { fileContent, filePath } = signals.workspace;

        if (!filePath) {
            return;
        }

        yield {
            signals: {
                status: {
                    isLoading: true,
                    isVisible: true,
                    message: 'Saving...',
                },
            },
        };

        await Deno.writeTextFile(filePath, fileContent);

        yield {
            signals: {
                status: {
                    isVisible: false,
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
            data-on:input__debounce__2000ms={saveFile()}
        />
    );
}
