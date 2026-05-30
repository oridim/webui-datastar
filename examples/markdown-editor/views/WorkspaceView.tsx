import WorkspaceEditor from '../components/WorkspaceEditor.tsx';
import WorkspaceHeader from '../components/WorkspaceHeader.tsx';
import WorkspacePreview from '../components/WorkspacePreview.tsx';
import WorkspaceSidebar from '../components/WorkspaceSidebar.tsx';

import Layout from './Layout.tsx';

export default function WorkspaceView() {
    return (
        <Layout>
            <div class='workspace-container'>
                <WorkspaceHeader />

                <main class='workspace-main'>
                    <WorkspaceSidebar />
                    <WorkspaceEditor />
                    <WorkspacePreview />
                </main>
            </div>
        </Layout>
    );
}
