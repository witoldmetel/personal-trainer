import type { Channel, CartesianChartMark, CartesianScaleBindings, ChartKey, ChartMarkMotionOptions, ChartMarkState, ChartRectStateStyle, ChartValue, MarkCallOptions, MarkChannelOutput, MarkScaleBindings, RectRadius, VisualChannel } from './types.js';
export interface RectOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    x?: Channel<TDatum, ChartValue | null | undefined>;
    x1?: Channel<TDatum, ChartValue | null | undefined>;
    x2?: Channel<TDatum, ChartValue | null | undefined>;
    y?: Channel<TDatum, ChartValue | null | undefined>;
    y1?: Channel<TDatum, ChartValue | null | undefined>;
    y2?: Channel<TDatum, ChartValue | null | undefined>;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number;
    inset?: number;
    radius?: VisualChannel<TDatum, RectRadius>;
    states?: readonly ChartMarkState<TDatum, ChartRectStateStyle<TDatum>>[];
}
export type CellOptions<TDatum> = Omit<RectOptions<TDatum>, 'x1' | 'x2' | 'y1' | 'y2'>;
type RectCallOptions<TDatum, TXChannel, TX1Channel, TX2Channel, TYChannel, TY1Channel, TY2Channel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<RectOptions<NoInfer<TDatum>>, {
    x?: TXChannel;
    x1?: TX1Channel;
    x2?: TX2Channel;
    y?: TYChannel;
    y1?: TY1Channel;
    y2?: TY2Channel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
type CellCallOptions<TDatum, TXChannel, TYChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<CellOptions<NoInfer<TDatum>>, {
    x?: TXChannel;
    y?: TYChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
type RectEndpointOutput<TDatum, TEndpointChannel, TCenterChannel> = [
    NonNullable<TEndpointChannel>
] extends [never] ? MarkChannelOutput<TDatum, TCenterChannel, number> : MarkChannelOutput<TDatum, TEndpointChannel, number>;
type RectPointYChannelOutput<TDatum, TYChannel, TY2Channel> = [
    NonNullable<TYChannel>
] extends [never] ? MarkChannelOutput<TDatum, TY2Channel, number> : MarkChannelOutput<TDatum, TYChannel, number>;
export declare function rect<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TX1Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TX2Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TY1Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TY2Channel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: RectCallOptions<TDatum, TXChannel, TX1Channel, TX2Channel, TYChannel, TY1Channel, TY2Channel, TXScaleId, TYScaleId>): CartesianChartMark<TDatum, MarkChannelOutput<TDatum, TXChannel, number>, RectPointYChannelOutput<TDatum, TYChannel, TY2Channel>, RectEndpointOutput<TDatum, TX1Channel, TXChannel> | RectEndpointOutput<TDatum, TX2Channel, TXChannel>, RectEndpointOutput<TDatum, TY1Channel, TYChannel> | RectEndpointOutput<TDatum, TY2Channel, TYChannel>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export declare function cell<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: CellCallOptions<TDatum, TXChannel, TYChannel, TXScaleId, TYScaleId>): CartesianChartMark<TDatum, MarkChannelOutput<TDatum, TXChannel, number>, MarkChannelOutput<TDatum, TYChannel, number>, MarkChannelOutput<TDatum, TXChannel, number>, MarkChannelOutput<TDatum, TYChannel, number>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
