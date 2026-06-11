import { useRouterRequestContext } from '@oridim/datastar-serve';

export default function ContextDisplayer() {
    const routerRequest = useRouterRequestContext();
    const stringifiedRequest = JSON.stringify(routerRequest, null, 4);

    return (
        <pre>
        <code>
            {stringifiedRequest}
        </code>
        </pre>
    );
}
