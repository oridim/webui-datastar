import type { JSX } from '../preact/components.ts';

export function WebUIHead(): JSX.Element {
    return <script src='webui.js'></script>;
}
