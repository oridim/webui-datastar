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
