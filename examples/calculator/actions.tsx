import { defineActionRegistry } from '@oridim/webui-datastar';

import { handleButtonPress } from './views/CalculatorView.tsx';

export default defineActionRegistry([
    handleButtonPress,
]);
