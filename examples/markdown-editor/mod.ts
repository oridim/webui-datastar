import { serve } from '@oridim/datastar-serve';
import { load as loadRFD } from 'jsr:@miyauci/rfd@1.0.0/deno';
import { WebUI } from 'jsr:@webui/deno-webui@^2.5.15';

import APP_ROUTER from './router.ts';
import APP_WEBUI from './webui.ts';

const port = WebUI.getFreePort();

await loadRFD();

APP_WEBUI.bind('', (event) => {
    console.log('hello?', { event });
    switch (event.eventType) {
        case WebUI.EventType.Disconnected:
            if (!APP_WEBUI.isShown) {
                Deno.exit(0);
            }
    }
});

serve({
    router: APP_ROUTER,
    serve: {
        port,
        hostname: '127.0.0.1',

        async onListen({ hostname, port }) {
            /*APP_WEBUI.showWebView(
                `http://${hostname}:${port}/`,
            );

            await WebUI.wait();*/

            console.log(`Visit: http://${hostname}:${port}`);
        },
    },
});
