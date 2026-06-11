# Markdown Editor Example

> Showcases a complex application with structured state.

<center>
    <img src="./screenshot-a.webp" />
    <img src="./screenshot-b.webp" />
    <img src="./screenshot-c.webp" />
    <img src="./screenshot-d.webp" />
    <img src="./screenshot-e.webp" />
    <img src="./screenshot-f.webp" />
</center>

## Technical Note

Because `Deno.serve` and WebUI both require control of the executing thread they cannot be ran in the same thread. Furthermore, due to how loading of FFI bindings work (I think?) the native libraries needed cannot be loaded on an off-main thread. So, either the HTTP server or the WebUI webview needs to be ran in a child process. And that requires a bit more boilerplate. Especially to support `deno compile` for compiled distributables.

## Compiling

1. Open a terminal at `/examples/markdown-editor`.
2. Run `deno compile --include ./public --allow-read --allow-write --allow-net --allow-env --allow-ffi --allow-run ./mod.ts`
3. Run `./markdown-editor`.
