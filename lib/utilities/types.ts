export type BuiltinTypes =
    | Date
    | ((...args: unknown[]) => unknown)
    | Uint8Array
    | string
    | number
    | boolean
    | undefined
    | null;

export type DeepPartial<T> = T extends BuiltinTypes ? T
    : T extends Array<infer U> ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
    : T extends Map<infer K, infer V> ? Map<DeepPartial<K>, DeepPartial<V>>
    : T extends Set<infer U> ? Set<DeepPartial<U>>
    : T extends Promise<infer U> ? Promise<DeepPartial<U>>
    : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export function isAsyncIterable<T = unknown>(
    value: unknown,
): value is AsyncIterable<T> {
    return (
        typeof value === 'object' &&
        value !== null &&
        Symbol.asyncIterator in value
    );
}

export function isIterable<T = unknown>(
    value: unknown,
): value is Iterable<T> {
    return (
        typeof value === 'object' &&
        value !== null &&
        Symbol.iterator in value
    );
}
