import type { DeepPartial } from './types.ts';

export const VIEW_MODES = {
    edit: 'edit',

    preview: 'preview',

    split: 'split',
} as const;

export type ViewModes = typeof VIEW_MODES[keyof typeof VIEW_MODES];

export type PartialState = DeepPartial<State>;

export interface State {
    readonly ephemeralFile: {
        readonly fileName: string;

        readonly isCreating: boolean;

        readonly wasFileCreated: boolean;
    };

    readonly shell: {
        readonly isSidebarOpen: boolean;

        readonly viewMode: ViewModes;
    };

    readonly status: {
        readonly isLoading: boolean;

        readonly isVisible: boolean;

        readonly message: string;
    };

    readonly workspace: {
        readonly directoryPath: string | null;

        readonly fileContent: string;

        readonly filePath: string | null;
    };
}

export default {
    ephemeralFile: {
        fileName: '',
        isCreating: false,
        wasFileCreated: false,
    },

    shell: {
        isSidebarOpen: true,
        viewMode: VIEW_MODES.split,
    },

    status: {
        isLoading: false,
        isVisible: false,
        message: '',
    },

    workspace: {
        directoryPath: null,
        fileContent: '',
        filePath: null,
    },
} satisfies State;
