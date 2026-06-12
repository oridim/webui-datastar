import type { ViewCallback } from '@oridim/datastar-serve';

import Layout from '../components/Layout.tsx';

export default (({ params }) => {
    return (
        <Layout title={`User ${params.id}`}>
            <h1>User Profile</h1>

            <p>
                You are viewing the profile for user ID:{' '}
                <strong>{params.id}</strong>
            </p>

            <p>
                <em>
                    Strictly typed route params via the framework.
                </em>
            </p>
        </Layout>
    );
}) satisfies ViewCallback<'/:id'>;
