import {
    INTEGRATIONS_GROUP,
    IntegrationsHead,
} from './integrations/datastar.tsx';
import { POLYFILLS_GROUP, PolyfillsHead } from './integrations/polyfills.tsx';

import type { JSX } from './preact/components.ts';

import { defineGroup } from './router/directives.ts';
import type { Router } from './router/router.ts';
import { defineRouter, matchRoute } from './router/router.ts';
import type { RouteItem } from './router/types.ts';

import { HTTP_STATUS, HTTP_STATUS_TEXT } from './utilities/http.ts';

const RESPONSE_INTERNAL_SERVER_ERROR = new Response(
    `<h1>${HTTP_STATUS.internalServerError} - ${HTTP_STATUS_TEXT.internalServerError}</h1>`,
    {
        status: HTTP_STATUS.internalServerError,
        headers: { 'Content-Type': 'text/html' },
    },
);

const RESPONSE_NOT_FOUND = new Response(
    `<h1>${HTTP_STATUS.notFound} - ${HTTP_STATUS_TEXT.notFound}</h1>`,
    {
        status: HTTP_STATUS.notFound,
        headers: { 'Content-Type': 'text/html' },
    },
);

export interface BaseServeOptions {
    readonly router?: Router;
}

export interface TCPServeOptions extends BaseServeOptions {
    readonly serve?:
        | Deno.ServeTcpOptions
        | (Deno.ServeTcpOptions & Deno.TlsCertifiedKeyPem);
}

export interface UnixServeOptions extends BaseServeOptions {
    readonly serve: Deno.ServeUnixOptions;
}

export interface VSockServeOptions extends BaseServeOptions {
    readonly serve: Deno.ServeVsockOptions;
}

export function defineFrameworkRouter(items: RouteItem[]): Router {
    return defineRouter([
        defineGroup('/__datastar-serve', [
            ...POLYFILLS_GROUP,
            ...INTEGRATIONS_GROUP,
        ]),

        ...items,
    ]);
}

export function FrameworkHead(): JSX.Element {
    return (
        <>
            <PolyfillsHead />
            <IntegrationsHead />
        </>
    );
}

export function serve(
    options: TCPServeOptions,
): Deno.HttpServer<Deno.NetAddr>;
export function serve(
    options: UnixServeOptions,
): Deno.HttpServer<Deno.UnixAddr>;
export function serve(
    options: VSockServeOptions,
): Deno.HttpServer<Deno.VsockAddr>;
export function serve(
    options:
        | TCPServeOptions
        | UnixServeOptions
        | VSockServeOptions,
): Deno.HttpServer<Deno.Addr> {
    const { router, serve: serveOptions = {} } = options;

    return Deno.serve(serveOptions as Deno.ServeOptions, async (request) => {
        if (router) {
            let response: Response | null;

            try {
                response = await matchRoute(router, request);
            } catch (error) {
                console.error(error);
                return RESPONSE_INTERNAL_SERVER_ERROR.clone();
            }

            if (response) {
                return response;
            }
        }

        return RESPONSE_NOT_FOUND.clone();
    });
}
