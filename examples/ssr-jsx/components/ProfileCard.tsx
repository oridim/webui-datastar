interface ProfileCardProps {
    readonly name: string;

    readonly role: string;
}

export function ProfileCard({ name, role }: ProfileCardProps) {
    return (
        // @ts-expect-error - HACK: Preact's typings don't like the deprecated `border` attribute.
        <table border='1' cellpadding='10' width='300'>
            <tbody>
                <tr>
                    <td width='30%'>
                        <strong>Name:</strong>
                    </td>

                    <td>{name}</td>
                </tr>

                <tr>
                    <td>
                        <strong>Role:</strong>
                    </td>

                    <td>{role}</td>
                </tr>
            </tbody>
        </table>
    );
}
