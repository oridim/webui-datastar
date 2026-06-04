import type { WebUI } from '@webui/deno-webui';

import { RESPONSE_NOT_FOUND } from './http.ts';
import type { Route, RouteItem } from './types.ts';
import { flattenRoutes } from './utilities.ts';

export type Router = readonly Route[];

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
