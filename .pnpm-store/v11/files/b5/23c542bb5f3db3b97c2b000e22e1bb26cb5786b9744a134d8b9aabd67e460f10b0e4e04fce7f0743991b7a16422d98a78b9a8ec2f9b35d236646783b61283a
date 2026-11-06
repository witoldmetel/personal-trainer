import type { TransformLineage, TransformOrderOptions, TransformValue } from './transform.js';
export interface PieOptions<TDatum> extends TransformOrderOptions<TDatum> {
    readonly value: TransformValue<TDatum, number | null | undefined>;
    /** Overall start angle in radians. Defaults to 0 at 12 o'clock. */
    readonly startAngle?: number;
    /** Overall end angle in radians. Defaults to 2π. */
    readonly endAngle?: number;
    /** Radius-independent empty angle between visible slices. Defaults to 0. */
    readonly gapAngle?: number;
}
type PieDerivedField = keyof TransformLineage<unknown> | 'value' | 'index' | 'fraction' | 'startAngle' | 'endAngle' | 'angle' | 'padAngle';
export type PieDatum<TDatum extends object> = Omit<TDatum, PieDerivedField> & TransformLineage<TDatum> & {
    readonly value: number;
    /** Zero-based position in angular order. */
    readonly index: number;
    /** Fraction of the positive value total, or zero when the total is zero. */
    readonly fraction: number;
    /** Start of the visible slice in radians. */
    readonly startAngle: number;
    /** End of the visible slice in radians. */
    readonly endAngle: number;
    /** Midpoint of the visible slice in radians. */
    readonly angle: number;
    /** Gaps are materialized in the interval, so radialArc must not pad again. */
    readonly padAngle: 0;
};
/** Allocates nonnegative values into source-linked polar angle intervals. */
export declare function pie<TDatum extends object>(source: Iterable<TDatum>, options: PieOptions<NoInfer<TDatum>>): PieDatum<TDatum>[];
export {};
