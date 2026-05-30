import { defineActionRegistry } from '@oridim/webui-datastar';
import {
    handleAsyncBody,
    handleAsyncGenerator,
    handleGenerator,
    handleSyncSignal,
    handleVoid,
} from './views/HomeView.tsx';

export default defineActionRegistry([
    handleSyncSignal,
    handleAsyncBody,
    handleGenerator,
    handleAsyncGenerator,
    handleVoid,
]);
