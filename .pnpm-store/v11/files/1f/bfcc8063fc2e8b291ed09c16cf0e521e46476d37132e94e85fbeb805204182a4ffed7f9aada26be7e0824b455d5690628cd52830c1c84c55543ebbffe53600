import type { ChartValue, ResolvedScale } from './types.js';
export interface LayoutSourceRow<TDatum> {
    readonly datum: TDatum;
    readonly sourceIndex: number;
}
export interface LayoutXYSourceRow<TDatum, TXValue extends ChartValue, TYValue extends ChartValue> extends LayoutSourceRow<TDatum> {
    readonly xValue: TXValue;
    readonly yValue: TYValue;
}
export interface ResolvedLayoutX<TValue extends ChartValue> {
    readonly xValue: TValue;
    readonly x: number;
}
export interface ResolvedLayoutY<TValue extends ChartValue> {
    readonly yValue: TValue;
    readonly y: number;
}
/** Materializes only complete positional pairs so one invalid axis cannot domain the other. */
export declare function materializeLayoutXYRows<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(data: readonly TDatum[], xValues: readonly (TXValue | null | undefined)[], yValues: readonly (TYValue | null | undefined)[]): readonly LayoutXYSourceRow<TDatum, TXValue, TYValue>[];
export declare function projectLayoutX<TRow extends LayoutSourceRow<unknown>, TValue extends ChartValue>(rows: readonly TRow[], values: readonly (TValue | null | undefined)[], scale: ResolvedScale): readonly (TRow & ResolvedLayoutX<TValue>)[];
export declare function projectLayoutY<TRow extends LayoutSourceRow<unknown>, TValue extends ChartValue>(rows: readonly TRow[], values: readonly (TValue | null | undefined)[], scale: ResolvedScale): readonly (TRow & ResolvedLayoutY<TValue>)[];
