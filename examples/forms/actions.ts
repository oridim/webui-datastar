import { defineActionRegistry } from '@oridim/webui-datastar';

import { handleRegistration } from './views/HomeView.tsx';

export default defineActionRegistry([
    handleRegistration,
]);
