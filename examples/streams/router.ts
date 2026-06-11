import { defineRouter, defineView } from '@oridim/datastar-serve';

import HomeView, {
    handleAsyncElements,
    handleAsyncGeneratorElements,
    handleGeneratorSignals,
    handleSyncSignals,
    handleVoid,
} from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),

    handleAsyncElements,
    handleAsyncGeneratorElements,
    handleGeneratorSignals,
    handleSyncSignals,
    handleVoid,
]);
