export type Middleware<T> = (callback: T) => T;

export function withMiddleware<T>(
    middlewares: readonly Middleware<T>[],
    callback: T,
): T {
    return middlewares.reduceRight(
        (accumulatedCallback, middleware) => middleware(accumulatedCallback),
        callback,
    );
}
