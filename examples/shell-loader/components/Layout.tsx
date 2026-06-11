import type { JSX } from '@oridim/datastar-serve';
import { FrameworkHead } from '@oridim/datastar-serve';

export interface LayoutProps {
    readonly children: JSX.Element | JSX.Element[] | string;

    readonly title: string;
}

export default function Layout({ children, title }: LayoutProps) {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>{title} :: Shell Loader</title>

                <FrameworkHead />

                <link rel='stylesheet' href='/styles.css' />
            </head>

            <body
                data-signals='{ globalLoading: false }'
                data-on:datastar-fetch__window="$globalLoading = (evt.detail.type === 'started')"
            >
                <div
                    class='shell-loader'
                    data-class:is-loading='$globalLoading'
                />

                <nav>
                    <a href='/'>Home</a>
                    &nbsp; | &nbsp;
                    <a href='/other'>Other Page (Slow)</a>
                </nav>

                <hr />

                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
