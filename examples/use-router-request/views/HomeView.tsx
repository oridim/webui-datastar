import ContextDisplayer from '../components/ContextDisplayer.tsx';
import Layout from '../components/Layout.tsx';

export default function HomeView() {
    return (
        <Layout title='Home - useRouterRequest'>
            <h1>I'm the home view!</h1>
            <a href='/other/some-value'>Click here to go to the other view!</a>
            <ContextDisplayer />
        </Layout>
    );
}
