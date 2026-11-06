import type { TransformLineage, TransformValue, TransformValueOutput } from './transform.js';
import type { Channel, ChannelOutput, CartesianScaleBindings, ChartKey, ChartMark, ChartMarkMotionOptions, ChartMotionDefinition } from './types.js';
type RegressionIndependentValue = number | Date;
interface LinearRegressionOptions<TDatum, TRegressionDatum> extends ChartMarkMotionOptions<TRegressionDatum>, CartesianScaleBindings {
    id?: string;
    /** Fits one independent regression for each series value. */
    z?: Channel<TDatum, ChartKey | null | undefined>;
    /** Confidence level for the fitted mean. Defaults to 0.95; use 0 to hide. */
    ci?: number;
    /** Number of semantic independent-domain samples. Defaults to 64. */
    samples?: number;
    stroke?: string;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
    /** Defaults to the line stroke. */
    fill?: string;
    fillOpacity?: number;
}
export interface LinearRegressionYDatum<TDatum, TXValue extends RegressionIndependentValue = RegressionIndependentValue, TGroup extends ChartKey | null = ChartKey | null> extends TransformLineage<TDatum> {
    readonly x: TXValue;
    readonly y: number;
    readonly y1?: number;
    readonly y2?: number;
    readonly group: TGroup;
}
export interface LinearRegressionXDatum<TDatum, TYValue extends RegressionIndependentValue = RegressionIndependentValue, TGroup extends ChartKey | null = ChartKey | null> extends TransformLineage<TDatum> {
    readonly x: number;
    readonly x1?: number;
    readonly x2?: number;
    readonly y: TYValue;
    readonly group: TGroup;
}
export interface LinearRegressionRowsYOptions<TDatum, TX extends TransformValue<TDatum, RegressionIndependentValue | null | undefined> = TransformValue<TDatum, RegressionIndependentValue | null | undefined>, TY extends TransformValue<TDatum, number | null | undefined> = TransformValue<TDatum, number | null | undefined>, TZ extends TransformValue<TDatum, ChartKey | null | undefined> | undefined = TransformValue<TDatum, ChartKey | null | undefined> | undefined> {
    readonly x: TX;
    readonly y: TY;
    /** Fits one independent regression for each valid series value. */
    readonly z?: TZ;
    /** Confidence level for the fitted mean. Defaults to 0.95; use 0 to omit. */
    readonly ci?: number;
    /** Number of semantic x-domain samples. Defaults to 64. */
    readonly samples?: number;
}
export interface LinearRegressionRowsXOptions<TDatum, TX extends TransformValue<TDatum, number | null | undefined> = TransformValue<TDatum, number | null | undefined>, TY extends TransformValue<TDatum, RegressionIndependentValue | null | undefined> = TransformValue<TDatum, RegressionIndependentValue | null | undefined>, TZ extends TransformValue<TDatum, ChartKey | null | undefined> | undefined = TransformValue<TDatum, ChartKey | null | undefined> | undefined> {
    readonly x: TX;
    readonly y: TY;
    /** Fits one independent regression for each valid series value. */
    readonly z?: TZ;
    /** Confidence level for the fitted mean. Defaults to 0.95; use 0 to omit. */
    readonly ci?: number;
    /** Number of semantic y-domain samples. Defaults to 64. */
    readonly samples?: number;
}
export interface LinearRegressionYOptions<TDatum> extends LinearRegressionOptions<TDatum, LinearRegressionYDatum<TDatum>> {
    x: Channel<TDatum, RegressionIndependentValue | null | undefined>;
    y: Channel<TDatum, number | null | undefined>;
}
export interface LinearRegressionXOptions<TDatum> extends LinearRegressionOptions<TDatum, LinearRegressionXDatum<TDatum>> {
    x: Channel<TDatum, number | null | undefined>;
    y: Channel<TDatum, RegressionIndependentValue | null | undefined>;
}
type IndependentOutput<TDatum, TChannel> = Extract<ChannelOutput<TDatum, TChannel, number>, RegressionIndependentValue>;
type NormalizedRegressionGroup<TValue> = Extract<TValue, ChartKey> | ([Extract<TValue, null | undefined>] extends [never] ? never : null);
type RegressionGroupOutput<TDatum, TZ> = TZ extends TransformValue<TDatum, ChartKey | null | undefined> ? NormalizedRegressionGroup<TransformValueOutput<TDatum, TZ>> : null;
type LinearRegressionYCallOptions<TDatum, TXChannel extends Channel<NoInfer<TDatum>, RegressionIndependentValue | null | undefined>> = Omit<LinearRegressionYOptions<NoInfer<TDatum>>, 'motion' | 'x'> & {
    x: TXChannel;
    motion?: ChartMotionDefinition<LinearRegressionYDatum<TDatum, IndependentOutput<TDatum, TXChannel>>>;
};
type LinearRegressionXCallOptions<TDatum, TYChannel extends Channel<NoInfer<TDatum>, RegressionIndependentValue | null | undefined>> = Omit<LinearRegressionXOptions<NoInfer<TDatum>>, 'motion' | 'y'> & {
    y: TYChannel;
    motion?: ChartMotionDefinition<LinearRegressionXDatum<TDatum, IndependentOutput<TDatum, TYChannel>>>;
};
/** Fits and samples least-squares y rows with direct source lineage. */
export declare function linearRegressionRowsY<TDatum, const TX extends TransformValue<TDatum, RegressionIndependentValue | null | undefined>, const TY extends TransformValue<TDatum, number | null | undefined>, const TZ extends TransformValue<TDatum, ChartKey | null | undefined> | undefined = undefined>(source: Iterable<TDatum>, options: LinearRegressionRowsYOptions<TDatum, TX, TY, TZ>): LinearRegressionYDatum<TDatum, Extract<TransformValueOutput<TDatum, TX>, RegressionIndependentValue>, RegressionGroupOutput<TDatum, TZ>>[];
/** Fits and samples least-squares x rows with direct source lineage. */
export declare function linearRegressionRowsX<TDatum, const TX extends TransformValue<TDatum, number | null | undefined>, const TY extends TransformValue<TDatum, RegressionIndependentValue | null | undefined>, const TZ extends TransformValue<TDatum, ChartKey | null | undefined> | undefined = undefined>(source: Iterable<TDatum>, options: LinearRegressionRowsXOptions<TDatum, TX, TY, TZ>): LinearRegressionXDatum<TDatum, Extract<TransformValueOutput<TDatum, TY>, RegressionIndependentValue>, RegressionGroupOutput<TDatum, TZ>>[];
/** Fits least-squares y-values from raw observations. */
export declare function linearRegressionY<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, RegressionIndependentValue | null | undefined>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: LinearRegressionYCallOptions<TDatum, TXChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<LinearRegressionYDatum<TDatum, IndependentOutput<TDatum, TXChannel>>, IndependentOutput<TDatum, TXChannel>, number, IndependentOutput<TDatum, TXChannel>, number, TXScaleId, TYScaleId>;
/** Fits least-squares x-values from raw observations. */
export declare function linearRegressionX<TDatum, const TYChannel extends Channel<NoInfer<TDatum>, RegressionIndependentValue | null | undefined>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: LinearRegressionXCallOptions<TDatum, TYChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<LinearRegressionXDatum<TDatum, IndependentOutput<TDatum, TYChannel>>, number, IndependentOutput<TDatum, TYChannel>, number, IndependentOutput<TDatum, TYChannel>, TXScaleId, TYScaleId>;
export {};
