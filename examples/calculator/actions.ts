import { defineActionRegistry } from '@oridim/webui-datastar';

import { handleButtonPress } from './views/HomeView.tsx';

export default defineActionRegistry([
    handleButtonPress,
]);
