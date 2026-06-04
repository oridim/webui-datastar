import {
    defineAction,
    makeChannel,
    WebUIDatastarHead,
} from '@oridim/webui-datastar';

interface HomeState {
    readonly counter: number;
}

export const handleChannel = defineAction<HomeState, HomeState>(
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

            <body data-signals="{ counter: 0, status: 'Idle' }">
                <strong data-text='$counter'>0</strong>

                <button data-on:click={handleChannel()}>
                    Count up by 10 over time.
                </button>
            </body>
        </html>
    );
}
