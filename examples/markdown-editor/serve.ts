import { load as loadRFD } from 'jsr:@miyauci/rfd@1.0.0/deno';
import { serve } from '@oridim/datastar-serve';

import APP_ROUTER from './router.ts';

export default async () => {
    await loadRFD();

    const { hostname, port } = new URL(Deno.args[1]);
    const parsedPort = parseInt(port);

    if (isNaN(parsedPort)) {
        throw new Error(
            `bad initialization to 'serve.ts' (invalid port '${port}')`,
        );
    }

    serve({
        router: APP_ROUTER,
        serve: {
            hostname,
            port: parsedPort,

            onListen() {
                console.log('SERVER_READY');
            },
        },
    });
};
