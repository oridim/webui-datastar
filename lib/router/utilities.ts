import { contentType } from '@std/media-types';
import { extname } from '@std/path';

import type { Route, RouteItem } from './types.ts';

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
