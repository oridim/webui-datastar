import { contentType } from '@std/media-types';
import { extname, globToRegExp, join } from '@std/path';
import { join as posixJoin } from '@std/path/posix';

import { h } from '../preact/components.ts';
import { render } from '../preact/render.ts';

import { RouterRequestContext } from './hooks.ts';
import { makeHTTPResponse } from './http.ts';
import type {
    MapRouteParams,
    Route,
    RouteCallback,
    RouteItem,
    RouterResponse,
    ViewCallback,
} from './types.ts';
import { flattenRoutes } from './utilities.ts';

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
                params: (match.pathname.groups || {}) as MapRouteParams<Path>,
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
