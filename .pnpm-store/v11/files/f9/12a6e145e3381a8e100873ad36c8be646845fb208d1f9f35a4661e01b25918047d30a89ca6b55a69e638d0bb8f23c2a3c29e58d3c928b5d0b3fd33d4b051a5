import type { TransformLineage, TransformValue, TransformValueOutput } from './transform.js';
import type { Channel, CartesianScaleBindings, ChartKey, ChartMark, ChartMotionDefinition, ChartMarkMotionOptions, ChartValue, OptionChannelOutput } from './types.js';
export interface BoxSummaryDatum<TDatum, TCategory extends ChartValue = ChartValue> extends TransformLineage<TDatum> {
    readonly kind: 'summary';
    readonly category: TCategory;
    readonly q1: number;
    readonly median: number;
    readonly q3: number;
    readonly whiskerLow: number;
    readonly whiskerHigh: number;
    readonly count: number;
}
export interface BoxOutlierDatum<TDatum, TCategory extends ChartValue = ChartValue> extends TransformLineage<TDatum> {
    readonly kind: 'outlier';
    readonly category: TCategory;
    readonly value: number;
    readonly source: readonly [TDatum];
    readonly sourceIndexes: readonly [number];
}
export type BoxDatum<TDatum, TCategory extends ChartValue = ChartValue> = BoxSummaryDatum<TDatum, TCategory> | BoxOutlierDatum<TDatum, TCategory>;
export interface BoxRowsOptions<TDatum, TCategory extends TransformValue<TDatum, ChartValue | null | undefined> = TransformValue<TDatum, ChartValue | null | undefined>, TValue extends TransformValue<TDatum, number | null | undefined> = TransformValue<TDatum, number | null | undefined>> {
    /** Categorical group represented by one summary row. */
    readonly category: TCategory;
    /** Numeric observation summarized within its category. */
    readonly value: TValue;
}
interface BoxOptions<TDatum, TCategory extends ChartValue = ChartValue> extends ChartMarkMotionOptions<BoxDatum<TDatum, TCategory>> {
    id?: string;
    key?: Channel<TDatum, ChartKey>;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeOpacity?: number;
    /** Applied to the whisker, median, and outlier marks. */
    strokeWidth?: number;
    /** Pixels removed from both categorical edges of the box and median. */
    inset?: number;
    /** Outlier radius in pixels. Defaults to 3. */
    r?: number;
    xScale?: CartesianScaleBindings['xScale'];
    yScale?: CartesianScaleBindings['yScale'];
}
export interface BoxYOptions<TDatum, TCategory extends ChartValue = ChartValue> extends BoxOptions<TDatum, TCategory> {
    x: Channel<TDatum, TCategory | null | undefined>;
    y: Channel<TDatum, number | null | undefined>;
}
export interface BoxXOptions<TDatum, TCategory extends ChartValue = ChartValue> extends BoxOptions<TDatum, TCategory> {
    x: Channel<TDatum, number | null | undefined>;
    y: Channel<TDatum, TCategory | null | undefined>;
}
export type BoxYDatum<TDatum, TOptions> = BoxDatum<TDatum, OptionChannelOutput<TDatum, TOptions, 'x', number>>;
export type BoxXDatum<TDatum, TOptions> = BoxDatum<TDatum, OptionChannelOutput<TDatum, TOptions, 'y', number>>;
type BoxYCallOptions<TDatum, TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>> = Omit<BoxYOptions<NoInfer<TDatum>>, 'motion' | 'x'> & {
    x: TXChannel;
    motion?: ChartMotionDefinition<BoxYDatum<TDatum, {
        x: TXChannel;
    }>>;
};
type BoxXCallOptions<TDatum, TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>> = Omit<BoxXOptions<NoInfer<TDatum>>, 'motion' | 'y'> & {
    y: TYChannel;
    motion?: ChartMotionDefinition<BoxXDatum<TDatum, {
        y: TYChannel;
    }>>;
};
/** Produces Tukey summary and outlier rows with direct source lineage. */
export declare function boxRows<TDatum, const TCategory extends TransformValue<TDatum, ChartValue | null | undefined>, const TValue extends TransformValue<TDatum, number | null | undefined>>(source: Iterable<TDatum>, options: BoxRowsOptions<TDatum, TCategory, TValue>): BoxDatum<TDatum, Extract<TransformValueOutput<TDatum, TCategory>, ChartValue>>[];
/** Summarizes raw observations into vertical Tukey boxplots. */
export declare function boxY<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: BoxYCallOptions<TDatum, TXChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<BoxYDatum<TDatum, {
    x: TXChannel;
}>, OptionChannelOutput<TDatum, {
    x: TXChannel;
}, 'x', number>, number, OptionChannelOutput<TDatum, {
    x: TXChannel;
}, 'x', number>, number, TXScaleId, TYScaleId>;
/** Summarizes raw observations into horizontal Tukey boxplots. */
export declare function boxX<TDatum, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: BoxXCallOptions<TDatum, TYChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<BoxXDatum<TDatum, {
    y: TYChannel;
}>, number, OptionChannelOutput<TDatum, {
    y: TYChannel;
}, 'y', number>, number, OptionChannelOutput<TDatum, {
    y: TYChannel;
}, 'y', number>, TXScaleId, TYScaleId>;
export {};
