import { TextLineStream } from 'jsr:@std/streams@1.1.1';

const PATH_EXECUTABLE = Deno.execPath();

export const SUBCOMMANDS = {
    serve: 'serve',

    ui: 'ui',
} as const;

export const SUBCOMMAND = (Deno.args[0] ?? SUBCOMMANDS.ui) as Subcommands;

export type Subcommands = typeof SUBCOMMANDS[keyof typeof SUBCOMMANDS];

export function spawnWorker(
    appArgs: string[] = [],
    denoFlags: string[] = [],
    options: Omit<Deno.CommandOptions, 'args'> = {},
): Deno.ChildProcess {
    const args = Deno.build.standalone
        ? appArgs
        : ['run', ...denoFlags, Deno.mainModule, ...appArgs];

    const command = new Deno.Command(
        PATH_EXECUTABLE,
        {
            ...options,
            args,
        },
    );

    return command.spawn();
}

export async function waitForSignal(
    stdout: ReadableStream<Uint8Array>,
    signal: string,
) {
    const [loggingStream, signalStream] = stdout.tee();

    loggingStream
        .pipeTo(Deno.stdout.writable)
        .catch((error) => {
            console.error(
                "bad argument #0 to 'waitForSignal' (stdout stream threw an error):",
            );
            console.error(error);

            Deno.exit(1);
        });

    const lines = signalStream
        .pipeThrough(
            new TextDecoderStream() as TransformStream<Uint8Array, string>,
        )
        .pipeThrough(new TextLineStream());

    for await (const line of lines) {
        if (line === signal) {
            return;
        }
    }
}
