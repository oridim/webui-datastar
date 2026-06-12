import { defineRouter, defineView } from '@oridim/datastar-serve';

import AboutView from './views/AboutView.tsx';
import ContactView from './views/ContactView.tsx';
import HomeView from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),
    defineView('/about', AboutView),
    defineView('/contact', ContactView),
]);
