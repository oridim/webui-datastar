import type { JSX } from '@oridim/webui-datastar';
import { WebUIDatastarHead } from '@oridim/webui-datastar';

import DEFAULT_SIGNALS from '../signals.ts';

interface LayoutProps {
    readonly children: JSX.Element | JSX.Element[] | string;

    readonly title: string;
}

export default function Layout({ children, title }: LayoutProps) {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>{title}</title>

                <WebUIDatastarHead />

                <link rel='stylesheet' href='/styles.css' />
            </head>

            <body data-signals={JSON.stringify(DEFAULT_SIGNALS)}>
                <nav>
                    <a
                        href='/'
                        data-attr:data-use-view-transition='!$skipViewTransitions'
                    >
                        Home
                    </a>

                    &nbsp; | &nbsp;

                    <a
                        href='/other'
                        data-attr:data-use-view-transition='!$skipViewTransitions'
                    >
                        Other Page
                    </a>

                    <hr />

                    <label>
                        <input
                            type='checkbox'
                            data-bind='skipViewTransitions'
                        />
                        <strong>Disable View Transitions for Navigation</strong>
                    </label>

                    <hr />
                </nav>

                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
