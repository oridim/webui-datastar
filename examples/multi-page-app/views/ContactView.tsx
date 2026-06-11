import type { ViewCallback } from '@oridim/datastar-serve';

import Layout from '../components/Layout.tsx';

export default (() => {
    return (
        <Layout title='Contact'>
            <h1>Contact</h1>
            <p>Don't actually contact us. Thx.</p>
        </Layout>
    );
}) satisfies ViewCallback;
