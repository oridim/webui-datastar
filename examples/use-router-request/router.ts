import { defineRouter, defineView } from '@oridim/webui-datastar';

import HomeView from './views/HomeView.tsx';
import OtherView from './views/OtherView.tsx';

export default defineRouter([
    defineView('/', HomeView),
    defineView('/other/:value', OtherView),
]);
