export interface Signals {
    readonly counter: number;

    readonly status: string;
}

export default {
    counter: 0,
    status: 'Idle',
} satisfies Signals;
