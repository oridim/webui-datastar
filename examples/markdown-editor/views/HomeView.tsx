import { FolderOpen } from 'npm:lucide-preact@1.17.0';

import OpenWorkspaceButton from '../components/OpenWorkspaceButton.tsx';

import Layout from '../components/Layout.tsx';

export default function HomeView() {
    return (
        <Layout>
            <div class='home-container'>
                <FolderOpen class='home-icon' />

                <h1 class='home-title'>
                    Markdown Editor
                </h1>

                <p class='home-subtitle'>
                    A minimalist Markdown workspace.
                </p>

                <OpenWorkspaceButton />
            </div>
        </Layout>
    );
}
