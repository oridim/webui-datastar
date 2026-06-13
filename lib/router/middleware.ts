import type { Signals, UnknownSignals } from '../utilities/datastar.ts';
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
    Args extends unknown[] = unknown[],
> = MiddlewareFactory<RouteCallback<Path>, Args>;

export type StreamMiddlewareFactory<
    Path extends string = string,
    InputSignals extends Signals<unknown> = UnknownSignals,
    OutputSignals extends Signals<unknown> = InputSignals,
    Args extends unknown[] = unknown[],
> = MiddlewareFactory<
    StreamRouteCallback<Path, InputSignals, OutputSignals>,
    Args
>;

export type ViewMiddlewareFactory<
    Path extends string = string,
    Args extends unknown[] = unknown[],
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
