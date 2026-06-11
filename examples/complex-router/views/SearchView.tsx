import type { ViewCallback } from '@oridim/datastar-serve';

import Layout from '../components/Layout.tsx';

export default (({ url }) => {
    const { searchParams } = url;

    const query = searchParams.get('q') || 'Nothing';
    const sort = searchParams.get('sort') || 'Default';

    return (
        <Layout title={`Search: ${query}`}>
            <h1>Search Results</h1>

            <p>
                <strong>Searched for:</strong> {query}
            </p>

            <p>
                <strong>Sorted by:</strong> {sort}
            </p>

            <p>
                <em>
                    Query parameters (ex.{' '}
                    <code>?q=...</code>) via the framework.
                </em>
            </p>
        </Layout>
    );
}) satisfies ViewCallback<'/search'>;
