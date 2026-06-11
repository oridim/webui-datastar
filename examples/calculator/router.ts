import { defineRouter, defineView } from '@oridim/datastar-serve';

import HomeView, { handleButtonClick } from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),

    handleButtonClick,
]);
