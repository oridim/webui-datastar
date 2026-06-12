import type { ViewCallback } from '@oridim/datastar-serve';

import ContextDisplayer from '../components/ContextDisplayer.tsx';
import Layout from '../components/Layout.tsx';

export default (() => {
    return (
        <Layout title='Home'>
            <h1>I'm the home view!</h1>
            <a href='/other/some-value'>Click here to go to the other view!</a>
            <ContextDisplayer />
        </Layout>
    );
}) satisfies ViewCallback;
