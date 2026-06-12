import { basename } from '@std/path';
import { extname, join } from '@std/path';

import { defineStream } from '@oridim/datastar-serve';
import { FileText } from 'npm:lucide-preact@1.17.0';

import type { Signals } from '../signals.ts';

export const listDirectory = defineStream<Signals>(
    '/streams/listDirectory',
    async function* ({ signals }) {
        const { workspace } = signals;
        const { directoryPath } = workspace;

        if (!directoryPath) {
            return;
        }

        yield {
            patchSignals: {
                signals: {
                    status: {
                        isLoading: true,
                        isVisible: true,
                        message: 'Reading directory...',
                    },
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
            patchElements: {
                elements: <WorkspaceFileList files={files} />,
            },

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

export const readFile = defineStream<Signals>(
    '/streams/readFile',
    async function* ({ signals }) {
        const { workspace } = signals;
        const { filePath } = workspace;

        if (!filePath) {
            return;
        }

        yield {
            patchSignals: {
                signals: {
                    status: {
                        isLoading: true,
                        isVisible: true,
                        message: 'Loading file...',
                    },
                },
            },
        };

        const content = await Deno.readTextFile(filePath);

        yield {
            patchSignals: {
                signals: {
                    status: {
                        isVisible: false,
                    },

                    workspace: {
                        fileContent: content,
                    },
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
            data-effect='$directoryPath;@get("/streams/listDirectory")'
        >
            {files.map((filePath) => {
                const fileName = basename(filePath);
                const serializedPath = JSON.stringify(filePath);

                return (
                    <button
                        key={filePath}
                        class='workspace-file-list--button'
                        data-class={`{ 'is-active': $workspace.filePath === ${serializedPath} }`}
                        data-on:click={`$workspace.filePath = ${serializedPath};@get("/streams/readFile")`}
                    >
                        <FileText /> {fileName}
                    </button>
                );
            })}
        </div>
    );
}
