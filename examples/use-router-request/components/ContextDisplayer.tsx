import { useRouterRequest } from '@oridim/webui-datastar';

export default function ContextDisplayer() {
    const routerRequest = useRouterRequest();
    const stringifiedRequest = JSON.stringify(routerRequest, null, 4);

    return (
        <pre>
        <code>
            {stringifiedRequest}
        </code>
        </pre>
    );
}
