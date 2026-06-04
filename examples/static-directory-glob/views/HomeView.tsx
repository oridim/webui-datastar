import Layout from '../components/Layout.tsx';

export default function HomeView() {
    return (
        <Layout title='Home - Co-Located CSS'>
            <h1 class='home-view--title'>I'm the home view!</h1>
            <a href='/other'>Click here to go to the other view!</a>
        </Layout>
    );
}
