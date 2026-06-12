import type { ViewCallback } from '@oridim/datastar-serve';

import ContextDisplayer from '../components/ContextDisplayer.tsx';
import Layout from '../components/Layout.tsx';

export default (() => {
    return (
        <Layout title='Other'>
            <h1>I'm the other view!</h1>
            <a href='/'>Click here to go back to the home view.</a>
            <ContextDisplayer />
        </Layout>
    );
}) satisfies ViewCallback;
