import { render as renderMarkdown } from 'jsr:@deno/gfm@0.12.0';
import { defineAction } from '@oridim/webui-datastar';

import type { PartialSignals, Signals } from '../signals.ts';
import { VIEW_MODES } from '../signals.ts';

export const renderPreview = defineAction<Signals, PartialSignals>(
    async function* (signals) {
        const { fileContent } = signals.workspace;

        yield {
            signals: {
                status: {
                    isLoading: true,
                    isVisible: true,
                    message: 'Rendering...',
                },
            },
        };

        const render = renderMarkdown(fileContent);

        yield {
            elements: <WorkspacePreview render={render} />,

            signals: {
                status: {
                    isVisible: false,
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
            data-on-signal-patch__debounce__500ms={`${renderPreview()}`}
            data-on-signal-patch-filter='{include: /^workspace\.fileContent$/}'
            data-show={`$shell.viewMode === '${VIEW_MODES.split}' || $shell.viewMode === '${VIEW_MODES.preview}'`}
            dangerouslySetInnerHTML={{ __html: render }}
        />
    );
}
