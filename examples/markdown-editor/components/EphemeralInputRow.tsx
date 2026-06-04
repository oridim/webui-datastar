import { defineAction } from '@oridim/webui-datastar';
import { join } from '@std/path';
import { Check, X } from 'npm:lucide-preact@1.17.0';

import { listDirectory } from './WorkspaceFileList.tsx';

import type { PartialSignals, Signals } from '../signals.ts';

const DEFAULT_FILE_CONTENT = '# New Note';

export const createFile = defineAction<Signals, PartialSignals>(
    async function* (signals) {
        const { ephemeralFile, workspace } = signals;

        const { fileName } = ephemeralFile;
        const { directoryPath } = workspace;

        if (!directoryPath) {
            return;
        }

        yield {
            signals: {
                status: {
                    isLoading: true,
                    isVisible: true,
                    message: 'Creating file...',
                },
            },
        };

        const filePath = join(directoryPath, fileName);
        await Deno.writeTextFile(filePath, DEFAULT_FILE_CONTENT);

        yield {
            signals: {
                ephemeralFile: {
                    isCreating: false,
                    fileName: '',
                    wasFileCreated: true,
                },

                status: {
                    isVisible: false,
                },

                workspace: {
                    fileContent: DEFAULT_FILE_CONTENT,
                    filePath,
                },
            },
        };
    },
);

export default function EphemeralInputRow() {
    return (
        <div
            class='ephemeral-input-row'
            data-effect={`
                if ($ephemeralFile.wasFileCreated) {
                    ${listDirectory()};
                    $ephemeralFile.wasFileCreated = false;
                }
            `}
            data-show='$ephemeralFile.isCreating'
        >
            <input
                class='ephemeral-input'
                data-bind='ephemeralFile.fileName'
                placeholder='filename.md'
                autoFocus
            />

            <button
                class='icon-btn is-success'
                data-on:click={createFile()}
            >
                <Check />
            </button>

            <button
                class='icon-btn is-danger'
                data-on:click="$ephemeralFile.isCreating = false; $ephemeralFile.fileName = ''"
            >
                <X />
            </button>
        </div>
    );
}
