export interface Signals {
    readonly email: string;

    readonly role: string;

    readonly username: string;
}

export default {
    email: '',
    role: 'user',
    username: '',
} satisfies Signals;
