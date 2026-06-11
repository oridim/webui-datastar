import type { JSX } from '../preact/components.ts';

import type { HTMLNamespaces } from './html.ts';

export const CONTENT_TYPES = {
    form: 'form',

    json: 'json',
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

export type ContentTypes = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];

export type PatchElementsModes =
    typeof PATCH_ELEMENTS_MODES[keyof typeof PATCH_ELEMENTS_MODES];

export type SignalValue =
    | boolean
    | null
    | number
    | string
    | SignalValue[]
    | { [key: string]: SignalValue };

export type Signals<T> = { [K in keyof T]: SignalValue };

export type UnknownSignals = Record<string, SignalValue>;

export interface ExecuteScriptArguments {
    readonly options?: ExecuteScriptOptions;

    readonly script: string;
}

export interface ExecuteScriptOptions {
    readonly attributes?: string[] | Record<string, string>;

    readonly autoRemove?: boolean;

    readonly eventId?: string;

    readonly retryDuration?: number;
}

export interface PatchElementsArguments {
    readonly elements: JSX.Element | string;

    readonly options?: PatchElementsOptions;
}

export interface PatchElementsOptions {
    readonly eventId?: string;

    readonly mode?: PatchElementsModes;

    readonly namespace?: HTMLNamespaces;

    readonly retryDuration?: number;

    readonly useViewTransition?: boolean;

    readonly selector?: string;
}

export interface PatchSignalsArguments<
    T extends Signals<unknown> = UnknownSignals,
> {
    readonly options?: PatchSignalsOptions;

    readonly signals: T;
}

export interface PatchSignalsOptions {
    readonly eventId?: string;

    readonly onlyIfMissing?: boolean;

    readonly retryDuration?: number;
}

export interface RemoveElementsArguments {
    readonly elements?: JSX.Element | string;

    readonly options?: RemoveElementsOptions;

    readonly selector?: string;
}

export interface RemoveElementsOptions {
    readonly eventId?: string;

    readonly retryDuration?: number;
}

export interface RemoveSignalsArguments {
    readonly options?: RemoveSignalsOptions;

    readonly signalKeys: string | string[];
}

export interface RemoveSignalsOptions {
    readonly eventId?: string;

    readonly onlyIfMissing?: boolean;

    readonly retryDuration?: number;
}
