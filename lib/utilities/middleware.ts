import type { AnyFunction } from './types.ts';

export type Middleware<Callback extends AnyFunction = AnyFunction> = (
    callback: Callback,
) => Callback;

export type MiddlewareFactory<
    Callback extends AnyFunction = AnyFunction,
    // **HACK:** We need to accept any type of parameters and we cannot type it as
    // `unknown[]` due to how TypeScript handles function parameters.
    // deno-lint-ignore no-explicit-any
    Args extends any[] = any[],
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
