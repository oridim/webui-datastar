import { defineAction, WebUIDatastarHead } from '@oridim/webui-datastar';

export const handleSlowSave = defineAction(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
        elements: <p id='result-msg'>Data saved successfully!</p>,
    };
});

export default function HomeView() {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>IPC Spinner</title>

                <WebUIDatastarHead />

                <link rel='stylesheet' href='/styles.css' />
            </head>

            <body>
                <button
                    type='button'
                    data-on:click={handleSlowSave()}
                    data-indicator='saving'
                >
                    <span data-show='$saving' class='spinner' />
                    <span data-text="$saving ? 'Saving...' : 'Save Data'">
                        Save Data
                    </span>
                </button>

                <div id='result-msg' />
            </body>
        </html>
    );
}
