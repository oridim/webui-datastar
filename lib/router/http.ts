import {
    HTTP_STATUS,
    HTTP_STATUS_TEXT,
    HTTP_STATUS_TEXT_MAP,
} from '../utilities/http.ts';

import type { RouterResponse } from './types.ts';

export const RESPONSE_NOT_FOUND = makeHTTPResponse({
    body: `<h1>${HTTP_STATUS.notFound} - ${HTTP_STATUS_TEXT.notFound}</h1>`,
    headers: { 'Content-Type': 'text/html' },
    status: HTTP_STATUS.notFound,
});

export function makeHTTPResponse(response: RouterResponse): Uint8Array {
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
