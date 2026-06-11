import { defineStream, FrameworkHead } from '@oridim/datastar-serve';

import type { Signals } from '../signals.ts';
import DEFAULT_SIGNALS from '../signals.ts';

export const handleSyncSignals = defineStream<Signals>(
    '/streams/handleSyncSignals',
    ({ signals }) => {
        const { counter } = signals;

        return {
            patchSignals: {
                signals: {
                    counter: counter + 1,
                },
            },
        };
    },
);

export const handleAsyncElements = defineStream<Signals>(
    '/streams/handleAsyncElements',
    async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
            patchElements: {
                elements: <span id='async-result'>Loaded from DB!</span>,
            },
        };
    },
);

export const handleGeneratorSignals = defineStream<Signals>(
    '/streams/handleGeneratorSignals',
    function* () {
        yield {
            patchSignals: {
                signals: { status: 'Starting generator...' },
            },
        };

        yield {
            patchSignals: {
                signals: { status: 'Processing data step 1...' },
            },
        };

        yield {
            patchSignals: {
                signals: { status: 'Processing data step 2...' },
            },
        };

        yield {
            patchSignals: {
                signals: { status: 'Generator finished!' },
            },
        };
    },
);

export const handleAsyncGeneratorElements = defineStream<Signals>(
    '/streams/handleAsyncGeneratorElements',
    async function* () {
        yield {
            patchElements: {
                elements: <div id='stream-result'>Starting stream...</div>,
            },
        };

        for (let index = 1; index <= 3; index++) {
            await new Promise((resolve) => setTimeout(resolve, 500));

            yield {
                patchElements: {
                    elements: (
                        <div id='stream-result'>
                            Downloading chunk {index}/3...
                        </div>
                    ),
                },
            };
        }

        yield {
            patchElements: {
                elements: <div id='stream-result'>Stream complete!</div>,
            },
        };
    },
);

export const handleVoid = defineStream<Signals>(
    '/streams/handleVoid',
    () => {
        console.log('\nVoid action triggered! No patches sent to frontend.\n');
    },
);

export default function HomeView() {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>Actions</title>

                <FrameworkHead />
            </head>

            <body data-signals={JSON.stringify(DEFAULT_SIGNALS)}>
                <h1>Action Demo</h1>

                <div>
                    {/* @ts-expect-error - HACK: Preact's typings don't like the deprecated `border` attribute. */}
                    <table border='1' cellpadding='16' width='700'>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>1. Sync (patchSignals)</strong>
                                </td>

                                <td>
                                    Counter:{' '}
                                    <strong data-text='$counter'>0</strong>
                                </td>

                                <td align='center'>
                                    <button data-on:click="@get('/streams/handleSyncSignals')">
                                        Increment
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>2. Async (patchElements)</strong>
                                </td>

                                <td>
                                    <span id='async-result'>
                                        Awaiting fetch...
                                    </span>
                                </td>

                                <td align='center'>
                                    <button data-on:click="@get('/streams/handleAsyncElements')">
                                        Fetch Data
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>3. Generator (patchSignals)</strong>
                                </td>

                                <td>
                                    Status:{' '}
                                    <strong data-text='$status'>Idle</strong>
                                </td>

                                <td align='center'>
                                    <button data-on:click="@get('/streams/handleGeneratorSignals')">
                                        Run Generator
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>
                                        4. AsyncGenerator (patchElements)
                                    </strong>
                                </td>

                                <td>
                                    <div id='stream-result'>
                                        Awaiting stream...
                                    </div>
                                </td>

                                <td align='center'>
                                    <button data-on:click="@get('/streams/handleAsyncGeneratorElements')">
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
                                    <button data-on:click="@get('/streams/handleVoid')">
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
