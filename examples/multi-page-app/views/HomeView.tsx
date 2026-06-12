import type { ViewCallback } from '@oridim/datastar-serve';

import Layout from '../components/Layout.tsx';

export default (() => {
    return (
        <Layout title='Home'>
            <h1>Welcome Home</h1>

            <p>Simple multi-page example.</p>

            <p>
                Click the links in the navigation bar. Notice how the page
                updates instantly without a full browser reload thanks to
                Datastar!
            </p>
        </Layout>
    );
}) satisfies ViewCallback;
