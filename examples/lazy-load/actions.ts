import { defineActionRegistry } from '@oridim/webui-datastar';

import { handleLazyLoad } from './views/HomeView.tsx';

export default defineActionRegistry([
    handleLazyLoad,
]);
