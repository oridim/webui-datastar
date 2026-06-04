import { contentType } from '@std/media-types';
import { extname, globToRegExp, join } from '@std/path';
import { join as posixJoin } from '@std/path/posix';

import type { WebUI } from '@webui/deno-webui';
import { render } from 'preact-render-to-string';

import { RouterRequestContext } from './context.ts';
import type { HTTPStatus } from './http.ts';
import { HTTP_STATUS, HTTP_STATUS_TEXT, HTTP_STATUS_TEXT_MAP } from './http.ts';
import type { JSX } from './preact.ts';
import { h } from './preact.ts';

const RESPONSE_NOT_FOUND = makeHTTPResponse({
    body: `<h1>${HTTP_STATUS.notFound} - ${HTTP_STATUS_TEXT.notFound}</h1>`,
    headers: { 'Content-Type': 'text/html' },
    status: HTTP_STATUS.notFound,
});

type ExtractRouteParams<T extends string> = T extends
    `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${string}:${infer Param}` ? Param
    : never;

export type RouteCallback<Path extends string> = (
    request: RouterRequest<Path>,
) => Promise<RouterResponse | null> | RouterResponse | null;

export type RouteItem = Route | readonly RouteItem[];

export type RouteParams<Path extends string> =
    [ExtractRouteParams<Path>] extends [never] ? Record<string, never>
        : Record<ExtractRouteParams<Path>, string>;

export type Router = readonly Route[];

export type ResponseBody =
    | string
    | Uint8Array
    | Record<string, unknown>
    | unknown[];

export interface Route {
    handler: (url: URL, match: URLPatternResult) => Promise<Uint8Array | null>;

    readonly path: string;

    readonly urlPattern: URLPattern;
}

export interface RouterRequest<Path extends string> {
    readonly match: URLPatternResult;

    readonly params: RouteParams<Path>;

    readonly url: URL;
}

export interface RouterResponse {
    readonly body: ResponseBody;

    readonly headers?: Record<string, string>;

    readonly status?: HTTPStatus;
}

export type ViewCallback<Path extends string> = (
    request: RouterRequest<Path>,
) => JSX.Element | Promise<JSX.Element>;

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

function makeHTTPResponse(response: RouterResponse): Uint8Array {
    const { body, headers = {}, status = HTTP_STATUS.ok } = response;
    const statusText = HTTP_STATUS_TEXT_MAP[status];

    let defaultMimeType: string;
    let encodedBody: Uint8Array;

    if (body instanceof Uint8Array) {
        encodedBody = body;
        defaultMimeType = 'application/octet-stream';
    } else if (typeof body === 'string') {
        encodedBody = new TextEncoder().encode(body);
        defaultMimeType = 'text/plain';
    } else {
        encodedBody = new TextEncoder().encode(JSON.stringify(body));
        defaultMimeType = 'application/json';
    }

    headers['Content-Type'] ??= defaultMimeType;
    headers['Content-Length'] = encodedBody.length.toString();

    let headerString = `HTTP/1.1 ${status} ${statusText}\r\n`;

    for (const [key, value] of Object.entries(headers)) {
        headerString += `${key}: ${value}\r\n`;
    }

    headerString += `\r\n`;

    const encodedHeaders = new TextEncoder().encode(headerString);
    const responseBytes = new Uint8Array(
        encodedHeaders.length + encodedBody.length,
    );

    responseBytes.set(encodedHeaders, 0);
    responseBytes.set(encodedBody, encodedHeaders.length);

    return responseBytes;
}

async function tryReadFile(
    filePath: string | URL,
): Promise<RouterResponse | null> {
    let content: Uint8Array<ArrayBuffer>;
    try {
        content = await Deno.readFile(filePath);
    } catch {
        return null;
    }

    const pathname = filePath instanceof URL
        ? filePath.pathname
        : filePath.replace(/^file:\/\//, '');

    const fileExtension = extname(pathname);
    const mimeType = contentType(fileExtension) ?? 'application/octet-stream';

    return {
        body: content,
        headers: { 'Content-Type': mimeType },
    };
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

export function defineRoute<Path extends string>(
    path: Path,
    callback: RouteCallback<Path>,
): Route {
    return {
        path,
        urlPattern: new URLPattern({ pathname: path }),
        handler: async (url, match) => {
            const response = await callback({
                params: (match.pathname.groups || {}) as RouteParams<Path>,
                url,
                match,
            });

            if (response) {
                return makeHTTPResponse(response);
            }

            return null;
        },
    };
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

export function defineConstantFile(
    path: string,
    content: string | Uint8Array,
): Route {
    const fileExtension = extname(path);
    const mimeType = contentType(fileExtension) ?? 'application/octet-stream';

    const response = {
        body: content,
        headers: {
            'Content-Type': mimeType,
        },
    } satisfies RouterResponse;

    return defineRoute(
        path,
        () => response,
    );
}

export function defineStaticFile(
    path: string,
    filePath: string | URL,
): Route {
    return defineRoute(path, () => tryReadFile(filePath));
}

export function defineStaticDirectory(
    basePath: string,
    directoryPath: string | URL,
    glob?: string,
): Route {
    const path = posixJoin('/', basePath, '*');
    const regexFilter = glob ? globToRegExp(glob) : null;

    return defineRoute(path, (request) => {
        const file = request.match.pathname.groups['0'];

        if (!file || (regexFilter && !regexFilter.test(file))) {
            return null;
        }

        let filePath: string | URL;

        if (directoryPath instanceof URL) {
            const baseURL = directoryPath.href.endsWith('/')
                ? directoryPath.href
                : `${directoryPath.href}/`;

            filePath = new URL(file, baseURL);
        } else {
            filePath = join(directoryPath, file);
        }

        return tryReadFile(filePath);
    });
}

export function defineView<Path extends string>(
    path: Path,
    view: ViewCallback<Path>,
): Route {
    return defineRoute(
        path,
        async (request) => {
            const renderedElement = await view(request);
            const renderedContext = h(
                RouterRequestContext.Provider,
                { value: request },
                renderedElement,
            );

            const renderedPayload = render(renderedContext);

            return {
                headers: { 'Content-Type': 'text/html' },
                body: `<!DOCTYPE html>\n${renderedPayload}`,
            };
        },
    );
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
