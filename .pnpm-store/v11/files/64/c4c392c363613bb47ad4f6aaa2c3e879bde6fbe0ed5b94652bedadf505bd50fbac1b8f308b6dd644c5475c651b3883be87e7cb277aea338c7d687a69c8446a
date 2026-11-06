import type { Channel, CartesianChartMark, ChartKey, ChartMark, ChartMarkMotionOptions, ChartValue, MarkCallOptions, MarkChannelOutput, MarkScaleBindings, VisualChannel } from './types.js';
export interface BandXOptions<TDatum> extends ChartMarkMotionOptions<TDatum> {
    id?: string;
    x?: Channel<TDatum, ChartValue | null | undefined>;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    fill?: VisualChannel<TDatum, string>;
    fillOpacity?: number;
    width?: number;
    inset?: number;
    radius?: number;
    xScale?: string;
}
export interface BandYOptions<TDatum> extends ChartMarkMotionOptions<TDatum> {
    id?: string;
    y?: Channel<TDatum, ChartValue | null | undefined>;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    fill?: VisualChannel<TDatum, string>;
    fillOpacity?: number;
    height?: number;
    inset?: number;
    radius?: number;
    yScale?: string;
}
type BandXCallOptions<TDatum, TXChannel, TXScaleId extends string | undefined> = MarkCallOptions<BandXOptions<NoInfer<TDatum>>, {
    x?: TXChannel;
    xScale?: TXScaleId;
}>;
type BandYCallOptions<TDatum, TYChannel, TYScaleId extends string | undefined> = MarkCallOptions<BandYOptions<NoInfer<TDatum>>, {
    y?: TYChannel;
    yScale?: TYScaleId;
}>;
export declare function bandX<TDatum>(source: Iterable<TDatum>): ChartMark<TDatum, number, number>;
export declare function bandX<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TXScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: BandXCallOptions<TDatum, TXChannel, TXScaleId> | undefined): CartesianChartMark<TDatum, MarkChannelOutput<TDatum, TXChannel, number>, number, MarkChannelOutput<TDatum, TXChannel, number>, never, MarkScaleBindings<TXScaleId, 'y'>>;
export declare function bandY<TDatum>(source: Iterable<TDatum>): ChartMark<TDatum, number, number>;
export declare function bandY<TDatum, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: BandYCallOptions<TDatum, TYChannel, TYScaleId> | undefined): CartesianChartMark<TDatum, number, MarkChannelOutput<TDatum, TYChannel, number>, never, MarkChannelOutput<TDatum, TYChannel, number>, MarkScaleBindings<'x', TYScaleId>>;
export {};
