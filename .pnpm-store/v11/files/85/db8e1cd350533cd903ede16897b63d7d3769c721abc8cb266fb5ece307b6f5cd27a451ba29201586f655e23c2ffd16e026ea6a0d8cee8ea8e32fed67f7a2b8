import type { Channel, ChannelOutput, CartesianChartMark, CartesianScaleBindings, ChartCurve, ChartKey, ChartMarkMotionOptions, ChartValue, MarkCallOptions, MarkScaleBindings, VisualChannel } from './types.js';
export interface LinkOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    x1: Channel<TDatum, ChartValue | null | undefined>;
    y1: Channel<TDatum, ChartValue | null | undefined>;
    x2: Channel<TDatum, ChartValue | null | undefined>;
    y2: Channel<TDatum, ChartValue | null | undefined>;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: VisualChannel<TDatum, number>;
    strokeWidth?: VisualChannel<TDatum, number>;
    strokeDasharray?: string;
    lineCap?: 'butt' | 'round' | 'square';
    curve?: ChartCurve;
}
type LinkCallOptions<TDatum, TX1Channel, TY1Channel, TX2Channel, TY2Channel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<LinkOptions<NoInfer<TDatum>>, {
    x1: TX1Channel;
    y1: TY1Channel;
    x2: TX2Channel;
    y2: TY2Channel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
/**
 * Draws one independent segment per datum between two scaled positions.
 *
 * Link is the general segment primitive for intervals, error bars, networks,
 * slopegraphs, and annotations. Use lineY when consecutive rows form a path.
 */
export declare function link<TDatum, const TX1Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TY1Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TX2Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TY2Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: LinkCallOptions<TDatum, TX1Channel, TY1Channel, TX2Channel, TY2Channel, TXScaleId, TYScaleId>): CartesianChartMark<TDatum, ChannelOutput<TDatum, TX1Channel, number> | ChannelOutput<TDatum, TX2Channel, number>, ChannelOutput<TDatum, TY1Channel, number> | ChannelOutput<TDatum, TY2Channel, number>, ChannelOutput<TDatum, TX1Channel, number> | ChannelOutput<TDatum, TX2Channel, number>, ChannelOutput<TDatum, TY1Channel, number> | ChannelOutput<TDatum, TY2Channel, number>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
