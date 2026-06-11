# Datastar Serve

> A Deno HTTP framework that simplifies the developer experience of using Datastar in a complete package.

# Features

## Framework Features

- **Client-Side Routing:** Navigate without hard refreshes by patching pages directly from the backend.
- **Server-Side Actions:** Declaratively wire frontend-to-backend IPC directly inside your HTML.
- **Server-Side JSX Rendering (SSR):** Use JSX as your native backend HTML templating language.
- **Server-Side Routing:** Easily serve views, custom routes, and static assets with a built-in router.
- **Stream Patches:** Fully control UI updates by streaming patches from your backend sync and async function and generator streams.
- **Zero-Build Frontend:** Import the framework and launch a webview without a frontend build step.

## Datastar Features

[Datastar](https://data-star.dev) allows you to incorporate interactivity and reactivity declaratively into your HTML.

# Getting Started

## 1. Installation

Install the Datastar Serve package:

```sh
deno install jsr:@oridim/datastar-serve
```

## 2. Configuration

Configure Deno and typing support of JSX by putting this in your `deno.json`:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@oridim/datastar-serve",
        "jsxImportSourceTypes": "@oridim/datastar-serve"
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
import { defineRouter, defineView } from '@oridim/datastar-serve';

import HomeView from './views/HomeView.jsx';

export default defineRouter([
    defineView('/', HomeView),
]);
```

## 5. Create an Entry Point

Create an `mod.js` file starts an HTTP server with your router configuration:

```js
import { serve } from '@oridim/datastar-serve';

import APP_ROUTER from './router.js';

serve({
    router: APP_ROUTER,
    serve: {
        onListen({ hostname, port }) {
            console.log(`Visit: http://${hostname}:${port}`);
        },
    },
});
```

## 6. Boot the Application

Give the application the permissions needed for WebUI to work when you run it:

```sh
deno run --allow-read --allow-net ./mod.js
```

# Examples

Visit the [`/examples`](./examples) directory for complete usage examples on how to use the framework.

# Documentation

> **NOTE:** Visit [Datastar Documentation](https://data-star.dev/) for more information on how that piece of the tech stack work.

> **TODO:** Missing docstrings.

Visit the [JSR `@oridim/datastar-serve` package page](https://jsr.io/@oridim/datastar-serve) for the API reference docs.

# License

Datastar Serve is licensed under the [MIT License](./LICENSE).

# References

- [`preactjs/preact`](https://github.com/preactjs/preact) — Datastar Serve uses to render JSX elements on the backend.
- [`starfederation/datastar`](https://github.com/starfederation/datastar) — Datastar Serve is built upon this framework, which provides the basis of interactivity and reactivity.
