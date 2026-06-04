import { defineActionRegistry } from '@oridim/webui-datastar';
import { handleChannel } from './views/HomeView.tsx';

export default defineActionRegistry([
    handleChannel,
]);
