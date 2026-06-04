import type { RouterRequest } from '@oridim/webui-datastar';
import Layout from '../components/Layout.tsx';

export default function SearchView({ url }: RouterRequest<'/search'>) {
    const query = url.searchParams.get('q') || 'Nothing';
    const sort = url.searchParams.get('sort') || 'Default';

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
}
