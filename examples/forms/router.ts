import { defineRouter, defineView } from '@oridim/webui-datastar';

import HomeView from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),
]);
