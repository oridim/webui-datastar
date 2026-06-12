import { serve } from '@oridim/datastar-serve';

import APP_ROUTER from './router.ts';

serve({
    router: APP_ROUTER,
    serve: {
        onListen({ hostname, port }) {
            console.log(`Visit: http://${hostname}:${port}`);
        },
    },
});
