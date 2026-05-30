import { defineActionRegistry } from '@oridim/webui-datastar';

import { handleFetchProfile } from './views/HomeView.tsx';

export default defineActionRegistry([
    handleFetchProfile,
]);
