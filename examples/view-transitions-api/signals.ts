export interface Signals {
    readonly counter: number;

    readonly skipViewTransitions: boolean;
}

export default {
    counter: 0,
    skipViewTransitions: false,
} satisfies Signals;
