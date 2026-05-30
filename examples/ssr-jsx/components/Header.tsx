interface HeaderProps {
    readonly subtitle?: string;

    readonly title: string;
}

export function Header({ title, subtitle }: HeaderProps) {
    return (
        <header>
            <h1>{title}</h1>

            {subtitle && (
                <p>
                    <em>{subtitle}</em>
                </p>
            )}

            <hr />
        </header>
    );
}
