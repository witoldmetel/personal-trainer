import type { Channel, CartesianChartMark, CartesianScaleBindings, ChartKey, ChartMark, ChartMarkMotionOptions, ChartNumericScale, ChartValue, MarkCallOptions, MarkChannelOutput, MarkScaleBindings, VisualChannel } from './types.js';
export interface HexagonOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    x?: Channel<TDatum, ChartValue | null | undefined>;
    y?: Channel<TDatum, ChartValue | null | undefined>;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    r?: number | Channel<TDatum, number | null | undefined>;
    rScale?: ChartNumericScale;
    fill?: VisualChannel<TDatum, string>;
    fillOpacity?: number;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
}
type HexagonCallOptions<TDatum, TXChannel, TYChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<HexagonOptions<TDatum>, {
    x?: TXChannel;
    y?: TYChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
/** Draws pointy-topped, fixed-pixel hexagons at scaled x/y positions. */
export declare function hexagon<TDatum>(source: Iterable<TDatum>): ChartMark<TDatum, number, number>;
export declare function hexagon<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: HexagonCallOptions<TDatum, TXChannel, TYChannel, TXScaleId, TYScaleId> | undefined): CartesianChartMark<TDatum, MarkChannelOutput<TDatum, TXChannel, number>, MarkChannelOutput<TDatum, TYChannel, number>, MarkChannelOutput<TDatum, TXChannel, number>, MarkChannelOutput<TDatum, TYChannel, number>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
