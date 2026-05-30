import { WebUIDatastarHead } from '@oridim/webui-datastar';
import type { ComponentChildren } from 'preact';

import StatusBar from '../components/StatusBar.tsx';

import DEFAULT_STATE from '../state.ts';

export interface LayoutProps {
    readonly children: ComponentChildren;
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

                <link rel='stylesheet' href='/styles.css' />
            </head>

            <body data-signals={JSON.stringify(DEFAULT_STATE)}>
                {children}

                <StatusBar />
            </body>
        </html>
    );
}
