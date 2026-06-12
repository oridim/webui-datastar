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

export type ExtractRouteParams<T extends string = string> = T extends
    `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${string}:${infer Param}` ? Param
    : never;

export type MapRouteParams<Path extends string = string> =
    [ExtractRouteParams<Path>] extends [never] ? Record<string, never>
        : Record<ExtractRouteParams<Path>, string>;

export type RouteCallback<Path extends string = string> = (
    context: RequestContext<Path>,
) => Promise<Response | null> | Response | null;

export type RouteItem = Route | readonly RouteItem[];

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
