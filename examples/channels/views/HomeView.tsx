import type { ViewCallback } from '@oridim/datastar-serve';
import { defineStreamChannel, FrameworkHead } from '@oridim/datastar-serve';

import type { Signals } from '../signals.ts';
import DEFAULT_SIGNALS from '../signals.ts';

export const handleChannel = defineStreamChannel<Signals>(
    '/streams/handleChannel',
    ({ signals }, { done, push }) => {
        let { counter } = signals;
        let delta = 0;

        const identifier = setInterval(() => {
            counter++;
            delta++;

            push({
                patchSignals: {
                    signals: {
                        counter,
                    },
                },
            });

            if (delta >= 10) {
                done();
            }
        }, 1000);

        return () => {
            clearInterval(identifier);
        };
    },
);

export default (() => {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>Channels</title>

                <FrameworkHead />
            </head>

            <body data-signals={JSON.stringify(DEFAULT_SIGNALS)}>
                <strong data-text='$counter'>0</strong>

                <button data-on:click='@get("/streams/handleChannel")'>
                    Count up by 10 over time.
                </button>
            </body>
        </html>
    );
}) satisfies ViewCallback;
