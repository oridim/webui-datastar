import type { AnyFunction } from './types.ts';

export type Middleware<T extends AnyFunction = AnyFunction> = (
    callback: T,
) => T;

export type MiddlewareFactory<T extends AnyFunction = AnyFunction> = (
    ...args: unknown[]
) => Middleware<T>;

export function withMiddleware<T extends AnyFunction = AnyFunction>(
    middlewares: readonly Middleware<T>[],
    callback: T,
): T {
    return middlewares.reduceRight(
        (accumulatedCallback, middleware) => middleware(accumulatedCallback),
        callback,
    );
}
