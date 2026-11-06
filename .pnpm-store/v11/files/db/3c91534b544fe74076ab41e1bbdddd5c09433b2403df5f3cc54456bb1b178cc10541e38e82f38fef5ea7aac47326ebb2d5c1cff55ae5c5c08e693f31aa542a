import type { AreaXCurve } from './area-x.js';
import type { Channel, ChannelOutput, CartesianScaleBindings, ChartAreaStateStyle, ChartCurve, ChartKey, ChartMark, ChartMarkMotionOptions, ChartMarkState, VisualChannel } from './types.js';
export type ViolinPosition = number | Date;
export type ViolinYCurve = AreaXCurve;
export type ViolinXCurve = Pick<ChartCurve, 'area'>;
interface ViolinOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    /** Normalized half-envelope width in the inclusive range [0, 1]. */
    width: Channel<TDatum, number | null | undefined>;
    /** Full peak width in category-step units. Defaults to 0.8. */
    span?: number;
    key?: Channel<TDatum, ChartKey>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    fill?: VisualChannel<TDatum, string>;
    fillOpacity?: number;
    /** Set to null to omit the envelope outline. */
    stroke?: VisualChannel<TDatum, string> | null;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
    states?: readonly ChartMarkState<TDatum, ChartAreaStateStyle<TDatum>>[];
}
export interface ViolinYOptions<TDatum, TPosition extends ViolinPosition = ViolinPosition, TCategory extends ChartKey = ChartKey> extends ViolinOptions<TDatum> {
    x: Channel<TDatum, TCategory | null | undefined>;
    y: Channel<TDatum, TPosition | null | undefined>;
    curve?: ViolinYCurve;
}
export interface ViolinXOptions<TDatum, TPosition extends ViolinPosition = ViolinPosition, TCategory extends ChartKey = ChartKey> extends ViolinOptions<TDatum> {
    x: Channel<TDatum, TPosition | null | undefined>;
    y: Channel<TDatum, TCategory | null | undefined>;
    curve?: ViolinXCurve;
}
type PositionOutput<TDatum, TChannel> = Extract<ChannelOutput<TDatum, TChannel, number>, ViolinPosition>;
type CategoryOutput<TDatum, TChannel> = Extract<ChannelOutput<TDatum, TChannel, number>, ChartKey>;
type ViolinYCallOptions<TDatum, TXChannel extends Channel<NoInfer<TDatum>, ChartKey | null | undefined>, TYChannel extends Channel<NoInfer<TDatum>, ViolinPosition | null | undefined>> = Omit<ViolinYOptions<NoInfer<TDatum>, PositionOutput<TDatum, TYChannel>, CategoryOutput<TDatum, TXChannel>>, 'x' | 'y'> & {
    x: TXChannel;
    y: TYChannel;
};
type ViolinXCallOptions<TDatum, TXChannel extends Channel<NoInfer<TDatum>, ViolinPosition | null | undefined>, TYChannel extends Channel<NoInfer<TDatum>, ChartKey | null | undefined>> = Omit<ViolinXOptions<NoInfer<TDatum>, PositionOutput<TDatum, TXChannel>, CategoryOutput<TDatum, TYChannel>>, 'x' | 'y'> & {
    x: TXChannel;
    y: TYChannel;
};
/** Draws vertical mirrored profiles around categorical x baselines. */
export declare function violinY<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartKey | null | undefined>, const TYChannel extends Channel<NoInfer<TDatum>, ViolinPosition | null | undefined>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: ViolinYCallOptions<TDatum, TXChannel, TYChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<TDatum, CategoryOutput<TDatum, TXChannel>, PositionOutput<TDatum, TYChannel>, CategoryOutput<TDatum, TXChannel>, PositionOutput<TDatum, TYChannel>, TXScaleId, TYScaleId>;
/** Draws horizontal mirrored profiles around categorical y baselines. */
export declare function violinX<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ViolinPosition | null | undefined>, const TYChannel extends Channel<NoInfer<TDatum>, ChartKey | null | undefined>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: ViolinXCallOptions<TDatum, TXChannel, TYChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<TDatum, PositionOutput<TDatum, TXChannel>, CategoryOutput<TDatum, TYChannel>, PositionOutput<TDatum, TXChannel>, CategoryOutput<TDatum, TYChannel>, TXScaleId, TYScaleId>;
export {};
