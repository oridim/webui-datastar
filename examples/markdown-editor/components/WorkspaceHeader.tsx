import {
    Columns,
    Eye,
    PanelLeftClose,
    PanelLeftOpen,
    Pen,
} from 'npm:lucide-preact@1.17.0';

import { VIEW_MODES } from '../state.ts';

export default function WorkspaceHeader() {
    return (
        <header class='workspace-header'>
            <button
                class='icon-btn is-active'
                data-on:click='$shell.isSidebarOpen = !$shell.isSidebarOpen'
            >
                <div data-show='$shell.isSidebarOpen'>
                    <PanelLeftClose />
                </div>

                <div data-show='!$shell.isSidebarOpen'>
                    <PanelLeftOpen />
                </div>
            </button>

            <div class='header-actions'>
                <button
                    class='icon-btn'
                    data-class={`{ 'is-active': $shell.viewMode === '${VIEW_MODES.edit}' }`}
                    data-on:click={`$shell.viewMode = '${VIEW_MODES.edit}'`}
                >
                    <Pen />
                </button>

                <button
                    class='icon-btn'
                    data-class={`{ 'is-active': $shell.viewMode === '${VIEW_MODES.split}' }`}
                    data-on:click={`$shell.viewMode = '${VIEW_MODES.split}'`}
                >
                    <Columns />
                </button>

                <button
                    class='icon-btn'
                    data-class={`{ 'is-active': $shell.viewMode === '${VIEW_MODES.preview}' }`}
                    data-on:click={`$shell.viewMode = '${VIEW_MODES.preview}'`}
                >
                    <Eye />
                </button>
            </div>
        </header>
    );
}
