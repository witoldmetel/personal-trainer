import type { Channel, CartesianChartMark, CartesianScaleBindings, ChartKey, ChartMark, ChartMarkMotionOptions, ChartMarkState, ChartAreaStateStyle, ChartValue, ChartCurve, MarkCallOptions, MarkChannelOutput, MarkScaleBindings, VisualChannel } from './types.js';
import type { StackLayout } from './stack.js';
export interface AreaYOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    x?: Channel<TDatum, ChartValue | null | undefined>;
    y?: Channel<TDatum, number | null | undefined>;
    y1?: number | Channel<TDatum, number | null | undefined>;
    y2?: number | Channel<TDatum, number | null | undefined>;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    fill?: VisualChannel<TDatum, string>;
    fillOpacity?: number;
    stroke?: VisualChannel<TDatum, string>;
    strokeWidth?: number;
    curve?: ChartCurve;
    layout?: StackLayout;
    states?: readonly ChartMarkState<TDatum, ChartAreaStateStyle<TDatum>>[];
}
type AreaYCallOptions<TDatum, TXChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<AreaYOptions<NoInfer<TDatum>>, {
    x?: TXChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
export declare function areaY<TDatum>(source: Iterable<TDatum>): ChartMark<TDatum, number, number>;
export declare function areaY<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: AreaYCallOptions<TDatum, TXChannel, TXScaleId, TYScaleId> | undefined): CartesianChartMark<TDatum, MarkChannelOutput<TDatum, TXChannel, number>, number, MarkChannelOutput<TDatum, TXChannel, number>, number, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
