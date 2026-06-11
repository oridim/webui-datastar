import type { ViewCallback } from '@oridim/datastar-serve';

import Layout from '../components/Layout.tsx';

export default (() => {
    return (
        <Layout title='Home'>
            <h1 class='home-view--title'>I'm the home view!</h1>
            <a href='/other'>Click here to go to the other view!</a>
        </Layout>
    );
}) satisfies ViewCallback;
