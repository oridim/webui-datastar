import { makeContext, useContext } from '../preact/context.ts';

import { RequestContext } from './types.ts';

export const RouterRequestContext = makeContext<
    RequestContext<string> | null
>(null);

export function useRouterRequestContext<
    Path extends string = string,
>(): RequestContext<
    Path
> {
    const request = useContext(RouterRequestContext);

    if (!request) {
        throw new Error(
            "bad dispatch to 'useRouterRequestContext' (cannot use context outside of 'RouterRequestContext')",
        );
    }

    return request;
}
