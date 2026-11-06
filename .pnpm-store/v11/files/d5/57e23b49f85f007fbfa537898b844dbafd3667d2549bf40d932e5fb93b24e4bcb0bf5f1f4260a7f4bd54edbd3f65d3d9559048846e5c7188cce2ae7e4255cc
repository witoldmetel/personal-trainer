import type { Channel, ChannelOutput, CartesianChartMark, CartesianScaleBindings, ChartKey, ChartMarkMotionOptions, ChartValue, MarkCallOptions, MarkScaleBindings, VisualChannel } from './types.js';
export interface ArrowOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    x1: Channel<TDatum, ChartValue | null | undefined>;
    y1: Channel<TDatum, ChartValue | null | undefined>;
    x2: Channel<TDatum, ChartValue | null | undefined>;
    y2: Channel<TDatum, ChartValue | null | undefined>;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    headLength?: number;
    headAngle?: number;
}
type ArrowCallOptions<TDatum, TX1Channel, TY1Channel, TX2Channel, TY2Channel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<ArrowOptions<NoInfer<TDatum>>, {
    x1: TX1Channel;
    y1: TY1Channel;
    x2: TX2Channel;
    y2: TY2Channel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
/** Draws one straight directed segment per datum with a scale-independent head. */
export declare function arrow<TDatum, const TX1Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TY1Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TX2Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TY2Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: ArrowCallOptions<TDatum, TX1Channel, TY1Channel, TX2Channel, TY2Channel, TXScaleId, TYScaleId>): CartesianChartMark<TDatum, ChannelOutput<TDatum, TX1Channel, number> | ChannelOutput<TDatum, TX2Channel, number>, ChannelOutput<TDatum, TY1Channel, number> | ChannelOutput<TDatum, TY2Channel, number>, ChannelOutput<TDatum, TX1Channel, number> | ChannelOutput<TDatum, TX2Channel, number>, ChannelOutput<TDatum, TY1Channel, number> | ChannelOutput<TDatum, TY2Channel, number>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
