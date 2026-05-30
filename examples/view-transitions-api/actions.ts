import { defineActionRegistry } from '@oridim/webui-datastar';

import { handlePatchTransition } from './views/HomeView.tsx';

export default defineActionRegistry([
    handlePatchTransition,
]);
