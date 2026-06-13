import type { AnyFunction } from './types.ts';

export type Middleware<T extends AnyFunction = AnyFunction> = (
    callback: T,
) => T;

export function withMiddleware<T extends AnyFunction = AnyFunction>(
    middlewares: readonly Middleware<T>[],
    callback: T,
): T {
    return middlewares.reduceRight(
        (accumulatedCallback, middleware) => middleware(accumulatedCallback),
        callback,
    );
}
