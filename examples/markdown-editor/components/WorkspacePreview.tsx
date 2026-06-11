import { render as renderMarkdown } from 'jsr:@deno/gfm@0.12.0';
import { defineStream } from '@oridim/datastar-serve';

import type { Signals } from '../signals.ts';
import { VIEW_MODES } from '../signals.ts';

export const renderPreview = defineStream<Signals>(
    '/streams/renderPreview',
    async function* ({ signals }) {
        const { workspace } = signals;
        const { fileContent } = workspace;

        yield {
            patchSignals: {
                signals: {
                    status: {
                        isLoading: true,
                        isVisible: true,
                        message: 'Rendering...',
                    },
                },
            },
        };

        const render = renderMarkdown(fileContent);

        yield {
            patchElements: {
                elements: <WorkspacePreview render={render} />,
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

export interface WorkspacePreviewProps {
    readonly render?: string;
}

export default function WorkspacePreview(props: WorkspacePreviewProps) {
    const { render = '' } = props;

    return (
        <div
            id='workspace-preview markdown-body'
            class='workspace-preview markdown-body'
            data-on-signal-patch__debounce__500ms='@get("/streams/renderPreview")'
            data-on-signal-patch-filter='{include: /^workspace\.fileContent$/}'
            data-show={`$shell.viewMode === '${VIEW_MODES.split}' || $shell.viewMode === '${VIEW_MODES.preview}'`}
            dangerouslySetInnerHTML={{ __html: render }}
        />
    );
}
