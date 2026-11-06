import type { HexagonOptions } from './hexagon.js';
import type { TransformLineage, TransformValue } from './transform.js';
import type { TransformOutputRow, TransformOutputs } from './transform-reduce.js';
import type { ChartMark } from './types.js';
type DefaultHexbinOutputs = {
    readonly count: {
        readonly reduce: 'count';
    };
};
export type HexbinDatum<TDatum, TOutputs extends TransformOutputs<TDatum> = DefaultHexbinOutputs> = TransformLineage<TDatum> & Omit<TransformOutputRow<TOutputs>, 'x' | 'y' | 'source' | 'sourceIndexes'> & {
    readonly x: number;
    readonly y: number;
};
export type HexbinOptions<TDatum, TOutputs extends TransformOutputs<TDatum> = DefaultHexbinOutputs> = {
    x: TransformValue<TDatum, number | null | undefined>;
    y: TransformValue<TDatum, number | null | undefined>;
    /** Horizontal distance in pixels between adjacent bin centers. */
    binWidth?: number;
    outputs?: TOutputs;
} & Omit<HexagonOptions<HexbinDatum<TDatum, TOutputs>>, 'x' | 'y' | 'key'>;
/** Aggregates numeric x/y observations in a final-screen hexagonal lattice. */
export declare function hexbin<TDatum, const TOutputs extends TransformOutputs<TDatum> = DefaultHexbinOutputs, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: HexbinOptions<TDatum, TOutputs> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<HexbinDatum<TDatum, TOutputs>, number, number, number, number, TXScaleId, TYScaleId>;
export {};
