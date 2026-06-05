import type { WebUI } from '@webui/deno-webui';
import { render } from 'preact-render-to-string';

import {
    dispatchElementPatch,
    dispatchSignalPatch,
} from '../datastar/patches.ts';
import type { Signals, UnknownSignals } from '../datastar/types.ts';

import { defineAction } from './directives.ts';
import {
    ActionCallable,
    ActionCallableBase,
    ActionCallback,
    ActionElementsResponse,
    ActionExecuteResponse,
    ActionSignalsResponse,
} from './types.ts';

export interface ActionRegistry {
    readonly abortActions: () => void;

    readonly abortToken: object;

    readonly entries: () => IterableIterator<[string, ActionCallableBase]>;

    readonly registerAction: <
        InputSignals extends Signals<InputSignals> = UnknownSignals,
        OutputSignals extends Signals<OutputSignals> = UnknownSignals,
    >(
        callback: ActionCallback<InputSignals, OutputSignals>,
    ) => ActionCallable<InputSignals, OutputSignals>;
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

export function defineActionRegistry(
    actions: readonly ActionCallableBase[] = [],
): ActionRegistry {
    const registry = new Map<string, ActionCallableBase>();

    let abortToken = {};

    for (const action of actions) {
        registry.set(action.id, action);
    }

    return {
        get abortToken() {
            return abortToken;
        },

        abortActions() {
            abortToken = {};
        },

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
    };
}

export function initActions(window: WebUI, actionRegistry: ActionRegistry) {
    for (const [id, action] of actionRegistry.entries()) {
        const { callback } = action;

        window.bind(id, async (event) => {
            const { abortToken: initialAbortToken } = actionRegistry;
            const payload = JSON.parse(event.arg.string(0));

            let result: unknown;

            try {
                result = await callback(payload as never);
            } catch (error) {
                console.error(error);
                return;
            }

            if (
                !result ||
                initialAbortToken !== actionRegistry.abortToken
            ) {
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
                        if (
                            initialAbortToken !==
                                actionRegistry.abortToken
                        ) {
                            break;
                        }

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
