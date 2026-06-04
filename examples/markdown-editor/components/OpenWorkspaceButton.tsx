import { defineAction } from '@oridim/webui-datastar';
import { FileDialog } from 'jsr:@miyauci/rfd@1.0.0/deno';
import { ChevronRight } from 'npm:lucide-preact@1.17.0';

import type { PartialSignals, Signals } from '../signals.ts';

export const pickDirectory = defineAction<Signals, PartialSignals>(
    async function* () {
        yield {
            signals: {
                status: {
                    isLoading: true,
                    isVisible: true,
                    message: 'Waiting for folder selection...',
                },
            },
        };

        using dialog = new FileDialog();
        dialog.setTitle('Pick a folder...');

        const directoryPath = dialog.pickFolder();

        if (directoryPath) {
            yield {
                execute: 'webUIDatastar.performNavigation("/workspace");',
                signals: {
                    status: {
                        isVisible: false,
                    },

                    workspace: {
                        directoryPath: directoryPath,
                        fileContent: '',
                        filePath: null,
                    },
                },
            };
        } else {
            yield {
                signals: {
                    status: {
                        isVisible: false,
                    },
                },
            };
        }
    },
);

export default function OpenWorkspaceButton() {
    return (
        <button
            data-on:click={pickDirectory()}
            class='open-workspace-button'
        >
            Open Workspace <ChevronRight class='open-workspace-button--icon' />
        </button>
    );
}
