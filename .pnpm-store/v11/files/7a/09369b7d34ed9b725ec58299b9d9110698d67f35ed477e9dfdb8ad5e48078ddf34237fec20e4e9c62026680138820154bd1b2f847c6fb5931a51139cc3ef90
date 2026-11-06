import type { TransformGroupSpec, TransformLineage, TransformOrderOptions } from './transform.js';
import type { TransformOutputRow, TransformOutputs } from './transform-reduce.js';
export type RollingWindowAnchor = 'start' | 'middle' | 'end';
export interface RollingWindowOptions<TDatum> extends TransformOrderOptions<TDatum> {
    by?: TransformGroupSpec<TDatum>;
    size: number;
    anchor?: RollingWindowAnchor;
    partial?: boolean;
    outputs: TransformOutputs<TDatum>;
}
interface InferredWindowOptions<TDatum, TBy extends TransformGroupSpec<TDatum> | undefined, TOutputs extends TransformOutputs<TDatum>> extends TransformOrderOptions<TDatum> {
    by?: TBy;
    size: number;
    anchor?: RollingWindowAnchor;
    partial?: boolean;
    outputs: TOutputs;
}
export type RollingWindowDatum<TDatum, TOutputs> = Omit<TDatum, keyof TOutputs | keyof TransformLineage<TDatum>> & TransformLineage<TDatum> & TransformOutputRow<TOutputs>;
export declare function rollingWindow<TDatum extends object, const TBy extends TransformGroupSpec<TDatum> | undefined = undefined, const TOutputs extends TransformOutputs<TDatum> = TransformOutputs<TDatum>>(source: Iterable<TDatum>, options: InferredWindowOptions<TDatum, TBy, TOutputs>): RollingWindowDatum<TDatum, TOutputs>[];
export {};
