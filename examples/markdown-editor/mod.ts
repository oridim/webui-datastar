import { SUBCOMMAND, SUBCOMMANDS } from './utilities/command.ts';

import defer * as SERVE_CALLBACK from './serve.ts';
import defer * as UI_CALLBACK from './ui.ts';

switch (SUBCOMMAND) {
    case SUBCOMMANDS.serve:
        await SERVE_CALLBACK.default();
        break;

    case SUBCOMMANDS.ui:
        await UI_CALLBACK.default();
        break;
}
