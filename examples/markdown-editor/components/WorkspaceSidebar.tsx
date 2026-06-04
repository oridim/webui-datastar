import { Plus } from 'npm:lucide-preact@1.17.0';

import EphemeralInputRow from './EphemeralInputRow.tsx';
import WorkspaceFileList from './WorkspaceFileList.tsx';

export default function WorkspaceSidebar() {
    return (
        <aside
            class='workspace-sidebar'
            data-show='$shell.isSidebarOpen'
        >
            <div class='workspace-sidebar--header'>
                <span class='workspace-sidebar--title'>PROJECT FILES</span>
                <button
                    class='icon-button is-active'
                    data-on:click='$ephemeralFile.isCreating = true'
                >
                    <Plus />
                </button>
            </div>

            <div class='workspace-sidebar--content'>
                <EphemeralInputRow />
                <WorkspaceFileList />
            </div>
        </aside>
    );
}
