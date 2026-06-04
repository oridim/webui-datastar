import { defineAction, WebUIDatastarHead } from '@oridim/webui-datastar';

import type { Signals } from '../signals.ts';
import DEFAULT_SIGNALS from '../signals.ts';

export const handleRegistration = defineAction<Signals>(
    async ({ username, email, role }) => {
        await new Promise((resolve) => setTimeout(resolve, 600));

        return {
            elements: (
                <div id='registration-container'>
                    <h2 style='color: green;'>Registration Successful!</h2>
                    <p>
                        Welcome to the platform, <strong>{username}</strong>.
                    </p>

                    <p>
                        Role assigned: <strong>{role}</strong>
                    </p>

                    <p>
                        <em>A confirmation email has been sent to {email}.</em>
                    </p>

                    <br />
                    <a href='/'>Register another user</a>
                </div>
            ),
        };
    },
);

export default function FormView() {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>Forms</title>

                <WebUIDatastarHead />
            </head>

            <body>
                <h1>New User Registration</h1>

                <div
                    id='registration-container'
                    data-signals={JSON.stringify(DEFAULT_SIGNALS)}
                >
                    <form>
                        {/* @ts-expect-error - HACK: Preact's typings don't like the deprecated `border` attribute. */}
                        <table border='0' cellpadding='8'>
                            <tbody>
                                <tr>
                                    <td>
                                        <label for='username'>Username:</label>
                                    </td>

                                    <td>
                                        <input
                                            type='text'
                                            id='username'
                                            name='username'
                                            data-bind='username'
                                            required
                                            minlength={3}
                                            placeholder='Minimum: 3 characters'
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <label for='email'>
                                            Email Address:
                                        </label>
                                    </td>

                                    <td>
                                        <input
                                            type='email'
                                            id='email'
                                            name='email'
                                            data-bind='email'
                                            required
                                            placeholder='name@example.com'
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <label for='role'>Account Role:</label>
                                    </td>

                                    <td>
                                        <select
                                            id='role'
                                            name='role'
                                            data-bind='role'
                                        >
                                            <option value='user'>
                                                Standard User
                                            </option>

                                            <option value='editor'>
                                                Content Editor
                                            </option>

                                            <option value='admin'>
                                                Administrator
                                            </option>
                                        </select>
                                    </td>
                                </tr>

                                <tr>
                                    <td colspan={2} align='right'>
                                        <button
                                            type='submit'
                                            data-on:click={handleRegistration(
                                                "{contentType: 'form'}",
                                            )}
                                        >
                                            Create Account
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </body>
        </html>
    );
}
