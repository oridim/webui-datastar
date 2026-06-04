import { defineAction, WebUIDatastarHead } from '@oridim/webui-datastar';

import type { PartialSignals, Signals } from '../signals.ts';
import DEFAULT_SIGNALS from '../signals.ts';

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

export const handleButtonPress = defineAction<Signals, PartialSignals>(
    (signals) => {
        let { button, display, leftOperand, operation, reset } = signals;

        if (!button) {
            return {
                signals: {},
            };
        }

        if (button === 'C') {
            return {
                signals: {
                    button: null,
                    display: '0',
                    leftOperand: null,
                    operation: null,
                    reset: false,
                },
            };
        }

        if (['+', '-', '*', '/'].includes(button)) {
            if (operation && leftOperand !== null && !reset) {
                display = calculate(operation, leftOperand, display);
            }

            return {
                signals: {
                    button: null,
                    display,
                    leftOperand: display,
                    operation: button,
                    reset: true,
                },
            };
        }

        if (button === '=') {
            if (operation && leftOperand !== null) {
                display = calculate(operation, leftOperand, display);

                return {
                    signals: {
                        button: null,
                        display,
                        leftOperand: null,
                        operation: null,
                        reset: true,
                    },
                };
            }

            return {
                signals: {
                    button: null,
                },
            };
        }

        if (reset) {
            display = button;
            reset = false;
        } else {
            if (button === '.' && display.includes('.')) {
                return {
                    signals: {
                        button: null,
                    },
                };
            }

            display = display === '0' && button !== '.'
                ? button
                : display + button;
        }

        return {
            signals: {
                button: null,
                display,
                reset,
            },
        };
    },
);

export default function HomeView() {
    const clickExpression = (value: string) =>
        `$button='${value}'; ${handleButtonPress()}`;

    return (
        <html lang='en'>
            <head>
                <meta charset='UTF-8' />
                <title>Calculator</title>

                <WebUIDatastarHead />
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

                            <tr>
                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('7')}
                                    >
                                        7
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('8')}
                                    >
                                        8
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('9')}
                                    >
                                        9
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('/')}
                                    >
                                        /
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('4')}
                                    >
                                        4
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('5')}
                                    >
                                        5
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('6')}
                                    >
                                        6
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('*')}
                                    >
                                        *
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('1')}
                                    >
                                        1
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('2')}
                                    >
                                        2
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('3')}
                                    >
                                        3
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('-')}
                                    >
                                        -
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('0')}
                                    >
                                        0
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('.')}
                                    >
                                        .
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('=')}
                                    >
                                        =
                                    </button>
                                </td>

                                <td align='center'>
                                    <button
                                        data-on:click={clickExpression('+')}
                                    >
                                        +
                                    </button>
                                </td>
                            </tr>

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
