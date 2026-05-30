import { defineAction, WebUIDatastarHead } from '@oridim/webui-datastar';

interface HomeState {
    readonly counter: number;

    readonly status: string;
}

export const handleSyncSignal = defineAction<
    HomeState,
    Pick<HomeState, 'counter'>
>(({ counter }) => {
    return { signals: { counter: counter + 1 } };
});

export const handleAsyncBody = defineAction<HomeState>(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        elements: <span id='async-result'>Loaded from DB!</span>,
    };
});

export const handleGenerator = defineAction<
    HomeState,
    Pick<HomeState, 'status'>
>(function* () {
    yield { signals: { status: 'Starting generator...' } };
    yield { signals: { status: 'Processing data step 1...' } };
    yield { signals: { status: 'Processing data step 2...' } };
    yield { signals: { status: 'Generator finished!' } };
});

export const handleAsyncGenerator = defineAction<HomeState>(async function* () {
    yield { elements: <div id='stream-result'>Starting stream...</div> };

    for (let index = 1; index <= 3; index++) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        yield {
            elements: (
                <div id='stream-result'>Downloading chunk {index}/3...</div>
            ),
        };
    }

    yield { elements: <div id='stream-result'>Stream complete!</div> };
});

export const handleVoid = defineAction<HomeState>(() => {
    console.log('\nVoid action triggered! No patches sent to frontend.\n');
    return;
});

export default function HomeView() {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>Actions</title>

                <WebUIDatastarHead />
            </head>

            <body>
                <h1>Action Demo</h1>

                <div data-signals="{ counter: 0, status: 'Idle' }">
                    {/* @ts-expect-error - HACK: Preact's typings don't like the deprecated `border` attribute. */}
                    <table border='1' cellpadding='16' width='700'>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>1. Sync (Signal)</strong>
                                </td>

                                <td>
                                    Counter:{' '}
                                    <strong data-text='$counter'>0</strong>
                                </td>

                                <td align='center'>
                                    <button data-on:click={handleSyncSignal()}>
                                        Increment
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>2. Async (Body)</strong>
                                </td>

                                <td>
                                    <span id='async-result'>
                                        Awaiting fetch...
                                    </span>
                                </td>

                                <td align='center'>
                                    <button data-on:click={handleAsyncBody()}>
                                        Fetch Data
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>3. Generator (Signal)</strong>
                                </td>

                                <td>
                                    Status:{' '}
                                    <strong data-text='$status'>Idle</strong>
                                </td>

                                <td align='center'>
                                    <button data-on:click={handleGenerator()}>
                                        Run Sync Generator
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>4. AsyncGen (Body)</strong>
                                </td>

                                <td>
                                    <div id='stream-result'>
                                        Awaiting stream...
                                    </div>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={handleAsyncGenerator()}
                                    >
                                        Start Stream
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>5. Void</strong>
                                </td>

                                <td>
                                    <em>Check Deno console</em>
                                </td>

                                <td align='center'>
                                    <button data-on:click={handleVoid()}>
                                        Trigger Void
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    );
}
