# Examples

Every example in this directory showcases the various capabilities of the Datastar Serve framework.

| Example                                                       | Description                                                                                                                                                 |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`calculator/`](./calculator/)                                | Showcases how to interactively / reactively operate on state between the frontend and backend contexts.                                                     |
| [`channels/`](./channels/)                                    | Showcases how to use `makeChannel`.                                                                                                                         |
| [`complex-router/`](./complex-router/)                        | Showcases how to use `defineGroup`, route parameters, and query parameters.                                                                                 |
| [`filesystem-assets/`](./filesystem-assets/)                  | Showcases how to use `defineStaticDirectory` and `defineStaticFile`.                                                                                        |
| [`forms/`](./forms/)                                          | Showcases how to handle form submissions without a full page reload through server-side streams.                                                            |
| [`ipc-spinner/`](./ipc-spinner/)                              | Showcases how to display a spinner while waiting on a server-side stream to complete.                                                                       |
| [`lazy-load/`](./lazy-load/)                                  | Showcases how to load data through server-side streams when an element is scrolled into view.                                                               |
| [`markdown-editor/`](./markdown-editor/)                      | Showcases a complex application with structured state.                                                                                                      |
| [`multi-page-app/`](./multi-page-app)                         | Showcases multi-page applications.                                                                                                                          |
| [`shell-loader/`](./shell-loader/)                            | Showcases how to display a loader between page loads.                                                                                                       |
| [`skeleton-load/`](./skeleton-load/)                          | Showcases how to load data through server-side streams on page load.                                                                                        |
| [`ssr-jsx/`](./ssr-jsx/)                                      | Showcases how to use SSR JSX.                                                                                                                               |
| [`static-directory-glob/`](./static-directory-glob/)          | Showcases how to use a glob pattern with `defineStaticDirectory`.                                                                                           |
| [`streams/`](./streams/)                                      | Showcases how to make server-side streams, async server-side streams, generator server-side streams, and async generator server-side streams.               |
| [`use-router-request-context/`](./use-route-request-context/) | Showcases how to use the `useRouterRequestContext` hook.                                                                                                    |
| [`view-transitions-api/`](./view-transitions-api)             | Showcases how to do page-level transition effects through the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API). |

## Running An Example

1. Open up the root project directory of Datastar Serve in a terminal.
2. Run `deno ci`.
3. Run any example in your terminal via: `deno run --allow-read --allow-net ./examples/<example-directory>/mod.ts`

## Running The Markdown Editor Example

1. Open up the root project directory of Datastar Serve in a terminal.
2. Run `deno ci`.
3. Run any example in your terminal via: `deno run --allow-read --allow-write --allow-net --allow-env --allow-ffi ./examples/markdown-editor/mod.ts`
