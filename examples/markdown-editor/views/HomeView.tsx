import type { ViewCallback } from '@oridim/datastar-serve';
import { FolderOpen } from 'npm:lucide-preact@1.17.0';

import OpenWorkspaceButton from '../components/OpenWorkspaceButton.tsx';

import Layout from '../components/Layout.tsx';

export default (() => {
    return (
        <Layout>
            <div class='home-view'>
                <FolderOpen class='home-view--icon' />

                <h1 class='home-view--title'>
                    Markdown Editor
                </h1>

                <p class='home-view--sub-title'>
                    A minimalist Markdown workspace.
                </p>

                <OpenWorkspaceButton />
            </div>
        </Layout>
    );
}) satisfies ViewCallback;
