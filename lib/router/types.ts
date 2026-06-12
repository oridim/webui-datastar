import type { JSX } from '../preact/components.ts';
import type {
    ExecuteScriptArguments,
    PatchElementsArguments,
    PatchSignalsArguments,
    RemoveElementsArguments,
    RemoveSignalsArguments,
    Signals,
    UnknownSignals,
} from '../utilities/datastar.ts';

export type ExtractRouteParams<InputRoute = string> =
    InferRoutePath<InputRoute> extends infer Path
        ? Path extends `${string}:${infer Param}/${infer Rest}`
            ? Param | ExtractRouteParams<`/${Rest}`>
        : Path extends `${string}:${infer Param}` ? Param
        : never
        : never;

export type InferRoutePath<InputRoute> = InputRoute extends string ? InputRoute
    : InputRoute extends Route<infer Path> ? Path
    : InputRoute extends readonly (infer Item)[] ? InferRoutePath<Item>
    : never;

export type MapRouteParams<InputRoute = string> = Record<
    ExtractRouteParams<InputRoute>,
    string
>;

export type RouteCallback<Path extends string = string> = (
    context: RequestContext<Path>,
) => Promise<Response | null> | Response | null;

export type RouteItem = Route | readonly RouteItem[];

export type StreamChannelCleanupFunction = () => void;

export type StreamChannelCallback<
    Path extends string = string,
    InputSignals extends Signals<unknown> = UnknownSignals,
    OutputSignals extends Signals<unknown> = InputSignals,
> = (
    requestContext: StreamRequestContext<Path, InputSignals>,
    channelContext: StreamChannelContext<OutputSignals>,
) => StreamChannelCleanupFunction | void;

export type StreamRouteCallback<
    Path extends string = string,
    InputSignals extends Signals<unknown> = UnknownSignals,
    OutputSignals extends Signals<unknown> = InputSignals,
> = (
    context: StreamRequestContext<Path, InputSignals>,
) =>
    | AsyncGenerator<StreamResponse<OutputSignals>>
    | Generator<StreamResponse<OutputSignals>>
    | Promise<StreamResponse<OutputSignals> | void>
    | StreamResponse<OutputSignals>
    | void;

export type ViewCallback<Path extends string = string> = (
    context: RequestContext<Path>,
) => JSX.Element | Promise<JSX.Element>;

export interface RequestContext<Path extends string = string> {
    readonly match: URLPatternResult;

    readonly params: MapRouteParams<Path>;

    readonly request: Request;

    readonly url: URL;
}

export interface Route<Path extends string = string> {
    readonly callback: RouteCallback;

    readonly path: Path;

    readonly urlPattern: URLPattern;
}

export interface StreamChannelContext<
    OutputSignals extends Signals<unknown> = UnknownSignals,
> {
    readonly done: () => void;

    readonly error: (error?: unknown) => void;

    readonly push: (response: StreamResponse<OutputSignals>) => void;
}

export interface StreamResponse<T extends Signals<unknown> = UnknownSignals> {
    readonly executeScript?: ExecuteScriptArguments;

    readonly patchElements?: PatchElementsArguments;

    readonly patchSignals?: PatchSignalsArguments<T>;

    readonly removeElements?: RemoveElementsArguments;

    readonly removeSignals?: RemoveSignalsArguments;
}

export interface StreamRequestContext<
    Path extends string = string,
    InputSignals extends Signals<unknown> = UnknownSignals,
> extends RequestContext<Path> {
    readonly signals: InputSignals;
}
