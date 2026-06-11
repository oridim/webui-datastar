import { defineStream, FrameworkHead } from '@oridim/datastar-serve';

export const handleFetchProfile = defineStream(
    '/streams/handleFetchProfile',
    async () => {
        await new Promise((resolve) => setTimeout(resolve, 2500));

        return {
            patchElements: {
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
            },
        };
    },
);

export default function HomeView() {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>Skeleton Load</title>

                <FrameworkHead />

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
                        data-init="@get('/streams/handleFetchProfile')"
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
