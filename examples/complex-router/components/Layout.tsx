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
                <title>{title} :: Complex Router</title>

                <WebUIDatastarHead />
            </head>

            <body>
                <nav>
                    <a href='/'>Home</a> | &nbsp;
                    <a href='/users/99'>User 99 (Params)</a> | &nbsp;
                    <a href='/users/42'>User 42 (Params)</a> | &nbsp;
                    <a href='/shop/search?q=boots&sort=price'>
                        Search Boots (Query)
                    </a>&nbsp; | &nbsp;
                    <a href='/shop/search?q=hats&sort=rating'>
                        Search Hats (Query)
                    </a>
                </nav>

                <hr />

                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
