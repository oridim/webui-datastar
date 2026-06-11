import type { ViewCallback } from '@oridim/datastar-serve';
import { defineStream } from '@oridim/datastar-serve';

import type { Signals } from '../signals.ts';

import Layout from '../components/Layout.tsx';

export const handlePatchTransition = defineStream<Signals>(
    '/streams/handlePatchTransition',
    ({ signals }) => {
        const { counter } = signals;
        const next = counter + 1;

        return {
            patchElements: {
                elements: (
                    <div
                        id='transition-demo-box'
                        class='patch-box'
                        data-text='`Patched ${$counter} times!`'
                    />
                ),
            },

            patchSignals: {
                signals: { counter: next },
            },
        };
    },
);

export default (() => {
    return (
        <Layout title='Home'>
            <h1>Page Transitions</h1>

            <p>
                Click "Other Page" in the nav above. The whole page will scale
                and fade slowly.
            </p>

            <p>
                Toggle the checkbox to dynamically disable the transition via
                the <code>data-skip-view-transition</code> attribute!
            </p>

            <hr />

            <h1>Patch Transitions</h1>

            <p>
                Click the button below to fetch a DOM patch. The box will spin
                because of its unique <code>view-transition-name</code>.
            </p>

            <div
                id='transition-demo-box'
                class='patch-box'
                data-text='`Patched ${$counter} times!`'
            />

            <button
                type='button'
                data-on:click="@get('/streams/handlePatchTransition')"
            >
                Trigger Patch Transition
            </button>
        </Layout>
    );
}) satisfies ViewCallback;
