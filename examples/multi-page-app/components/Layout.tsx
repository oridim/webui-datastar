import type { JSX } from '@oridim/webui-datastar';
import { WebUIDatastarHead } from '@oridim/webui-datastar';

export interface LayoutProps {
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
            </head>

            <body>
                <nav>
                    <a href='/'>Home</a> | &nbsp;
                    <a href='/about'>About</a> | &nbsp;
                    <a href='/contact'>Contact</a>
                </nav>

                <hr />

                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
