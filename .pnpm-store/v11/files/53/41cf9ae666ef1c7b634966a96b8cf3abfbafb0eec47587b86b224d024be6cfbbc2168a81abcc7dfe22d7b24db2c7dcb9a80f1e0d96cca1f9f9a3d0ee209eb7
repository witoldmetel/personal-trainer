import type { TransformLineage, TransformValue, TransformValueOutput } from './transform.js';
import type { ChartValue } from './types.js';
export interface MosaicOptions<TDatum, TX extends TransformValue<TDatum, ChartValue> = TransformValue<TDatum, ChartValue>, TY extends TransformValue<TDatum, ChartValue> = TransformValue<TDatum, ChartValue>, TValue extends TransformValue<TDatum, number | null | undefined> = TransformValue<TDatum, number | null | undefined>> {
    /** Categorical horizontal channel. */
    readonly x: TX;
    /** Categorical vertical channel. */
    readonly y: TY;
    /** Nonnegative aggregate represented by this x/y pair. */
    readonly value: TValue;
    /** Horizontal category order. Unobserved categories do not create rows. */
    readonly xOrder?: readonly ChartValue[];
    /** Vertical category order. Unobserved categories do not create rows. */
    readonly yOrder?: readonly ChartValue[];
}
type MosaicDerivedField = keyof TransformLineage<unknown> | 'xValue' | 'yValue' | 'value' | 'total' | 'x' | 'x1' | 'x2' | 'y' | 'y1' | 'y2';
type MosaicDatumBase<TDatum extends object, TXValue extends ChartValue, TYValue extends ChartValue, TOuterTotal extends 'xTotal' | 'yTotal'> = Omit<TDatum, MosaicDerivedField | TOuterTotal> & TransformLineage<TDatum> & {
    readonly xValue: TXValue;
    readonly yValue: TYValue;
    readonly value: number;
    readonly total: number;
    readonly x: number;
    readonly x1: number;
    readonly x2: number;
    readonly y: number;
    readonly y1: number;
    readonly y2: number;
};
export type MosaicYDatum<TDatum extends object, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> = MosaicDatumBase<TDatum, TXValue, TYValue, 'xTotal'> & {
    /** Sum of values in this cell's horizontal category. */
    readonly xTotal: number;
};
export type MosaicXDatum<TDatum extends object, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> = MosaicDatumBase<TDatum, TXValue, TYValue, 'yTotal'> & {
    /** Sum of values in this cell's vertical category. */
    readonly yTotal: number;
};
/**
 * Allocates horizontal category totals into widths, then normalizes vertical
 * categories independently within each horizontal category.
 */
export declare function mosaicY<TDatum extends object, const TX extends TransformValue<TDatum, ChartValue>, const TY extends TransformValue<TDatum, ChartValue>, const TValue extends TransformValue<TDatum, number | null | undefined>>(source: Iterable<TDatum>, options: MosaicOptions<TDatum, TX, TY, TValue>): MosaicYDatum<TDatum, Extract<TransformValueOutput<TDatum, TX>, ChartValue>, Extract<TransformValueOutput<TDatum, TY>, ChartValue>>[];
/**
 * Allocates vertical category totals into heights, then normalizes horizontal
 * categories independently within each vertical category.
 */
export declare function mosaicX<TDatum extends object, const TX extends TransformValue<TDatum, ChartValue>, const TY extends TransformValue<TDatum, ChartValue>, const TValue extends TransformValue<TDatum, number | null | undefined>>(source: Iterable<TDatum>, options: MosaicOptions<TDatum, TX, TY, TValue>): MosaicXDatum<TDatum, Extract<TransformValueOutput<TDatum, TX>, ChartValue>, Extract<TransformValueOutput<TDatum, TY>, ChartValue>>[];
export {};
