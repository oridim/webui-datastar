export type PartialSignals = Partial<Signals>;

export interface Signals {
    readonly button: string | null;

    readonly display: string;

    readonly leftOperand: string | null;

    readonly operation: string | null;

    readonly reset: boolean;
}

export default {
    button: null,
    display: '0',
    leftOperand: null,
    operation: null,
    reset: false,
} satisfies Signals;
