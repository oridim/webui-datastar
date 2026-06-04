export const HTML_NAMESPACES = {
    html: 'html',

    mathml: 'mathml',

    svg: 'svg',
} as const;

export type HTMLNamespaces =
    typeof HTML_NAMESPACES[keyof typeof HTML_NAMESPACES];
