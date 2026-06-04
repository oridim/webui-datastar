import type { Signals, UnknownSignals } from '../datastar/types.ts';

import type { ActionCallable, ActionCallback } from './types.ts';

function generateActionID(callbackName: string): string {
    const uuid = crypto.randomUUID();

    return `__webui-datastar_${callbackName || 'anonymous'}_${uuid}`;
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
