import { defineAction, WebUIDatastarHead } from '@oridim/webui-datastar';

export const handleFetchProfile = defineAction(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2500));

    return {
        elements: (
            <div id='profile-widget' class='profile-card'>
                <img
                    src='/dicebear_avataaars.FelixTheCat.svg'
                    alt='Avatar'
                />

                <h2>Felix The Cat</h2>
                <p>Senior Developer</p>
            </div>
        ),
    };
});

export default function HomeView() {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>Skeleton Load</title>

                <WebUIDatastarHead />

                <link rel='stylesheet' href='/styles.css' />
            </head>

            <body>
                <main>
                    <p>
                        The profile widget fetches its data immediately on load.
                    </p>

                    <div
                        id='profile-widget'
                        class='skeleton-card'
                        data-init={handleFetchProfile()}
                    >
                        <div class='skeleton-avatar' />
                        <div class='skeleton-text-line' />
                        <div class='skeleton-text-line short' />
                    </div>
                </main>
            </body>
        </html>
    );
}
