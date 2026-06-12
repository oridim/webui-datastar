import {
    defineRouter,
    defineStaticDirectory,
    defineView,
} from '@oridim/datastar-serve';

import HomeView, { handlePatchTransition } from './views/HomeView.tsx';
import OtherView from './views/OtherView.tsx';

export default defineRouter([
    defineView('/', HomeView),
    defineView('/other', OtherView),
    defineStaticDirectory('/', new URL('./public', import.meta.url)),

    handlePatchTransition,
]);
