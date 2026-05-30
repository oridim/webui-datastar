import type { WebUI } from '@webui/deno-webui';
import { render } from 'preact-render-to-string';

import type {
    PatchElementsModes,
    Signals,
    UnknownSignals,
} from './datastar.ts';
import {
    DATASTAR_EVENTS,
    DATASTAR_WATCHERS,
    DatastarWatchers,
    PATCH_ELEMENTS_MODES,
} from './datastar.ts';
import type { HTMLNamespaces } from './html.ts';
import { HTML_NAMESPACES } from './html.ts';
import type { JSX } from './preact.ts';

let actionCounter = 0;

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

export interface ActionRegistry {
    readonly entries: () => IterableIterator<[string, ActionCallableBase]>;

    readonly registerAction: <
        InputSignals extends Signals<InputSignals> = UnknownSignals,
        OutputSignals extends Signals<OutputSignals> = UnknownSignals,
    >(
        callback: ActionCallback<InputSignals, OutputSignals>,
    ) => ActionCallable<InputSignals, OutputSignals>;

    readonly registerInternalAction: <
        InputSignals extends Signals<InputSignals> = UnknownSignals,
        OutputSignals extends Signals<OutputSignals> = UnknownSignals,
    >(
        id: string,
        callback: ActionCallback<InputSignals, OutputSignals>,
    ) => string;
}

export interface ActionSignalsResponse<
    OutputSignals extends Signals<OutputSignals> = UnknownSignals,
> {
    readonly signals: OutputSignals;

    readonly onlyIfMissing?: boolean;
}

function dispatchDatastarFetchEvent(
    window: WebUI,
    type: DatastarWatchers,
    argsRaw: Record<string, string>,
) {
    const stringifiedArgs = JSON.stringify(argsRaw);

    window.run(`
        document.dispatchEvent(new CustomEvent('${DATASTAR_EVENTS.fetch}', {
            detail: { type: '${type}', el: document.documentElement, argsRaw: ${stringifiedArgs} }
        }));
    `);
}

function dispatchElementPatch(
    window: WebUI,
    id: string | null,
    elements: string,
    mode: PatchElementsModes = PATCH_ELEMENTS_MODES.outer,
    namespace: HTMLNamespaces = HTML_NAMESPACES.html,
    useViewTransition: boolean = false,
    viewTransitionSelector: string = '',
) {
    const argsRaw: Record<string, string> = {
        elements,
        mode,
        useViewTransition: String(useViewTransition),
        namespace,
        viewTransitionSelector,
    };

    if (id) {
        argsRaw.selector = `#${id}`;
    }

    dispatchDatastarFetchEvent(
        window,
        DATASTAR_WATCHERS.patchElements,
        argsRaw,
    );
}

function dispatchSignalPatch(
    window: WebUI,
    signals: Record<string, unknown>,
    onlyIfMissing = false,
) {
    dispatchDatastarFetchEvent(
        window,
        DATASTAR_WATCHERS.patchSignals,
        {
            signals: JSON.stringify(signals),
            onlyIfMissing: String(onlyIfMissing),
        },
    );
}

function generateActionID(callbackName: string): string {
    return `__webui-datastar_${callbackName || 'anonymous'}_${actionCounter++}`;
}

function processResponse(window: WebUI, response: unknown): void {
    if (!response || typeof response !== 'object') {
        return;
    }

    const res = response as
        & Partial<ActionElementsResponse>
        & Partial<ActionExecuteResponse>
        & Partial<ActionSignalsResponse>;

    if (res.elements !== undefined) {
        if (typeof res.elements === 'string') {
            dispatchElementPatch(
                window,
                null,
                res.elements,
                res.mode,
                res.namespace,
                res.useViewTransition,
                res.viewTransitionSelector,
            );
        } else {
            dispatchElementPatch(
                window,
                res.elements.props?.id ?? null,
                render(res.elements),
                res.mode,
                res.namespace,
                res.useViewTransition,
                res.viewTransitionSelector,
            );
        }
    }

    if (res.execute !== undefined) {
        window.run(res.execute);
    }

    if (res.signals !== undefined) {
        dispatchSignalPatch(window, res.signals, res.onlyIfMissing);
    }
}

export function defineAction<
    InputSignals extends Signals<InputSignals> = UnknownSignals,
    OutputSignals extends Signals<OutputSignals> = UnknownSignals,
>(
    callback: ActionCallback<InputSignals, OutputSignals>,
): ActionCallable<InputSignals, OutputSignals> {
    const id = generateActionID(callback.name);

    const callable = function (optionsExpression?: string) {
        return optionsExpression
            ? `@ipc('${id}', ${optionsExpression})`
            : `@ipc('${id}')`;
    };

    return Object.assign(callable, {
        callback,
        id,
    }) as ActionCallable<InputSignals, OutputSignals>;
}

export function defineActionRegistry(
    actions: readonly ActionCallableBase[] = [],
): ActionRegistry {
    const registry = new Map<string, ActionCallableBase>();

    for (const action of actions) {
        registry.set(action.id, action);
    }

    return {
        entries() {
            return registry.entries();
        },

        registerAction(callback) {
            const action = defineAction(callback);

            registry.set(
                action.id,
                action,
            );

            return action;
        },

        registerInternalAction(
            id,
            callback,
        ) {
            const action = Object.assign(
                (optionsExpression?: string) =>
                    optionsExpression
                        ? `@ipc('${id}', ${optionsExpression})`
                        : `@ipc('${id}')`,
                { callback, id },
            );

            registry.set(id, action as unknown as ActionCallableBase);

            return id;
        },
    };
}

export function initActions(window: WebUI, actions: ActionRegistry) {
    for (const [id, action] of actions.entries()) {
        const { callback } = action;

        window.bind(id, async (event) => {
            const payload = JSON.parse(event.arg.string(0));

            let result: unknown;

            try {
                result = await callback(payload as never);
            } catch (error) {
                console.error(error);
                return;
            }

            if (!result) {
                return;
            }

            if (
                typeof result === 'object' &&
                (Symbol.asyncIterator in result || Symbol.iterator in result)
            ) {
                try {
                    for await (
                        const response of result as
                            | AsyncIterable<unknown>
                            | Iterable<unknown>
                    ) {
                        processResponse(window, response);
                    }
                } catch (error) {
                    console.error(error);
                    return;
                }
            } else {
                processResponse(window, result);
            }
        });
    }
}
