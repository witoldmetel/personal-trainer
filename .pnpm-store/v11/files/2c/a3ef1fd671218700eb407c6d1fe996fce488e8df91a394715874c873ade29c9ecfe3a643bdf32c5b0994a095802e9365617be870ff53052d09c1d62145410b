import type { TransformLineage } from './transform.js';
import type { Channel, ChannelOutput, CartesianChartMark, CartesianScaleBindings, ChartKey, ChartMarkMotionOptions, ChartValue, MarkCallOptions, MarkScaleBindings, VisualChannel } from './types.js';
export interface DensityContourDatum<TDatum> extends TransformLineage<TDatum> {
    /** Weighted observations per CSS pixel squared at this contour level. */
    readonly density: number;
    readonly group: ChartKey | null;
}
export interface DensityContourOptions<TDatum> extends ChartMarkMotionOptions<never>, CartesianScaleBindings {
    id?: string;
    x: Channel<TDatum, ChartValue | null | undefined>;
    y: Channel<TDatum, ChartValue | null | undefined>;
    /** Estimates a separate density field for each non-null group. */
    z?: Channel<TDatum, ChartKey | null | undefined>;
    weight?: Channel<TDatum, number | null | undefined>;
    /** Gaussian-kernel bandwidth in final CSS pixels. Defaults to 20. */
    bandwidth?: number;
    /** Density-grid cell size in final CSS pixels. Defaults to 4. */
    cellSize?: number;
    /** Exact density levels or an approximate shared level count. Defaults to 20. */
    thresholds?: number | Iterable<number>;
    color?: Channel<DensityContourDatum<TDatum>, ChartKey | null | undefined>;
    fill?: VisualChannel<DensityContourDatum<TDatum>, string>;
    fillOpacity?: number;
    stroke?: VisualChannel<DensityContourDatum<TDatum>, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
    opacity?: number;
}
type DensityContourCallOptions<TDatum, TXChannel, TYChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<DensityContourOptions<NoInfer<TDatum>>, {
    x: TXChannel;
    y: TYChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
/** Estimates filled density contours after x/y scales reach final screen space. */
export declare function densityContour<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: DensityContourCallOptions<TDatum, TXChannel, TYChannel, TXScaleId, TYScaleId>): CartesianChartMark<never, never, never, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
