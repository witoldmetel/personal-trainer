import type { Channel, ChannelOutput, CartesianScaleBindings, ChartCurve, ChartKey, ChartMark, ChartMarkMotionOptions, ChartMarkState, ChartMarkStateStyle, VisualChannel } from './types.js';
export type RidgelinePosition = number | Date;
export type RidgelineCurve = Pick<ChartCurve, 'line'>;
export type RidgelineStateStyle<TDatum = unknown> = Pick<ChartMarkStateStyle<TDatum>, 'fillOpacity' | 'strokeOpacity' | 'opacity'>;
interface RidgelineOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    /** Normalized profile height in the inclusive range [0, 1]. */
    height: Channel<TDatum, number | null | undefined>;
    /** Peak height in category-step units. Defaults to 1. */
    overlap?: number;
    key?: Channel<TDatum, ChartKey>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    fill?: VisualChannel<TDatum, string>;
    fillOpacity?: number;
    /** Set to null to omit the profile outline. */
    stroke?: VisualChannel<TDatum, string> | null;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
    curve?: RidgelineCurve;
    states?: readonly ChartMarkState<TDatum, RidgelineStateStyle<TDatum>>[];
}
export interface RidgelineYOptions<TDatum, TPosition extends RidgelinePosition = RidgelinePosition, TCategory extends ChartKey = ChartKey> extends RidgelineOptions<TDatum> {
    x: Channel<TDatum, TPosition | null | undefined>;
    y: Channel<TDatum, TCategory | null | undefined>;
}
export interface RidgelineXOptions<TDatum, TPosition extends RidgelinePosition = RidgelinePosition, TCategory extends ChartKey = ChartKey> extends RidgelineOptions<TDatum> {
    x: Channel<TDatum, TCategory | null | undefined>;
    y: Channel<TDatum, TPosition | null | undefined>;
}
type PositionOutput<TDatum, TChannel> = Extract<ChannelOutput<TDatum, TChannel, number>, RidgelinePosition>;
type CategoryOutput<TDatum, TChannel> = Extract<ChannelOutput<TDatum, TChannel, number>, ChartKey>;
type RidgelineYCallOptions<TDatum, TXChannel extends Channel<NoInfer<TDatum>, RidgelinePosition | null | undefined>, TYChannel extends Channel<NoInfer<TDatum>, ChartKey | null | undefined>> = Omit<RidgelineYOptions<NoInfer<TDatum>, PositionOutput<TDatum, TXChannel>, CategoryOutput<TDatum, TYChannel>>, 'x' | 'y'> & {
    x: TXChannel;
    y: TYChannel;
};
type RidgelineXCallOptions<TDatum, TXChannel extends Channel<NoInfer<TDatum>, ChartKey | null | undefined>, TYChannel extends Channel<NoInfer<TDatum>, RidgelinePosition | null | undefined>> = Omit<RidgelineXOptions<NoInfer<TDatum>, PositionOutput<TDatum, TYChannel>, CategoryOutput<TDatum, TXChannel>>, 'x' | 'y'> & {
    x: TXChannel;
    y: TYChannel;
};
/** Draws horizontal profiles rising from categorical y baselines. */
export declare function ridgelineY<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, RidgelinePosition | null | undefined>, const TYChannel extends Channel<NoInfer<TDatum>, ChartKey | null | undefined>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: RidgelineYCallOptions<TDatum, TXChannel, TYChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<TDatum, PositionOutput<TDatum, TXChannel>, CategoryOutput<TDatum, TYChannel>, PositionOutput<TDatum, TXChannel>, CategoryOutput<TDatum, TYChannel>, TXScaleId, TYScaleId>;
/** Draws vertical profiles extending from categorical x baselines. */
export declare function ridgelineX<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartKey | null | undefined>, const TYChannel extends Channel<NoInfer<TDatum>, RidgelinePosition | null | undefined>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: RidgelineXCallOptions<TDatum, TXChannel, TYChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<TDatum, CategoryOutput<TDatum, TXChannel>, PositionOutput<TDatum, TYChannel>, CategoryOutput<TDatum, TXChannel>, PositionOutput<TDatum, TYChannel>, TXScaleId, TYScaleId>;
export {};
