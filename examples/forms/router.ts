import { defineRouter, defineView } from '@oridim/datastar-serve';

import HomeView, { handleRegistration } from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),

    handleRegistration,
]);
