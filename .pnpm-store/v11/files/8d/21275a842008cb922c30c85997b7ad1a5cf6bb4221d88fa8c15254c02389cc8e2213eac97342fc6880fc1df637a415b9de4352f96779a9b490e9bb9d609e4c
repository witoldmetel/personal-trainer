import type { Channel, ChartKey, ChartMark, ChartMarkMotionOptions, ChartMarkState, ChartRectStateStyle, VisualChannel } from './types.js';
export interface WaffleOptions<TDatum> extends ChartMarkMotionOptions<TDatum> {
    id?: string;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    /** Semantic value represented by one complete cell. Defaults to 1. */
    unit?: number;
    /** Rounds cumulative unit boundaries before allocating cells. */
    round?: boolean;
    /** Empty pixels between complete cells. Defaults to 1. */
    gap?: number;
    radius?: number;
    fill?: VisualChannel<TDatum, string>;
    fillOpacity?: number;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    states?: readonly ChartMarkState<TDatum, ChartRectStateStyle<TDatum>>[];
}
export interface WaffleYOptions<TDatum> extends WaffleOptions<TDatum> {
    y: Channel<TDatum, number | null | undefined>;
    /** Fixed cells per row. By default packing follows the final plot bounds. */
    columns?: number;
}
export interface WaffleXOptions<TDatum> extends WaffleOptions<TDatum> {
    x: Channel<TDatum, number | null | undefined>;
    /** Fixed cells per column. By default packing follows the final plot bounds. */
    rows?: number;
}
/** Packs cumulative values left-to-right and then bottom-to-top. */
export declare function waffleY<TDatum>(source: Iterable<TDatum>, options: WaffleYOptions<NoInfer<TDatum>>): ChartMark<TDatum, ChartKey, number, never, never>;
/** Packs cumulative values bottom-to-top and then left-to-right. */
export declare function waffleX<TDatum>(source: Iterable<TDatum>, options: WaffleXOptions<NoInfer<TDatum>>): ChartMark<TDatum, number, ChartKey, never, never>;
