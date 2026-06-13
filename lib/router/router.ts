import type { MapRouteParams, Route, RouteItem } from './types.ts';
import { flattenRoutes } from './utilities.ts';

export type Router = readonly Route[];

export function defineRouter(items: Exclude<RouteItem, Route>): Router {
    return flattenRoutes(items);
}

export async function matchRoute(
    router: Router,
    request: Request,
): Promise<Response | null | void> {
    const url = new URL(request.url);

    for (const { callback, urlPattern } of router) {
        const match = urlPattern.exec(url);

        if (match) {
            const response = await callback({
                match,
                params: match.pathname.groups as MapRouteParams,
                request,
                url,
            });

            if (response !== undefined) {
                return response;
            }
        }
    }
}
