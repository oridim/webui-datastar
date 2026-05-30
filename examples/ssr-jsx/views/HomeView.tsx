import { WebUIDatastarHead } from '@oridim/webui-datastar';

import { Header } from '../components/Header.tsx';
import { ProfileCard } from '../components/ProfileCard.tsx';

export default function HomeView() {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>SSR JSX</title>

                <WebUIDatastarHead />
            </head>

            <body>
                <Header
                    title='Team Directory'
                    subtitle='Example of composed SSR JSX components.'
                />

                <main>
                    <ProfileCard name='Alice' role='Lead Engineer' />
                    <br />

                    <ProfileCard name='Bob' role='Framework Architect' />
                    <br />

                    <ProfileCard name='Charlie' role='Product Manager' />
                </main>
            </body>
        </html>
    );
}
