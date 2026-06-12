import type { ViewCallback } from '@oridim/datastar-serve';

import Layout from '../components/Layout.tsx';

export default (() => {
    return (
        <Layout title='Other'>
            <h1 class='other-view--title'>I'm the other view!</h1>
            <a href='/'>Click here to go back to the home view.</a>
        </Layout>
    );
}) satisfies ViewCallback;
