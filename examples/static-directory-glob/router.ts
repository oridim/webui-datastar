import {
    defineRouter,
    defineStaticDirectory,
    defineView,
} from '@oridim/datastar-serve';

import HomeView from './views/HomeView.tsx';
import OtherView from './views/OtherView.tsx';

export default defineRouter([
    defineView('/', HomeView),
    defineView('/other', OtherView),
    defineStaticDirectory('/', new URL('./public', import.meta.url)),
    defineStaticDirectory(
        '/styles/views',
        new URL('./views', import.meta.url),
        '**/*.css',
    ),
]);
