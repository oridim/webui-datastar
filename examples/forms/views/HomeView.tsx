import { defineStream, FrameworkHead } from '@oridim/datastar-serve';

import type { Signals } from '../signals.ts';
import DEFAULT_SIGNALS from '../signals.ts';

export const handleRegistration = defineStream<Signals>(
    '/streams/handleRegistration',
    async ({ request }) => {
        const formData = await request.formData();
        const { username, email, role } = Object.fromEntries(
            formData.entries(),
        );

        await new Promise((resolve) => setTimeout(resolve, 600));

        return {
            patchElements: {
                elements: (
                    <div id='registration-container'>
                        <h2 style='color: green;'>Registration Successful!</h2>

                        <p>
                            Welcome to the platform,{' '}
                            <strong>{username}</strong>.
                        </p>

                        <p>
                            Role assigned: <strong>{role}</strong>
                        </p>

                        <p>
                            <em>
                                A confirmation email has been sent to {email}.
                            </em>
                        </p>

                        <br />

                        <a href='/'>Register another user</a>
                    </div>
                ),
            },
        };
    },
);

export default function FormView() {
    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>Forms</title>

                <FrameworkHead />
            </head>

            <body>
                <h1>New User Registration</h1>

                <div
                    id='registration-container'
                    data-signals={JSON.stringify(DEFAULT_SIGNALS)}
                >
                    <form data-on:submit="@post('/streams/handleRegistration', {contentType: 'form'})">
                        <p>
                            <label for='username'>Username:</label>

                            <input
                                type='text'
                                id='username'
                                minlength={3}
                                name='username'
                                placeholder='Minimum: 3 characters'
                                data-bind='username'
                                required
                            />
                        </p>

                        <p>
                            <label for='email'>
                                Email Address:
                            </label>

                            <input
                                type='email'
                                id='email'
                                name='email'
                                placeholder='name@example.com'
                                data-bind='email'
                                required
                            />
                        </p>

                        <p>
                            <label for='role'>Account Role:</label>

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
                        </p>

                        <button type='submit'>
                            Create Account
                        </button>
                    </form>
                </div>
            </body>
        </html>
    );
}
