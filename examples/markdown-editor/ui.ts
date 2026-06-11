import { WebUI } from 'jsr:@webui/deno-webui@^2.5.15';

import {
    spawnWorker,
    SUBCOMMANDS,
    waitForSignal,
} from './utilities/command.ts';

export default async () => {
    const PORT_HTTP_SERVER = WebUI.getFreePort();
    const PORT_WEBUI_SERVER = WebUI.getFreePort();

    const APP_WEBUI = new WebUI();

    const URL_HTTP_SERVER = `http://127.0.0.1:${PORT_HTTP_SERVER}`;
    const URL_WEBUI_SERVER = `http://127.0.0.1:${PORT_WEBUI_SERVER}`;

    const childProcess = spawnWorker(
        [
            SUBCOMMANDS.serve,
            URL_HTTP_SERVER,
            URL_WEBUI_SERVER,
        ],
        [
            '--allow-read',
            '--allow-write',
            '--allow-net',
            '--allow-env',
            '--allow-ffi',
        ],
        {
            stderr: 'inherit',
            stdout: 'piped',
        },
    );

    APP_WEBUI.bind('', (event) => {
        switch (event.eventType) {
            case WebUI.EventType.Disconnected:
                Deno.exit(0);
        }
    });

    await waitForSignal(childProcess.stdout, 'SERVER_READY');

    APP_WEBUI.setPort(PORT_WEBUI_SERVER);
    APP_WEBUI.showWebView(URL_HTTP_SERVER);

    await WebUI.wait();
};
