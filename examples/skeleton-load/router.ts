import {
    defineRouter,
    defineStaticDirectory,
    defineView,
} from '@oridim/webui-datastar';

import HomeView from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),
    defineStaticDirectory('/', new URL('./public', import.meta.url)),
]);
