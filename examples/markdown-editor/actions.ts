import { defineActionRegistry } from '@oridim/webui-datastar';

import { createFile } from './components/EphemeralInputRow.tsx';
import { pickDirectory } from './components/OpenWorkspaceButton.tsx';
import { saveFile } from './components/WorkspaceEditor.tsx';
import { listDirectory, readFile } from './components/WorkspaceFileList.tsx';
import { renderPreview } from './components/WorkspacePreview.tsx';

export default defineActionRegistry([
    createFile,
    listDirectory,
    pickDirectory,
    readFile,
    renderPreview,
    saveFile,
]);
