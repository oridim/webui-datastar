import {
    defineAction,
    makeChannel,
    WebUIDatastarHead,
} from '@oridim/webui-datastar';

import type { Signals } from '../signals.ts';
import DEFAULT_SIGNALS from '../signals.ts';

export const handleChannel = defineAction<Signals>(
    ({ counter }) => {
        return makeChannel((push, done) => {
            let delta = 0;

            const identifier = setInterval(() => {
                counter++;
                delta++;

                push({
                    signals: {
                        counter,
                    },
                });

                if (delta >= 10) {
                    done();
                }
            }, 1000);

            return () => {
                clearInterval(identifier);
            };
        });
    },
);

export default function HomeView() {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>Channels</title>

                <WebUIDatastarHead />
            </head>

            <body data-signals={JSON.stringify(DEFAULT_SIGNALS)}>
                <strong data-text='$counter'>0</strong>

                <button data-on:click={handleChannel()}>
                    Count up by 10 over time.
                </button>
            </body>
        </html>
    );
}
