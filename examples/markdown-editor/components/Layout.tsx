import type { JSX } from '@oridim/datastar-serve';
import { FrameworkHead } from '@oridim/datastar-serve';

import DEFAULT_SIGNALS from '../signals.ts';
import APP_WEBUI from '../webui.ts';

import StatusBar from './StatusBar.tsx';

export interface LayoutProps {
    readonly children: JSX.Element | JSX.Element[] | string;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <html lang='en'>
            <head>
                <meta charSet='UTF-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                />

                <title>Markdown Editor</title>

                <FrameworkHead />

                <script
                    type='application/javascript'
                    src={`http://127.0.0.1:${APP_WEBUI.getPort()}/webui.js`}
                >
                </script>

                <link rel='stylesheet' href='/styles/styles.css' />
            </head>

            <body data-signals={JSON.stringify(DEFAULT_SIGNALS)}>
                {children}

                <StatusBar />
            </body>
        </html>
    );
}
