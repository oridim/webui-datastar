# webui-datastar

> Framework for WebUI which glues a WebView frontend and Deno backend together over IPC via Datastar.

# Getting Started

## 1. Installation

> **NOTE:** The version of WebUI you install needs to be compatible with webui-datastar's internal version of WebUI.

Install the WebUI and webui-datastar:

```sh
deno install jsr:@webui/deno-webui jsr:@oridim/webui-datastar
```

## 2. Configuration

Configure Deno and typing support of JSX by putting this in your `deno.json`:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@oridim/webui-datastar",
        "jsxImportSourceTypes": "@oridim/webui-datastar"
    }
}
```

## 3. Create a View Component

Create `views/` directory with a `views/HomeView.jsx` file:

```jsx
export default function HomeView() {
    return (
        <html>
            <body>
                Hello World!
            </body>
        </html>
    );
}
```

## 4. Create a Router

Create a `router.js` file which exports a router configuration that points to your view component:

```js
import { defineRouter, defineView } from '@oridim/webui-datastar';

import HomeView from './views/HomeView.tsx';

export default defineRouter([
    defineView('/', HomeView),
]);
```

## 5. Create an Entry Point

Create an `mod.ts` file which launches a new webview with your router configuration:

```js
import { initWebUIDatastar } from '@oridim/webui-datastar';
import { WebUI } from '@webui/deno-webui';

import APP_ROUTER from './router.ts';

const window = new WebUI();

initWebUIDatastar({
    window,
    router: APP_ROUTER,
});

await window.showWebView('/');
await WebUI.wait();
```

# Examples

Visit the [`/examples`](./examples) directory for complete usage examples on how to use the framework.

# Documentation

> **NOTE:** Visit [Datastar Documentation](https://data-star.dev/), [WebUI Backend Documentation](https://webui.me/docs.html#/deno), and [WebUI Frontend Documentation](https://webui.me/docs.html#/javascript) for more information on how those pieces of the tech stack work.

> **TODO:** Missing docstrings.

Visit the [JSR `@oridim/webui-datastar` package page](https://jsr.io/@oridim/webui-datastar) for the API reference docs.

# License

webui-datastar is licensed under the [MIT License](./LICENSE).

# References

- [`preactjs/preact`](https://github.com/preactjs/preact) — webui-datastar uses to render JSX elements on the backend.
- [`starfederation/datastar`](https://github.com/starfederation/datastar) — webui-datastar is built upon this framework, which provides the basis of interactivity and reactivity.
- [`webui-dev/deno-webui`](https://github.com/webui-dev/deno-webui) — webui-datastar is built upon this library, which provides the basis of the backing webview.
