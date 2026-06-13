import type { Signals, UnknownSignals } from '../utilities/datastar.ts';
import type { HTTPMethods } from '../utilities/http.ts';
import { HTTP_METHODS } from '../utilities/http.ts';
import type { Middleware, MiddlewareFactory } from '../utilities/middleware.ts';
import { withMiddleware } from '../utilities/middleware.ts';

import {
    Route,
    RouteCallback,
    RouteItem,
    StreamChannelCallback,
    StreamRouteCallback,
    ViewCallback,
} from './types.ts';

export type RouteMiddleware<Path extends string = string> = Middleware<
    RouteCallback<Path>
>;

export type StreamChannelMiddleware<
    Path extends string = string,
    InputSignals extends Signals<unknown> = UnknownSignals,
    OutputSignals extends Signals<unknown> = InputSignals,
> = Middleware<StreamChannelCallback<Path, InputSignals, OutputSignals>>;

export type StreamMiddleware<
    Path extends string = string,
    InputSignals extends Signals<unknown> = UnknownSignals,
    OutputSignals extends Signals<unknown> = InputSignals,
> = Middleware<StreamRouteCallback<Path, InputSignals, OutputSignals>>;

export type ViewMiddleware<Path extends string = string> = Middleware<
    ViewCallback<Path>
>;

export type RouteMiddlewareFactory<
    Path extends string = string,
    // **HACK:** We need to accept any type of parameters and we cannot type it as
    // `unknown[]` due to how TypeScript handles function parameters.
    // deno-lint-ignore no-explicit-any
    Args extends any[] = any[],
> = MiddlewareFactory<RouteCallback<Path>, Args>;

export type StreamMiddlewareFactory<
    Path extends string = string,
    InputSignals extends Signals<unknown> = UnknownSignals,
    OutputSignals extends Signals<unknown> = InputSignals,
    // **HACK:** Ditto.
    // deno-lint-ignore no-explicit-any
    Args extends any[] = any[],
> = MiddlewareFactory<
    StreamRouteCallback<Path, InputSignals, OutputSignals>,
    Args
>;

export type ViewMiddlewareFactory<
    Path extends string = string,
    // **HACK:** Ditto.
    // deno-lint-ignore no-explicit-any
    Args extends any[] = any[],
> = MiddlewareFactory<ViewCallback<Path>, Args>;

export function useMiddleware(
    middlewares: readonly Middleware<RouteCallback>[],
    item: Route,
): Route;
export function useMiddleware(
    middlewares: readonly Middleware<RouteCallback>[],
    item: Exclude<RouteItem, Route>,
): Exclude<RouteItem, Route>;
export function useMiddleware(
    middlewares: readonly Middleware<RouteCallback>[],
    item: RouteItem,
): RouteItem;
export function useMiddleware(
    middlewares: readonly Middleware<RouteCallback>[],
    item: RouteItem,
): RouteItem {
    if (item instanceof Array) {
        return item.map((route) => useMiddleware(middlewares, route));
    }

    return {
        ...item,
        callback: withMiddleware(middlewares, item.callback),
    };
}

export const withMethod = ((method: HTTPMethods) => {
    return (callback) => {
        return (context) => {
            if (context.request.method !== method) return;
            return callback(context);
        };
    };
}) satisfies RouteMiddlewareFactory;

export const withCONNECT = withMethod(HTTP_METHODS.connect);

export const withDELETE = withMethod(HTTP_METHODS.delete);

export const withGET = withMethod(HTTP_METHODS.get);

export const withHEAD = withMethod(HTTP_METHODS.head);

export const withOPTIONS = withMethod(HTTP_METHODS.options);

export const withPATCH = withMethod(HTTP_METHODS.patch);

export const withPOST = withMethod(HTTP_METHODS.post);

export const withPUT = withMethod(HTTP_METHODS.put);

export const withTRACE = withMethod(HTTP_METHODS.trace);
