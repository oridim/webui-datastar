import { contentType } from '@std/media-types';
import { extname, globToRegExp, join } from '@std/path';
import { join as posixJoin } from '@std/path/posix';

import { render } from 'preact-render-to-string';

import { h } from '../preact.ts';

import { RouterRequestContext } from './hooks.ts';
import { defineRoute } from './router.ts';
import type { Route, RouterResponse, ViewCallback } from './types.ts';

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
