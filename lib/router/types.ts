import type { JSX } from '../preact/components.ts';

export type ExtractRouteParams<T extends string = string> = T extends
    `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${string}:${infer Param}` ? Param
    : never;

export type MapRouteParams<Path extends string = string> =
    [ExtractRouteParams<Path>] extends [never] ? Record<string, never>
        : Record<ExtractRouteParams<Path>, string>;

export type RouteCallback<Path extends string = string> = (
    context: RequestContext<Path>,
) => Promise<Response | null> | Response | null;

export type RouteItem = Route | readonly RouteItem[];

export type ViewCallback<Path extends string = string> = (
    context: RequestContext<Path>,
) => JSX.Element | Promise<JSX.Element>;

export interface RequestContext<Path extends string = string> {
    readonly match: URLPatternResult;

    readonly params: MapRouteParams<Path>;

    readonly request: Request;
}

export interface Route {
    readonly callback: RouteCallback;

    readonly path: string;

    readonly urlPattern: URLPattern;
}
