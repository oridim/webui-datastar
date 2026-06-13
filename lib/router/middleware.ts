import { Signals, UnknownSignals } from '../utilities/datastar.ts';
import { Middleware } from '../utilities/middleware.ts';

import {
    RouteCallback,
    StreamChannelCallback,
    StreamRouteCallback,
    ViewCallback,
} from './types.ts';

export type RouteMiddleware<Path extends string = string> = Middleware<
    RouteCallback<Path>
>;

export type StreamChannelMiddleware<
    Path extends string = string,
    InputSignals extends Signals<unknown> = UnknownSignals,
    OutputSignals extends Signals<unknown> = InputSignals,
> = Middleware<StreamChannelCallback<Path, InputSignals, OutputSignals>>;

export type StreamMiddleware<
    Path extends string = string,
    InputSignals extends Signals<unknown> = UnknownSignals,
    OutputSignals extends Signals<unknown> = InputSignals,
> = Middleware<StreamRouteCallback<Path, InputSignals, OutputSignals>>;

export type ViewMiddleware<Path extends string = string> = Middleware<
    ViewCallback<Path>
>;
