import type { JSX } from '@oridim/datastar-serve';
import { FrameworkHead } from '@oridim/datastar-serve';

import { URL_WEBUI_SCRIPT } from '../utilities/webui.ts';

import DEFAULT_SIGNALS from '../signals.ts';

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
                    src={URL_WEBUI_SCRIPT.href}
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
