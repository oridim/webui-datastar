import {
    defineRouter,
    defineStaticDirectory,
    defineView,
} from '@oridim/datastar-serve';

import HomeView, { handleSlowSave } from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),
    defineStaticDirectory('/', new URL('./public', import.meta.url)),

    handleSlowSave,
]);
