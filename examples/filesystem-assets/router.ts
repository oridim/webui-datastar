import {
    defineRouter,
    defineStaticDirectory,
    defineStaticFile,
} from '@oridim/datastar-serve';

export default defineRouter([
    // NOTE: Plain strings are supported for the second arguments of the below
    // functions. HOWEVER, using `URL` w/ `import.meta.url` here supports:
    // - File paths relative to `router.ts`.
    // - Deno's file inclusion for the `deno compile` command.
    defineStaticFile('/', new URL('./index.html', import.meta.url)),
    defineStaticDirectory('/', new URL('./public', import.meta.url)),
]);
