import type { Channel, ChartKey, ChartMark, ChartMarkMotionOptions, ChartMotionDefinition, ChartSpec, ChartSpecDatum, ChartValue, StaticChartDefinition } from './types.js';
export type FacetAxes = 'outer' | 'cell';
export interface FacetChartContext {
    key: ChartKey;
}
export interface FacetOptions<TDatum, TChildSpec extends ChartSpec = StaticChartDefinition<TDatum>> extends ChartMarkMotionOptions<ChartSpecDatum<TChildSpec>> {
    id?: string;
    by: Channel<TDatum, ChartKey>;
    chart: (data: readonly [TDatum, ...TDatum[]], context: FacetChartContext) => TChildSpec;
    columns?: number;
    minWidth?: number;
    gap?: number;
    label?: boolean | ((key: ChartKey) => string);
    axes?: FacetAxes;
}
type FacetChartInput<TDatum> = (data: readonly [TDatum, ...TDatum[]], context: FacetChartContext) => unknown;
type FacetOptionsInput<TDatum, TChart extends FacetChartInput<TDatum>> = Omit<FacetOptions<TDatum>, 'chart' | 'motion'> & {
    chart: TChart & ValidFacetChartFunction<NoInfer<TChart>>;
    motion?: ChartMotionDefinition<ChartSpecDatum<Extract<ReturnType<TChart>, ChartSpec>>>;
} & ([ReturnType<TChart>] extends [ChartSpec] ? unknown : never);
type InvalidFacetChartResult<TResult> = TResult extends unknown ? 'focusRing' extends keyof TResult ? StaticChartDefinition<any, any, any> extends TResult ? never : TResult : TResult extends {
    theme: infer TTheme;
} ? [TTheme] extends [never] ? never : 'focusRing' extends keyof TTheme ? TResult : never : never : never;
type ValidFacetChartFunction<TChart extends FacetChartInput<any>> = [
    InvalidFacetChartResult<ReturnType<TChart>>
] extends [never] ? unknown : never;
export declare function facet<TDatum, TChart extends FacetChartInput<NoInfer<TDatum>> = (data: readonly [TDatum, ...TDatum[]], context: FacetChartContext) => StaticChartDefinition<TDatum>>(source: Iterable<TDatum>, options: FacetOptionsInput<NoInfer<TDatum>, TChart>): ChartMark<ChartSpecDatum<Extract<ReturnType<TChart>, ChartSpec>>, ChartValue, ChartValue, never, never>;
export declare function facetChart<TDatum, TChart extends FacetChartInput<NoInfer<TDatum>> = (data: readonly [TDatum, ...TDatum[]], context: FacetChartContext) => StaticChartDefinition<TDatum>>(source: Iterable<TDatum>, options: FacetOptionsInput<NoInfer<TDatum>, TChart>): StaticChartDefinition<ChartSpecDatum<Extract<ReturnType<TChart>, ChartSpec>>, ChartValue, ChartValue, never>;
export {};
