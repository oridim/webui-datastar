import type { JSX } from '@oridim/webui-datastar';
import { WebUIDatastarHead } from '@oridim/webui-datastar';

import StatusBar from './StatusBar.tsx';

import DEFAULT_SIGNALS from '../signals.ts';

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

                <WebUIDatastarHead />

                <link rel='stylesheet' href='/styles/styles.css' />
            </head>

            <body data-signals={JSON.stringify(DEFAULT_SIGNALS)}>
                {children}

                <StatusBar />
            </body>
        </html>
    );
}
