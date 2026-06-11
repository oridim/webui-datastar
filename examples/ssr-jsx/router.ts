import { defineRouter, defineView } from '@oridim/datastar-serve';

import HomeView from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),
]);
