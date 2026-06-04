import { makeContext, useContext } from '../preact/context.ts';

import { RouterRequest } from './types.ts';

export const RouterRequestContext = makeContext<
    RouterRequest<string> | null
>(null);

export function useRouterRequest<Path extends string>(): RouterRequest<Path> {
    const request = useContext(RouterRequestContext);

    if (!request) {
        throw new Error(
            "bad dispatch to 'useRouterRequest' (cannot use context outside of 'RouterRequestContext')",
        );
    }

    return request;
}
