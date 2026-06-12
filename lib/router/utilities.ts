import { contentType } from '@std/media-types';
import { extname } from '@std/path';

import type { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';

import { render } from '../preact/render.ts';
import { HTTP_METHODS } from '../utilities/http.ts';

import type {
    RequestContext,
    Route,
    RouteItem,
    StreamResponse,
} from './types.ts';

export function determineContentLength(content: BodyInit): number | undefined {
    if (content instanceof ArrayBuffer || ArrayBuffer.isView(content)) {
        return content.byteLength;
    } else if (content instanceof Blob) {
        return content.size;
    } else if (typeof content === 'string') {
        return new TextEncoder().encode(content).byteLength;
    }
}

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

export function isFormRequest(context: RequestContext): boolean {
    const { request, url } = context;

    const { headers, method } = request;
    const { searchParams } = url;

    switch (method.toUpperCase()) {
        case HTTP_METHODS.patch:
        case HTTP_METHODS.post:
        case HTTP_METHODS.put: {
            const contentType = headers.get('content-type') ?? '';

            return (
                contentType.includes('application/x-www-form-urlencoded') ||
                contentType.includes('multipart/form-data')
            );
        }

        case HTTP_METHODS.delete:
        case HTTP_METHODS.get:
            return searchParams.has('datastar') ? false : searchParams.size > 0;
    }

    return false;
}

export function processStreamResponse(
    stream: ServerSentEventGenerator,
    response: StreamResponse,
): void {
    for (const [key, payload] of Object.entries(response)) {
        if (!payload) continue;

        switch (key as keyof StreamResponse) {
            case 'patchElements': {
                const { elements, options } = payload;
                const elementsString = typeof elements === 'string'
                    ? elements
                    : render(elements);

                stream.patchElements(elementsString, options);
                break;
            }
            case 'patchSignals': {
                const { signals, options } = payload;
                const signalsString = typeof signals === 'string'
                    ? signals
                    : JSON.stringify(signals);

                stream.patchSignals(signalsString, options);
                break;
            }
            case 'executeScript': {
                const { script, options } = payload;

                stream.executeScript(script, options);
                break;
            }
            case 'removeElements': {
                const { selector, elements, options } = payload;
                const elementsString = elements
                    ? (typeof elements === 'string'
                        ? elements
                        : render(elements))
                    : undefined;

                stream.removeElements(selector, elementsString, options);
                break;
            }
            case 'removeSignals': {
                const { signalKeys, options } = payload;

                stream.removeSignals(signalKeys, options);
                break;
            }
        }
    }
}

export async function tryReadFile(
    filePath: string | URL,
): Promise<Response | null> {
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

    return new Response(content, {
        headers: {
            'Content-Type': mimeType,
            'Content-Length': content.byteLength.toString(),
        },
    });
}
