import {
    defineRouter,
    defineStaticFile,
    defineView,
} from '@oridim/webui-datastar';

import HomeView from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),
    defineStaticFile(
        '/styles.css',
        new URL('./styles.css', import.meta.url),
    ),
]);
