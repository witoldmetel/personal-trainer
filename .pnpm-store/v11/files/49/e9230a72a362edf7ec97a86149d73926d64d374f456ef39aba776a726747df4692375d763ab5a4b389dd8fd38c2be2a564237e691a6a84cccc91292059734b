import type { DotLayout } from './dot-layout.js';
import type { Channel, CartesianChartMark, CartesianScaleBindings, ChartKey, ChartMark, ChartMarkMotionOptions, ChartMarkState, ChartDotStateStyle, ChartNumericScale, ChartValue, MarkCallOptions, MarkChannelOutput, MarkScaleBindings } from './types.js';
export interface DotOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    x?: Channel<TDatum, ChartValue | null | undefined>;
    y?: Channel<TDatum, ChartValue | null | undefined>;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    r?: number | Channel<TDatum, number | null | undefined>;
    rScale?: ChartNumericScale;
    fill?: string;
    fillOpacity?: number;
    layout?: DotLayout;
    stroke?: string;
    strokeOpacity?: number;
    strokeWidth?: number;
    states?: readonly ChartMarkState<TDatum, ChartDotStateStyle<TDatum>>[];
}
type DotCallOptions<TDatum, TXChannel, TYChannel, TLayout, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<DotOptions<NoInfer<TDatum>>, {
    x?: TXChannel;
    y?: TYChannel;
    layout?: TLayout;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
type DotPointX<TDatum, TXChannel, TLayout> = [NonNullable<TLayout>] extends [
    never
] ? MarkChannelOutput<TDatum, TXChannel, number> : NonNullable<TLayout> extends DotLayout<'x', infer TAnchor> ? TAnchor : MarkChannelOutput<TDatum, TXChannel, number>;
type DotPointY<TDatum, TYChannel, TLayout> = [NonNullable<TLayout>] extends [
    never
] ? MarkChannelOutput<TDatum, TYChannel, number> : NonNullable<TLayout> extends DotLayout<'y', infer TAnchor> ? TAnchor : MarkChannelOutput<TDatum, TYChannel, number>;
type DotScaleX<TDatum, TXChannel, TLayout> = [NonNullable<TLayout>] extends [
    never
] ? MarkChannelOutput<TDatum, TXChannel, number> : NonNullable<TLayout> extends DotLayout<'x'> ? never : MarkChannelOutput<TDatum, TXChannel, number>;
type DotScaleY<TDatum, TYChannel, TLayout> = [NonNullable<TLayout>] extends [
    never
] ? MarkChannelOutput<TDatum, TYChannel, number> : NonNullable<TLayout> extends DotLayout<'y'> ? never : MarkChannelOutput<TDatum, TYChannel, number>;
export declare function dot<TDatum>(source: Iterable<TDatum>): ChartMark<TDatum, number, number>;
export declare function dot<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TLayout extends DotLayout | undefined = never, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: DotCallOptions<TDatum, TXChannel, TYChannel, TLayout, TXScaleId, TYScaleId> | undefined): CartesianChartMark<TDatum, DotPointX<TDatum, TXChannel, TLayout>, DotPointY<TDatum, TYChannel, TLayout>, DotScaleX<TDatum, TXChannel, TLayout>, DotScaleY<TDatum, TYChannel, TLayout>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
