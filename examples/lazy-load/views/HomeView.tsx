import { defineAction, WebUIDatastarHead } from '@oridim/webui-datastar';

export const handleLazyLoad = defineAction(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2500));

    return {
        elements: (
            <div id='lazy-content' class='loaded-box'>
                <h2>Lazy Loaded Content!</h2>
                <p>This was fetched over IPC only when you scrolled to it.</p>
            </div>
        ),
    };
});

export default function HomeView() {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>Lazy Load</title>

                <WebUIDatastarHead />

                <link rel='stylesheet' href='/styles.css' />
            </head>

            <body>
                <main>
                    <h1>Lazy Loading Example</h1>
                    <p>Scroll down to trigger the lazy load...</p>

                    <div class='spacer' />

                    <div
                        id='lazy-content'
                        class='skeleton-box'
                        data-on-intersect__once={handleLazyLoad()}
                    >
                        Loading heavy content...
                    </div>
                </main>
            </body>
        </html>
    );
}
