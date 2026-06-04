import { Route, RouteItem } from './types.ts';

export function flattenRoutes(items: readonly RouteItem[]): readonly Route[] {
    return items.reduce((accumulatedRoutes: Route[], item) => {
        if (Array.isArray(item)) {
            accumulatedRoutes.push(...flattenRoutes(item));
        } else {
            accumulatedRoutes.push(item as Route);
        }

        return accumulatedRoutes;
    }, []);
}
