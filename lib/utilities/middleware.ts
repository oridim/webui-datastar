export type Middleware<T> = (callback: T) => T;

export function withMiddleware<T>(
    middlewares: Middleware<T>[],
    callback: T,
): T {
    return middlewares.reduceRight(
        (accumulatedCallback, middleware) => middleware(accumulatedCallback),
        callback,
    );
}
