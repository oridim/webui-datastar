import {
    defineConstantFile,
    defineRouter,
    defineStaticDirectory,
    defineView,
} from '@oridim/datastar-serve';
import { CSS } from 'jsr:@deno/gfm@0.12.0';

import { createFile } from './components/EphemeralInputRow.tsx';
import { pickDirectory } from './components/OpenWorkspaceButton.tsx';
import { saveFile } from './components/WorkspaceEditor.tsx';
import { listDirectory, readFile } from './components/WorkspaceFileList.tsx';
import { renderPreview } from './components/WorkspacePreview.tsx';

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

    createFile,
    listDirectory,
    pickDirectory,
    readFile,
    renderPreview,
    saveFile,
]);
