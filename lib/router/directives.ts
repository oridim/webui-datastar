import { contentType } from '@std/media-types';
import { extname, globToRegExp, join } from '@std/path';
import { join as posixJoin } from '@std/path/posix';

import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';

import { h } from '../preact/components.ts';
import { render } from '../preact/render.ts';
import type {
    Signals,
    StreamOptions,
    UnknownSignals,
} from '../utilities/datastar.ts';
import { HTTP_STATUS } from '../utilities/http.ts';
import { isAsyncIterable, isIterable } from '../utilities/types.ts';

import { RouterRequestContext } from './hooks.ts';
import type {
    Route,
    RouteCallback,
    RouteItem,
    StreamRequestContext,
    StreamRouteCallback,
    ViewCallback,
} from './types.ts';
import {
    determineContentLength,
    flattenRoutes,
    processStreamResponse,
    tryReadFile,
} from './utilities.ts';

const RESPONSE_NO_CONTENT = new Response(null, {
    status: HTTP_STATUS.noContent,
});

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
        callback,
        path,
        urlPattern: new URLPattern({ pathname: path }),
    };
}

export function defineConstantFile(
    path: string,
    content: BodyInit,
): Route {
    const fileExtension = extname(path);
    const mimeType = contentType(fileExtension) ?? 'application/octet-stream';

    const contentLength = determineContentLength(content);
    const headers: Record<string, string> = {
        'Content-Type': mimeType,
    };

    if (contentLength !== undefined) {
        headers['Content-Length'] = contentLength.toString();
    }

    return defineRoute(
        path,
        () => new Response(content, { headers }),
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

    return defineRoute(path, (context) => {
        const file = context.match.pathname.groups['0'];

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
        async (context) => {
            const renderedElement = await view(context);
            const renderedContext = h(
                RouterRequestContext.Provider,
                { value: context },
                renderedElement,
            );

            const renderedPayload = render(renderedContext);
            const htmlString = `<!DOCTYPE html>\n${renderedPayload}`;

            const bodyBytes = new TextEncoder().encode(htmlString);

            return new Response(bodyBytes, {
                headers: {
                    'Content-Type': 'text/html',
                    'Content-Length': bodyBytes.byteLength.toString(),
                },
            });
        },
    );
}

export function defineStream<
    InputSignals extends Signals<unknown> = UnknownSignals,
    OutputSignals extends Signals<unknown> = InputSignals,
    Path extends string = string,
>(
    path: Path,
    callback: StreamRouteCallback<Path, InputSignals, OutputSignals>,
    options: StreamOptions = {},
): Route {
    return defineRoute(path, async (context) => {
        const reader = await ServerSentEventGenerator.readSignals(
            context.request,
        );

        const signals = (reader.success ? reader.signals : {}) as InputSignals;
        const streamContext = Object.assign({}, context, {
            signals,
        }) satisfies StreamRequestContext<Path, InputSignals>;

        const result = await callback(streamContext);

        if (!result) {
            return RESPONSE_NO_CONTENT.clone();
        }

        if (isAsyncIterable(result) || isIterable(result)) {
            return ServerSentEventGenerator.stream(
                async (stream) => {
                    for await (const response of result) {
                        processStreamResponse(stream, response);
                    }
                },
                options,
            );
        }

        return ServerSentEventGenerator.stream(
            (stream) => {
                processStreamResponse(stream, result);
            },
            options,
        );
    });
}
