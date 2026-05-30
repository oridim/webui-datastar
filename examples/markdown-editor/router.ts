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
    defineConstantFile('/deno-gfm.css', CSS),
    defineStaticDirectory('/', new URL('./public', import.meta.url)),
]);
