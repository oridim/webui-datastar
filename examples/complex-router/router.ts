import { defineGroup, defineRouter, defineView } from '@oridim/webui-datastar';

import HomeView from './views/HomeView.tsx';
import SearchView from './views/SearchView.tsx';
import UserView from './views/UserView.tsx';

export default defineRouter([
    defineView('/', HomeView),

    defineGroup('/users', [
        defineView('/:id', UserView),
    ]),

    defineGroup('/shop', [
        defineView('/search', SearchView),
    ]),
]);
