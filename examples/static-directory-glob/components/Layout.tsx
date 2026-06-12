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
                <title>{title} :: Static Directory Glob</title>

                <FrameworkHead />

                <link rel='stylesheet' href='/styles.css' />
            </head>

            <body>
                {children}
            </body>
        </html>
    );
}
