import type { Channel, CartesianChartMark, CartesianScaleBindings, ChartCurve, ChartKey, ChartMark, ChartMarkMotionOptions, ChartMarkState, ChartLineStateStyle, ChartValue, MarkCallOptions, MarkChannelOutput, MarkScaleBindings, SceneStyle, VisualChannel } from './types.js';
interface LineOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
    lineCap?: SceneStyle['lineCap'];
    lineJoin?: SceneStyle['lineJoin'];
    points?: boolean;
    curve?: ChartCurve;
    states?: readonly ChartMarkState<TDatum, ChartLineStateStyle<TDatum>>[];
}
export interface LineYOptions<TDatum> extends LineOptions<TDatum> {
    x?: Channel<TDatum, ChartValue | null | undefined>;
    y?: Channel<TDatum, number | null | undefined>;
}
export interface LineXOptions<TDatum> extends LineOptions<TDatum> {
    x?: Channel<TDatum, number | null | undefined>;
    y?: Channel<TDatum, ChartValue | null | undefined>;
}
type LineYCallOptions<TDatum, TXChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<LineYOptions<NoInfer<TDatum>>, {
    x?: TXChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
type LineXCallOptions<TDatum, TYChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<LineXOptions<NoInfer<TDatum>>, {
    y?: TYChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
export declare function lineY<TDatum>(source: Iterable<TDatum>): ChartMark<TDatum, number, number>;
export declare function lineY<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: LineYCallOptions<TDatum, TXChannel, TXScaleId, TYScaleId> | undefined): CartesianChartMark<TDatum, MarkChannelOutput<TDatum, TXChannel, number>, number, MarkChannelOutput<TDatum, TXChannel, number>, number, MarkScaleBindings<TXScaleId, TYScaleId>>;
export declare function lineX<TDatum>(source: Iterable<TDatum>): ChartMark<TDatum, number, number>;
export declare function lineX<TDatum, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: LineXCallOptions<TDatum, TYChannel, TXScaleId, TYScaleId> | undefined): CartesianChartMark<TDatum, number, MarkChannelOutput<TDatum, TYChannel, number>, number, MarkChannelOutput<TDatum, TYChannel, number>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
