import Layout from '../components/Layout.tsx';

export default function AboutView() {
    return (
        <Layout title='About - Multi-Page App'>
            <h1>About Us</h1>
            <p>
                We are testing out Deno, WebUI, and Datastar together as a
                complete packaage.
            </p>

            <ul>
                <li>Zero build systems</li>
                <li>Zero client-side bespoke JS</li>
                <li>All controlled through the server</li>
            </ul>
        </Layout>
    );
}
