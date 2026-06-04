import { join as posixJoin } from '@std/path/posix';

import type { WebUI } from '@webui/deno-webui';

import type { Route, RouteItem } from './types.ts';
import { RESPONSE_NOT_FOUND } from './http.ts';

export type Router = readonly Route[];

function flattenRoutes(items: readonly RouteItem[]): readonly Route[] {
    return items.reduce((accumulatedRoutes: Route[], item) => {
        if (Array.isArray(item)) {
            accumulatedRoutes.push(...flattenRoutes(item));
        } else {
            accumulatedRoutes.push(item as Route);
        }

        return accumulatedRoutes;
    }, []);
}

export function defineGroup(
    prefix: string,
    items: RouteItem[],
): readonly Route[] {
    const flatRoutes = flattenRoutes(items);

    if (!prefix || prefix === '/') {
        return flatRoutes;
    }

    return flatRoutes.map((route) => {
        let joinedPath = posixJoin('/', prefix, route.path);

        if (joinedPath !== '/' && joinedPath.endsWith('/')) {
            joinedPath = joinedPath.slice(0, -1);
        }

        return {
            ...route,
            path: joinedPath,
            urlPattern: new URLPattern({ pathname: joinedPath }),
        };
    });
}

export function defineRouter(items: readonly RouteItem[]): Router {
    return flattenRoutes(items);
}

export async function matchRoute(
    router: Router,
    url: URL,
): Promise<Uint8Array | null> {
    for (const route of router) {
        const match = route.urlPattern.exec(url);

        if (match) {
            const response = await route.handler(url, match);

            if (response) {
                return response;
            }
        }
    }

    return null;
}

export function initRouter(window: WebUI, router: Router) {
    window.setFileHandler(async (url: URL) => {
        const responseBytes = await matchRoute(router, url);

        if (responseBytes) {
            return responseBytes;
        }

        return RESPONSE_NOT_FOUND;
    });
}
