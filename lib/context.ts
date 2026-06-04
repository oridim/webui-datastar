import { createContext, useContext } from './preact.ts';

import type { RouterRequest } from './router.ts';

export const RouterRequestContext = createContext<
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
