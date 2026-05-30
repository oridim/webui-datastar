import { defineRouter, defineView } from '@oridim/webui-datastar';

import CalculatorView from './views/CalculatorView.tsx';

export default defineRouter([
    defineView('/', CalculatorView),
]);
