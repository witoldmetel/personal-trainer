import type { TransformLineage } from './transform.js';
import type { Channel, ChartKey, ChartMark, ChartMarkMotionOptions, VisualChannel } from './types.js';
export interface ContourDatum<TDatum> extends TransformLineage<TDatum> {
    /** Scalar threshold represented by this level set. */
    readonly value: number;
}
export interface ContourOptions<TDatum> extends ChartMarkMotionOptions<never> {
    id?: string;
    /** Number of row-major grid columns. */
    width: number;
    /** Number of row-major grid rows. */
    height: number;
    /** Scalar grid value. Numeric source data defaults to identity. */
    value?: Channel<TDatum, number | null | undefined>;
    /** Exact levels or an approximate level count. Defaults to Sturges. */
    thresholds?: number | Iterable<number>;
    /** Linear marching-squares interpolation. Defaults to true. */
    smooth?: boolean;
    color?: Channel<ContourDatum<TDatum>, ChartKey | null | undefined>;
    fill?: VisualChannel<ContourDatum<TDatum>, string>;
    fillOpacity?: number;
    stroke?: VisualChannel<ContourDatum<TDatum>, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
    opacity?: number;
}
/** Generates scalar-grid contours and projects them into final plot bounds. */
export declare function contour<TDatum>(source: Iterable<TDatum>, options: ContourOptions<NoInfer<TDatum>>): ChartMark<never, never, never>;
