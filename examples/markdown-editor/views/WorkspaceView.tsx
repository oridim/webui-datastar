import WorkspaceEditor from '../components/WorkspaceEditor.tsx';
import WorkspaceHeader from '../components/WorkspaceHeader.tsx';
import WorkspacePreview from '../components/WorkspacePreview.tsx';
import WorkspaceSidebar from '../components/WorkspaceSidebar.tsx';

import Layout from '../components/Layout.tsx';

export default function WorkspaceView() {
    return (
        <Layout>
            <div class='workspace-view'>
                <WorkspaceHeader />

                <main class='workspace-view--main'>
                    <WorkspaceSidebar />
                    <WorkspaceEditor />
                    <WorkspacePreview />
                </main>
            </div>
        </Layout>
    );
}
