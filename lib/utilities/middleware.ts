import { AsyncLocalStorage } from 'node:async_hooks';

import type { AnyFunction } from './types.ts';

export type DependencyAccessor<Dependency> = () => Dependency;

export type DependencyInjector = Middleware;

export type DependencyInjectionMiddleware<Dependency> = [
    DependencyInjector,
    DependencyAccessor<Dependency>,
];

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

export function makeDependencyInjectionMiddleware<
    Dependency,
>(dependency: Dependency): DependencyInjectionMiddleware<Dependency> {
    const storage = new AsyncLocalStorage<Dependency>();

    return [
        (callback) => {
            return ((...args) => {
                return storage.run(dependency, () => {
                    return callback(...args);
                });
            });
        },

        () => {
            const store = storage.getStore();

            if (store === undefined) {
                throw new Error(
                    "bad dispatch to 'makeDependencyInjectionMiddleware.useDependency' (must be called within the scope of 'makeDependencyInjectionMiddleware.withDependency')",
                );
            }

            return store;
        },
    ];
}
