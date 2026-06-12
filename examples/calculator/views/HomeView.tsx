import { defineStream, FrameworkHead } from '@oridim/datastar-serve';

import type { Signals } from '../signals.ts';
import DEFAULT_SIGNALS from '../signals.ts';

const CALCULATOR_BUTTONS = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
];

function calculate(
    operation: string,
    leftOperand: string,
    rightOperand: string,
): string {
    const leftValue = parseFloat(leftOperand);
    const rightValue = parseFloat(rightOperand);

    if (isNaN(leftValue) || isNaN(rightValue)) return 'Error';

    switch (operation) {
        case '+':
            return String(leftValue + rightValue);
        case '-':
            return String(leftValue - rightValue);
        case '*':
            return String(leftValue * rightValue);
        case '/':
            return rightValue === 0 ? 'Error' : String(leftValue / rightValue);
        default:
            return rightOperand;
    }
}

export const handleButtonClick = defineStream<Signals>(
    '/streams/handleButtonClick',
    ({ signals }) => {
        let { button, display, leftOperand, operation, reset } = signals;

        if (!button) {
            return null;
        }

        if (button === 'C') {
            return {
                patchSignals: {
                    signals: {
                        button: null,
                        display: '0',
                        leftOperand: null,
                        operation: null,
                        reset: false,
                    },
                },
            };
        }

        if (['+', '-', '*', '/'].includes(button)) {
            if (operation && leftOperand !== null && !reset) {
                display = calculate(operation, leftOperand, display);
            }

            return {
                patchSignals: {
                    signals: {
                        button: null,
                        display,
                        leftOperand: display,
                        operation: button,
                        reset: true,
                    },
                },
            };
        }

        if (button === '=') {
            if (operation && leftOperand !== null) {
                display = calculate(operation, leftOperand, display);

                return {
                    patchSignals: {
                        signals: {
                            button: null,
                            display,
                            leftOperand: null,
                            operation: null,
                            reset: true,
                        },
                    },
                };
            }

            return {
                patchSignals: {
                    signals: {
                        button: null,
                    },
                },
            };
        }

        if (reset) {
            display = button;
            reset = false;
        } else {
            if (button === '.' && display.includes('.')) {
                return {
                    patchSignals: {
                        signals: {
                            button: null,
                        },
                    },
                };
            }

            display = display === '0' && button !== '.'
                ? button
                : display + button;
        }

        return {
            patchSignals: {
                signals: {
                    button: null,
                    display,
                    reset,
                },
            },
        };
    },
);

export default function HomeView() {
    const clickExpression = (value: string) =>
        `$button='${value}';@get('/streams/handleButtonClick')`;

    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>Calculator</title>

                <FrameworkHead />
            </head>

            <body data-signals={JSON.stringify(DEFAULT_SIGNALS)}>
                <div>
                    {/* @ts-expect-error - HACK: Preact's typings don't like the deprecated `border` attribute. */}
                    <table border={1} cellpadding='1' width='250'>
                        <tbody>
                            <tr>
                                <td colspan={4} align='right'>
                                    <strong data-text='$display'>0</strong>
                                </td>
                            </tr>

                            {CALCULATOR_BUTTONS.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((label) => (
                                        <td key={label} align='center'>
                                            <button
                                                data-on:click={clickExpression(
                                                    label,
                                                )}
                                            >
                                                {label}
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            <tr>
                                <td colspan={4} align='center'>
                                    <button
                                        data-on:click={clickExpression('C')}
                                    >
                                        Clear
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    );
}
