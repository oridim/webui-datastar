import type { RouterResponse } from './types.ts';

export const HTTP_STATUS = {
    continue: 100,
    switchingProtocols: 101,
    processing: 102,
    earlyHints: 103,
    ok: 200,
    created: 201,
    accepted: 202,
    nonAuthoritativeInformation: 203,
    noContent: 204,
    resetContent: 205,
    partialContent: 206,
    multiStatus: 207,
    alreadyReported: 208,
    imUsed: 226,
    multipleChoices: 300,
    movedPermanently: 301,
    found: 302,
    seeOther: 303,
    notModified: 304,
    useProxy: 305,
    temporaryRedirect: 307,
    permanentRedirect: 308,
    badRequest: 400,
    unauthorized: 401,
    paymentRequired: 402,
    forbidden: 403,
    notFound: 404,
    methodNotAllowed: 405,
    notAcceptable: 406,
    proxyAuthenticationRequired: 407,
    requestTimeout: 408,
    conflict: 409,
    gone: 410,
    lengthRequired: 411,
    preconditionFailed: 412,
    payloadTooLarge: 413,
    uriTooLong: 414,
    unsupportedMediaType: 415,
    rangeNotSatisfiable: 416,
    expectationFailed: 417,
    imATeapot: 418,
    misdirectedRequest: 421,
    unprocessableEntity: 422,
    locked: 423,
    failedDependency: 424,
    tooEarly: 425,
    upgradeRequired: 426,
    preconditionRequired: 428,
    tooManyRequests: 429,
    requestHeaderFieldsTooLarge: 431,
    unavailableForLegalReasons: 451,
    internalServerError: 500,
    notImplemented: 501,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeout: 504,
    httpVersionNotSupported: 505,
    variantAlsoNegotiates: 506,
    insufficientStorage: 507,
    loopDetected: 508,
    notExtended: 510,
    networkAuthenticationRequired: 511,
} as const;

export const HTTP_STATUS_TEXT = {
    continue: 'Continue',
    switchingProtocols: 'SwitchingProtocols',
    processing: 'Processing',
    earlyHints: 'EarlyHints',
    ok: 'Ok',
    created: 'Created',
    accepted: 'Accepted',
    nonAuthoritativeInformation: 'NonAuthoritativeInformation',
    noContent: 'NoContent',
    resetContent: 'ResetContent',
    partialContent: 'PartialContent',
    multiStatus: 'MultiStatus',
    alreadyReported: 'AlreadyReported',
    imUsed: 'IMUsed',
    multipleChoices: 'MultipleChoices',
    movedPermanently: 'MovedPermanently',
    found: 'Found',
    seeOther: 'SeeOther',
    notModified: 'NotModified',
    useProxy: 'UseProxy',
    temporaryRedirect: 'TemporaryRedirect',
    permanentRedirect: 'PermanentRedirect',
    badRequest: 'BadRequest',
    unauthorized: 'Unauthorized',
    paymentRequired: 'PaymentRequired',
    forbidden: 'Forbidden',
    notFound: 'NotFound',
    methodNotAllowed: 'MethodNotAllowed',
    notAcceptable: 'NotAcceptable',
    proxyAuthenticationRequired: 'ProxyAuthenticationRequired',
    requestTimeout: 'RequestTimeout',
    conflict: 'Conflict',
    gone: 'Gone',
    lengthRequired: 'LengthRequired',
    preconditionFailed: 'PreconditionFailed',
    payloadTooLarge: 'PayloadTooLarge',
    uriTooLong: 'URITooLong',
    unsupportedMediaType: 'UnsupportedMediaType',
    rangeNotSatisfiable: 'RangeNotSatisfiable',
    expectationFailed: 'ExpectationFailed',
    imATeapot: 'ImATeapot',
    misdirectedRequest: 'MisdirectedRequest',
    unprocessableEntity: 'UnprocessableEntity',
    locked: 'Locked',
    failedDependency: 'FailedDependency',
    tooEarly: 'TooEarly',
    upgradeRequired: 'UpgradeRequired',
    preconditionRequired: 'PreconditionRequired',
    tooManyRequests: 'TooManyRequests',
    requestHeaderFieldsTooLarge: 'RequestHeaderFieldsTooLarge',
    unavailableForLegalReasons: 'UnavailableForLegalReasons',
    internalServerError: 'InternalServerError',
    notImplemented: 'NotImplemented',
    badGateway: 'BadGateway',
    serviceUnavailable: 'ServiceUnavailable',
    gatewayTimeout: 'GatewayTimeout',
    httpVersionNotSupported: 'HTTPVersionNotSupported',
    variantAlsoNegotiates: 'VariantAlsoNegotiates',
    insufficientStorage: 'InsufficientStorage',
    loopDetected: 'LoopDetected',
    notExtended: 'NotExtended',
    networkAuthenticationRequired: 'NetworkAuthenticationRequired',
} as const;

export const HTTP_STATUS_TEXT_MAP = Object.fromEntries(
    Object.entries(HTTP_STATUS).map(([key, value]) => [
        value,
        HTTP_STATUS_TEXT[key as keyof typeof HTTP_STATUS_TEXT],
    ]),
) as HTTPStatusTextMap;

export const RESPONSE_NOT_FOUND = makeHTTPResponse({
    body: `<h1>${HTTP_STATUS.notFound} - ${HTTP_STATUS_TEXT.notFound}</h1>`,
    headers: { 'Content-Type': 'text/html' },
    status: HTTP_STATUS.notFound,
});

export type HTTPStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

export type HTTPStatusText =
    typeof HTTP_STATUS_TEXT[keyof typeof HTTP_STATUS_TEXT];

export type HTTPStatusTextMap = {
    [K in keyof typeof HTTP_STATUS as typeof HTTP_STATUS[K]]:
        typeof HTTP_STATUS_TEXT[K];
};

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
