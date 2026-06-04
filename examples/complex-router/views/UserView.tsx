import type { RouterRequest } from '@oridim/webui-datastar';

import Layout from '../components/Layout.tsx';

export default function UserView({ params }: RouterRequest<'/:id'>) {
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
}
