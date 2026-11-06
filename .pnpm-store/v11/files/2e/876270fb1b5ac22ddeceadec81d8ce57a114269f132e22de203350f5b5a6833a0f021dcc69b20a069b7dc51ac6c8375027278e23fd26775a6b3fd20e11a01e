import type { TransformGroupRow, TransformGroupSpec, TransformLineage, TransformOrderOptions, TransformValue } from './transform.js';
export type WaterfallKind = 'increase' | 'decrease' | 'total';
export interface WaterfallOptions<TDatum> extends TransformOrderOptions<TDatum> {
    value: TransformValue<TDatum, number | null | undefined>;
    by?: TransformGroupSpec<TDatum>;
    /** Appends a zero-based net-total row to each nonempty group. */
    total?: boolean;
}
type WaterfallDerivedField = keyof TransformLineage<unknown> | 'delta' | 'start' | 'end' | 'kind';
export type WaterfallStepDatum<TDatum extends object> = Omit<TDatum, WaterfallDerivedField> & TransformLineage<TDatum> & {
    readonly delta: number;
    readonly start: number;
    readonly end: number;
    readonly kind: 'increase' | 'decrease';
};
export type WaterfallTotalDatum<TDatum extends object, TBy extends TransformGroupSpec<TDatum> | undefined = undefined> = TransformGroupRow<TDatum, TBy> & TransformLineage<TDatum> & {
    readonly delta: number;
    readonly start: 0;
    readonly end: number;
    readonly kind: 'total';
};
export type WaterfallDatum<TDatum extends object, TBy extends TransformGroupSpec<TDatum> | undefined = undefined> = WaterfallStepDatum<TDatum> | WaterfallTotalDatum<TDatum, TBy>;
/** Materializes signed contributions as cumulative intervals. */
export declare function waterfall<TDatum extends object>(source: Iterable<TDatum>, options: Omit<WaterfallOptions<TDatum>, 'by'> & {
    by?: undefined;
}): WaterfallDatum<TDatum>[];
export declare function waterfall<TDatum extends object, const TBy extends TransformGroupSpec<TDatum>>(source: Iterable<TDatum>, options: Omit<WaterfallOptions<TDatum>, 'by'> & {
    by: TBy;
}): WaterfallDatum<TDatum, TBy>[];
export declare function waterfall<TDatum extends object>(source: Iterable<TDatum>, options: WaterfallOptions<TDatum>): WaterfallDatum<TDatum, TransformGroupSpec<TDatum> | undefined>[];
export {};
