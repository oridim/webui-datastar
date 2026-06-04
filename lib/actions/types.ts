import type {
    PatchElementsModes,
    Signals,
    UnknownSignals,
} from '../datastar/types.ts';
import type { HTMLNamespaces } from '../html.ts';
import type { JSX } from '../preact.ts';

export type ActionCallback<
    InputSignals extends Signals<InputSignals> = UnknownSignals,
    OutputSignals extends Signals<OutputSignals> = UnknownSignals,
> = (
    signals: InputSignals,
) =>
    | Promise<ActionResponses<OutputSignals>>
    | ActionResponses<OutputSignals>
    | AsyncGenerator<ActionResponses<OutputSignals>>
    | Generator<ActionResponses<OutputSignals>>;

export type ActionResponses<
    OutputSignals extends Signals<OutputSignals> = UnknownSignals,
> =
    | (
        & ActionElementsResponse
        & Partial<ActionExecuteResponse>
        & Partial<ActionSignalsResponse<OutputSignals>>
    )
    | (
        & ActionExecuteResponse
        & Partial<ActionElementsResponse>
        & Partial<ActionSignalsResponse<OutputSignals>>
    )
    | (
        & ActionSignalsResponse<OutputSignals>
        & Partial<ActionElementsResponse>
        & Partial<ActionExecuteResponse>
    )
    | void;
export interface ActionCallableBase {
    (optionsExpression?: string): string;

    readonly callback: (signals: never) => unknown;

    readonly id: string;
}

export interface ActionCallable<
    InputSignals extends Signals<InputSignals> = UnknownSignals,
    OutputSignals extends Signals<OutputSignals> = UnknownSignals,
> extends ActionCallableBase {
    readonly callback: ActionCallback<InputSignals, OutputSignals>;
}

export interface ActionElementsResponse {
    readonly elements: JSX.Element | string;

    readonly mode?: PatchElementsModes;

    readonly namespace?: HTMLNamespaces;

    readonly useViewTransition?: boolean;

    readonly viewTransitionSelector?: string;
}

export interface ActionExecuteResponse {
    readonly execute: string;
}

export interface ActionSignalsResponse<
    OutputSignals extends Signals<OutputSignals> = UnknownSignals,
> {
    readonly onlyIfMissing?: boolean;

    readonly signals: OutputSignals;
}
