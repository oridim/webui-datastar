export type ChannelCleanupFunction = () => void;

export type ChannelDoneFunction = () => void;

export type ChannelPushFunction<T> = (value: T) => void;

export type ChannelSetupCallback<T> = (
    push: ChannelPushFunction<T>,
    done: ChannelDoneFunction,
) => ChannelCleanupFunction | void;

export function makeChannel<T>(
    setup: ChannelSetupCallback<T>,
): AsyncGenerator<T, void, unknown> {
    const queue: T[] = [];

    let isDone = false;
    let waitingResolve: (() => void) | null = null;

    function done(): void {
        isDone = true;

        wakeUp();
    }

    function push(value: T): void {
        if (isDone) {
            return;
        }

        queue.push(value);
        wakeUp();
    }

    function wakeUp(): void {
        waitingResolve?.();
        waitingResolve = null;
    }

    const cleanup = setup(push, done);

    async function* generator(): AsyncGenerator<T, void, unknown> {
        try {
            while (!isDone || queue.length > 0) {
                if (queue.length === 0) {
                    const { promise, resolve } = Promise.withResolvers<void>();
                    waitingResolve = resolve;

                    await promise;
                } else {
                    yield queue.shift() as T;
                }
            }
        } finally {
            if (cleanup) {
                cleanup();
            }
        }
    }

    return generator();
}
