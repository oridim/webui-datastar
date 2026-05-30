import { defineActionRegistry } from '@oridim/webui-datastar';

import { handleSlowSave } from './views/HomeView.tsx';

export default defineActionRegistry([
    handleSlowSave,
]);
