import { defineStream, FrameworkHead } from '@oridim/datastar-serve';

export const handleSlowSave = defineStream(
    '/streams/handleSlowSave',
    async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
            patchElements: {
                elements: <p id='result-msg'>Data saved successfully!</p>,
            },
        };
    },
);

export default function HomeView() {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>IPC Spinner</title>

                <FrameworkHead />

                <link rel='stylesheet' href='/styles.css' />
            </head>

            <body>
                <button
                    type='button'
                    data-on:click='@get("/streams/handleSlowSave")'
                    data-indicator='saving'
                >
                    <span data-show='$saving' class='spinner' />
                    <span data-text='$saving ? "Saving..." : "Save Data"'>
                        Save Data
                    </span>
                </button>

                <div id='result-msg' />
            </body>
        </html>
    );
}
