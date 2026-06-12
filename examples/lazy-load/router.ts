import {
    defineRouter,
    defineStaticDirectory,
    defineView,
} from '@oridim/datastar-serve';

import HomeView, { handleLazyLoad } from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),
    defineStaticDirectory('/', new URL('./public', import.meta.url)),

    handleLazyLoad,
]);
