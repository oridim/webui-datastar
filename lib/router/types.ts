import type { HTTPStatus } from '../utilities/http.ts';

import type { JSX } from '../preact.ts';

export type ExtractRouteParams<T extends string> = T extends
    `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${string}:${infer Param}` ? Param
    : never;

export type MapRouteParams<Path extends string> =
    [ExtractRouteParams<Path>] extends [never] ? Record<string, never>
        : Record<ExtractRouteParams<Path>, string>;

export type RouteCallback<Path extends string> = (
    request: RouterRequest<Path>,
) => Promise<RouterResponse | null> | RouterResponse | null;

export type RouteItem = Route | readonly RouteItem[];

export type ResponseBody =
    | string
    | Uint8Array
    | Record<string, unknown>
    | unknown[];

export type ViewCallback<Path extends string> = (
    request: RouterRequest<Path>,
) => JSX.Element | Promise<JSX.Element>;

export interface Route {
    handler: (url: URL, match: URLPatternResult) => Promise<Uint8Array | null>;

    readonly path: string;

    readonly urlPattern: URLPattern;
}

export interface RouterRequest<Path extends string> {
    readonly match: URLPatternResult;

    readonly params: MapRouteParams<Path>;

    readonly url: URL;
}

export interface RouterResponse {
    readonly body: ResponseBody;

    readonly headers?: Record<string, string>;

    readonly status?: HTTPStatus;
}
