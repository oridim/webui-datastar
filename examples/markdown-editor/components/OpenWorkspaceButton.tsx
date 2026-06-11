import { defineStream } from '@oridim/datastar-serve';
import { FileDialog } from 'jsr:@miyauci/rfd@1.0.0/deno';
import { ChevronRight } from 'npm:lucide-preact@1.17.0';

import type { Signals } from '../signals.ts';

export const pickDirectory = defineStream<Signals>(
    '/streams/pickDirectory',
    async function* () {
        yield {
            patchSignals: {
                signals: {
                    status: {
                        isLoading: true,
                        isVisible: true,
                        message: 'Waiting for folder selection...',
                    },
                },
            },
        };

        using dialog = new FileDialog();
        dialog.setTitle('Pick a folder...');

        const directoryPath = dialog.pickFolder();

        if (directoryPath) {
            yield {
                executeScript: {
                    script: 'datastarHijack.navigate("/workspace")',
                },
                patchSignals: {
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
                },
            };
        } else {
            yield {
                patchSignals: {
                    signals: {
                        status: {
                            isVisible: false,
                        },
                    },
                },
            };
        }
    },
);

export default function OpenWorkspaceButton() {
    return (
        <button
            data-on:click='@post("/streams/pickDirectory")'
            class='open-workspace-button'
        >
            Open Workspace <ChevronRight class='open-workspace-button--icon' />
        </button>
    );
}
