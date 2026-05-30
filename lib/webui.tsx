import type { JSX } from './preact.ts';

export const WEBUI_BASE_URL = 'http://localhost';

export function WebUIHead(): JSX.Element {
    return <script src='webui.js'></script>;
}
