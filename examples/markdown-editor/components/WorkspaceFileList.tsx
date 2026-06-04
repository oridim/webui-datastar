import { basename } from '@std/path';
import { extname, join } from '@std/path';

import { defineAction } from '@oridim/webui-datastar';
import { FileText } from 'npm:lucide-preact@1.17.0';

import type { PartialSignals, Signals } from '../signals.ts';

export const listDirectory = defineAction<Signals, PartialSignals>(
    async function* (signals) {
        const { directoryPath } = signals.workspace;

        if (!directoryPath) {
            return;
        }

        yield {
            signals: {
                status: {
                    isLoading: true,
                    isVisible: true,
                    message: 'Reading directory...',
                },
            },
        };

        const files: string[] = [];

        for await (const entry of Deno.readDir(directoryPath)) {
            if (entry.isFile && extname(entry.name) === '.md') {
                const filePath = join(directoryPath, entry.name);

                files.push(filePath);
            }
        }

        files.sort();

        yield {
            elements: <WorkspaceFileList files={files} />,

            signals: {
                status: {
                    isVisible: false,
                },
            },
        };
    },
);

export const readFile = defineAction<Signals, PartialSignals>(
    async function* (signals) {
        const { filePath } = signals.workspace;

        if (!filePath) {
            return;
        }

        yield {
            signals: {
                status: {
                    isLoading: true,
                    isVisible: true,
                    message: 'Loading file...',
                },
            },
        };

        const content = await Deno.readTextFile(filePath);

        yield {
            signals: {
                status: {
                    isVisible: false,
                },

                workspace: {
                    fileContent: content,
                },
            },
        };
    },
);

export interface WorkspaceFileListProps {
    readonly files?: string[];
}

export default function WorkspaceFileList(props: WorkspaceFileListProps) {
    const { files = [] } = props;

    return (
        <div
            id='workspace-file-list'
            data-effect={`$directoryPath;${listDirectory()}`}
        >
            {files.map((filePath) => {
                const fileName = basename(filePath);
                const serializedPath = JSON.stringify(filePath);

                return (
                    <button
                        key={filePath}
                        class='file-list-btn'
                        data-class={`{ 'is-active': $workspace.filePath === ${serializedPath} }`}
                        data-on:click={`$workspace.filePath = ${serializedPath};${readFile()}`}
                    >
                        <FileText /> {fileName}
                    </button>
                );
            })}
        </div>
    );
}
