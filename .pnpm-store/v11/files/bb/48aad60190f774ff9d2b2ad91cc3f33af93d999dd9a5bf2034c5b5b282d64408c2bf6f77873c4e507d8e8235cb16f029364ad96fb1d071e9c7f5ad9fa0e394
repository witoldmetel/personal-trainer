import type { Channel, CartesianChartMark, CartesianScaleBindings, ChartKey, ChartMark, ChartMarkMotionOptions, ChartMarkState, ChartTextStateStyle, ChartValue, MarkCallOptions, MarkChannelOutput, MarkScaleBindings, VisualChannel } from './types.js';
export type TextAnchor = 'start' | 'middle' | 'end';
export interface TextOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    x?: Channel<TDatum, ChartValue | null | undefined>;
    y?: Channel<TDatum, ChartValue | null | undefined>;
    text?: Channel<TDatum, string | number | null | undefined>;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    fill?: VisualChannel<TDatum, string>;
    fontSize?: number;
    fontWeight?: number;
    anchor?: VisualChannel<TDatum, TextAnchor>;
    rotate?: VisualChannel<TDatum, number>;
    dx?: VisualChannel<TDatum, number>;
    dy?: VisualChannel<TDatum, number>;
    states?: readonly ChartMarkState<TDatum, ChartTextStateStyle<TDatum>>[];
}
type TextCallOptions<TDatum, TXChannel, TYChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<TextOptions<NoInfer<TDatum>>, {
    x?: TXChannel;
    y?: TYChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
export declare function text<TDatum>(source: Iterable<TDatum>): ChartMark<TDatum, number, number>;
export declare function text<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: TextCallOptions<TDatum, TXChannel, TYChannel, TXScaleId, TYScaleId> | undefined): CartesianChartMark<TDatum, MarkChannelOutput<TDatum, TXChannel, number>, MarkChannelOutput<TDatum, TYChannel, number>, MarkChannelOutput<TDatum, TXChannel, number>, MarkChannelOutput<TDatum, TYChannel, number>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
