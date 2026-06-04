import Layout from '../components/Layout.tsx';

export default async function OtherView() {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return (
        <Layout title='Other Page'>
            <h1>Other Page</h1>
            <p>
                The Shell Loader should have appeared while you waited for the
                server to finish rendering this page!
            </p>
        </Layout>
    );
}
