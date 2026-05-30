type BuiltinTypes =
    | Date
    | Function
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
