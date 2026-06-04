import { defineAction } from '@oridim/webui-datastar';

import type { PartialSignals, Signals } from '../signals.ts';

import Layout from './Layout.tsx';

export const handlePatchTransition = defineAction<Signals, PartialSignals>(
    ({ counter }) => {
        const next = counter + 1;

        return {
            signals: { counter: next },
            elements: (
                <div
                    id='transition-demo-box'
                    class='patch-box'
                    data-text='`Patched ${$counter} times!`'
                />
            ),
        };
    },
);

export default function HomeView() {
    return (
        <Layout title='Home - View Transitions'>
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

            <button type='button' data-on:click={handlePatchTransition()}>
                Trigger Patch Transition
            </button>
        </Layout>
    );
}
