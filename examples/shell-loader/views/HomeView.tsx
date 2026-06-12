import type { ViewCallback } from '@oridim/datastar-serve';

import Layout from '../components/Layout.tsx';

export default (() => {
    return (
        <Layout title='Home'>
            <h1>Home Page</h1>
            <p>
                Click "Other Page" in the navigation above to see the app-wide
                Shell Loader stretch across the top of the screen.
            </p>
        </Layout>
    );
}) satisfies ViewCallback;
