import type { AnyFunction } from './types.ts';

export type Middleware<Callback extends AnyFunction = AnyFunction> = (
    callback: Callback,
) => Callback;

export type MiddlewareFactory<
    Callback extends AnyFunction = AnyFunction,
    Args extends unknown[] = unknown[],
> = (...args: Args) => Middleware<Callback>;

export function withMiddleware<Callback extends AnyFunction = AnyFunction>(
    middlewares: readonly Middleware<Callback>[],
    callback: Callback,
): Callback {
    return middlewares.reduceRight(
        (accumulatedCallback, middleware) => middleware(accumulatedCallback),
        callback,
    );
}
