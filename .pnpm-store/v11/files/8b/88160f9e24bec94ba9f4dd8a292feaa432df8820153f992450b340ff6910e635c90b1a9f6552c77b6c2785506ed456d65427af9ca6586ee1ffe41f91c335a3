import type { Channel, ChannelOutput, CartesianChartMark, CartesianScaleBindings, ChartKey, ChartMarkMotionOptions, ChartValue, MarkCallOptions, MarkScaleBindings, VisualChannel } from './types.js';
export interface VoronoiOptions<TDatum> extends ChartMarkMotionOptions<never>, CartesianScaleBindings {
    id?: string;
    x: Channel<TDatum, ChartValue | null | undefined>;
    y: Channel<TDatum, ChartValue | null | undefined>;
    /** Builds a separate full-extent tessellation for each non-null group. */
    z?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    fill?: VisualChannel<TDatum, string>;
    fillOpacity?: number;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
    opacity?: number;
}
type VoronoiCallOptions<TDatum, TXChannel, TYChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<VoronoiOptions<NoInfer<TDatum>>, {
    x: TXChannel;
    y: TYChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
/** Draws final-screen Voronoi cells without adding focus candidates. */
export declare function voronoi<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: VoronoiCallOptions<TDatum, TXChannel, TYChannel, TXScaleId, TYScaleId>): CartesianChartMark<never, never, never, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
