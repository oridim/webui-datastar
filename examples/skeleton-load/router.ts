import {
    defineRouter,
    defineStaticDirectory,
    defineView,
} from '@oridim/datastar-serve';

import HomeView, { handleFetchProfile } from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),
    defineStaticDirectory('/', new URL('./public', import.meta.url)),

    handleFetchProfile,
]);
