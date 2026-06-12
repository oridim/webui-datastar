import type { ViewCallback } from '@oridim/datastar-serve';

import Layout from '../components/Layout.tsx';

export default (() => {
    return (
        <Layout title='Home'>
            <h1>Complex Routing</h1>

            <p>
                Click the links above to test Route Groups, Dynamic Route
                Params, and Query Params.
            </p>
        </Layout>
    );
}) satisfies ViewCallback;
