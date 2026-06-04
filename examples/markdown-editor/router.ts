import {
    defineConstantFile,
    defineRouter,
    defineStaticDirectory,
    defineView,
} from '@oridim/webui-datastar';
import { CSS } from 'jsr:@deno/gfm@0.12.0';

import HomeView from './views/HomeView.tsx';
import WorkspaceView from './views/WorkspaceView.tsx';

export default defineRouter([
    defineView('/', HomeView),
    defineView('/workspace', WorkspaceView),
    defineConstantFile('/styles/deno-gfm.css', CSS),
    defineStaticDirectory('/', new URL('./public', import.meta.url)),
    defineStaticDirectory(
        '/styles/components',
        new URL('./components', import.meta.url),
        '**/*.css',
    ),
    defineStaticDirectory(
        '/styles/views',
        new URL('./views', import.meta.url),
        '**/*.css',
    ),
]);
