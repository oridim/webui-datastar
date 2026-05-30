import { initWebUIDatastar } from '@oridim/webui-datastar';
import { WebUI } from '@webui/deno-webui';

import APP_ROUTER from './router.ts';

const window = new WebUI();

initWebUIDatastar({
    window,
    router: APP_ROUTER,
});

await window.showBrowser('/', WebUI.Browser.AnyBrowser);
await WebUI.wait();
