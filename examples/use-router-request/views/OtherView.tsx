import ContextDisplayer from '../components/ContextDisplayer.tsx';

import Layout from './Layout.tsx';

export default function OtherView() {
    return (
        <Layout title='Other - useRouterRequest'>
            <h1>I'm the other view!</h1>
            <a href='/'>Click here to go back to the home view.</a>
            <ContextDisplayer />
        </Layout>
    );
}
