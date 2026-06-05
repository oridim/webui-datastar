import { initWebUIDatastar } from '@oridim/webui-datastar';
import { WebUI } from '@webui/deno-webui';

import APP_ACTIONS from './actions.ts';
import APP_ROUTER from './router.ts';

const window = new WebUI();

initWebUIDatastar({
    window,
    actions: APP_ACTIONS,
    router: APP_ROUTER,
});

await window.showWebView('/');
await WebUI.wait();
