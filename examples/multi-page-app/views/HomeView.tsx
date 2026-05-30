import Layout from './Layout.tsx';

export default function HomeView() {
    return (
        <Layout title='Home - Multi-Page App'>
            <h1>Welcome Home</h1>
            <p>Simple multi-page example.</p>

            <p>
                Click the links in the navigation bar. Notice how the page
                updates instantly without a full browser reload thanks to
                Datastar!
            </p>
        </Layout>
    );
}
