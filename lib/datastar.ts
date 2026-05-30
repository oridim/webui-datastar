export const CONTENT_TYPES = {
    form: 'form',

    json: 'json',
} as const;

export const DATASTAR_EVENTS = {
    fetch: 'datastar-fetch',
} as const;

export const DATASTAR_WATCHERS = {
    patchElements: 'datastar-patch-elements',

    patchSignals: 'datastar-patch-signals',
} as const;

export const PATCH_ELEMENTS_MODES = {
    after: 'after',

    append: 'append',

    before: 'before',

    inner: 'inner',

    outer: 'outer',

    prepend: 'prepend',

    remove: 'remove',

    replace: 'replace',
} as const;

export type SignalValue =
    | boolean
    | null
    | number
    | string
    | SignalValue[]
    | { [key: string]: SignalValue };

export type Signals<T> = { [K in keyof T]: SignalValue };

export type UnknownSignals = Record<string, SignalValue>;

export type ContentTypes = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];

export type DatastarEvents =
    typeof DATASTAR_EVENTS[keyof typeof DATASTAR_EVENTS];

export type DatastarWatchers =
    typeof DATASTAR_WATCHERS[keyof typeof DATASTAR_WATCHERS];

export type PatchElementsModes =
    typeof PATCH_ELEMENTS_MODES[keyof typeof PATCH_ELEMENTS_MODES];
