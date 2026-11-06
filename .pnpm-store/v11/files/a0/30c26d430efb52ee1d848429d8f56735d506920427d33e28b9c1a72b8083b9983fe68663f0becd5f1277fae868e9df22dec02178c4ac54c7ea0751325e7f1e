import type { ResponsiveChartDefinition, ChartBuildContext, CheckedChartSpec, ChartDefinitionOptions, ChartDefinition, ResponsiveChartConfig, ChartLayoutOptions, ChartMark, ChartMarkDatum, ChartMarkPointX, ChartMarkPointY, ChartPoint, ChartPositionScaleOptions, ChartScene, ChartSize, ChartSpec, ChartSpecDatum, ChartSpecXValue, ChartSpecYValue, StaticChartDefinition, ChartTheme, ChartValue } from './types.js';
export declare const defaultChartTheme: ChartTheme;
type DefinedStaticChart<TMarks extends readonly ChartMark<any, any, any, any, any, any, any>[], TSpec extends ChartSpec<TMarks>> = Omit<StaticChartDefinition<ChartMarkDatum<TMarks[number]>, ChartMarkPointX<TMarks[number]>, ChartMarkPointY<TMarks[number]>>, keyof ChartDefinitionOptions | keyof ChartSpec> & Omit<TSpec, keyof ChartDefinitionOptions> & Pick<StaticChartDefinition<ChartMarkDatum<TMarks[number]>, ChartMarkPointX<TMarks[number]>, ChartMarkPointY<TMarks[number]>>, Exclude<Extract<keyof TSpec, keyof ChartDefinitionOptions>, 'tooltip'>> & Pick<TSpec, Extract<keyof TSpec, 'tooltip'>>;
type ErasedChartMarks = readonly ChartMark<any, any, any, any, any, any, any>[];
type ErasedChartSpec = {
    marks: ErasedChartMarks;
    scales: Readonly<Record<string, ChartPositionScaleOptions | null>>;
};
type ChartDefinitionDatum<TDefinition> = TDefinition extends ChartDefinition<infer TDatum, any, any> ? TDatum : never;
type ChartDefinitionXValue<TDefinition> = TDefinition extends ChartDefinition<any, infer TXValue, any> ? TXValue : never;
type ChartDefinitionYValue<TDefinition> = TDefinition extends ChartDefinition<any, any, infer TYValue> ? TYValue : never;
type ChartDefinitionWithOptions<TDefinition, TOptions> = Omit<TDefinition, keyof TOptions> & TOptions;
declare const definedResponsiveChart: unique symbol;
type DefinedResponsiveChart<TSpec extends ErasedChartSpec> = Omit<ResponsiveChartDefinition<ChartSpecDatum<TSpec>, ChartSpecXValue<TSpec>, ChartSpecYValue<TSpec>>, keyof ChartDefinitionOptions | 'chart'> & {
    readonly [definedResponsiveChart]: TSpec;
    chart: (context: ChartBuildContext) => TSpec;
};
type ValidResponsiveDefinitionInput<TDefinition extends ResponsiveChartDefinition<any, any, any>> = ErasedChartSpec extends ReturnType<TDefinition['chart']> ? unknown : typeof definedResponsiveChart extends keyof TDefinition ? unknown : never;
export declare function defineChart<const TMarks extends readonly ChartMark<any, any, any, any, any, any, any>[], const TSpec extends ChartSpec<TMarks>>(spec: TSpec & {
    marks: TMarks;
} & ChartDefinitionOptions<ChartMarkDatum<TMarks[number]>, ChartMarkPointX<TMarks[number]>, ChartMarkPointY<TMarks[number]>>): DefinedStaticChart<TMarks, TSpec>;
export declare function defineChart<const TSpec extends ErasedChartSpec, TTooltipHost extends string, const TConfig extends ResponsiveChartConfig<TSpec, TTooltipHost>>(config: ResponsiveChartConfig<TSpec, TTooltipHost> & TConfig): DefinedResponsiveChart<ReturnType<TConfig['chart']>> & Omit<TConfig, 'chart'>;
export declare function defineChart<const TSpec extends ErasedChartSpec>(chart: (context: ChartBuildContext) => CheckedChartSpec<TSpec>): DefinedResponsiveChart<TSpec>;
export declare function defineChart<const TMarks extends readonly ChartMark<any, any, any, any, any, any, any>[], const TSpec extends ChartSpec<TMarks>, const TOptions extends ChartDefinitionOptions<ChartMarkDatum<TMarks[number]>, ChartMarkPointX<TMarks[number]>, ChartMarkPointY<TMarks[number]>>>(spec: TSpec & {
    marks: TMarks;
} & ChartDefinitionOptions<ChartMarkDatum<TMarks[number]>, ChartMarkPointX<TMarks[number]>, ChartMarkPointY<TMarks[number]>>, options: TOptions): ChartDefinitionWithOptions<DefinedStaticChart<TMarks, TSpec>, TOptions>;
export declare function defineChart<const TSpec extends ErasedChartSpec, const TOptions extends ChartDefinitionOptions<ChartSpecDatum<TSpec>, ChartSpecXValue<TSpec>, ChartSpecYValue<TSpec>>>(chart: (context: ChartBuildContext) => CheckedChartSpec<TSpec>, options: TOptions): ChartDefinitionWithOptions<DefinedResponsiveChart<TSpec>, TOptions>;
export declare function defineChart<const TMarks extends readonly ChartMark<any, any, any, any, any, any, any>[], const TSpec extends ChartSpec<TMarks>, const TOptions extends ChartDefinitionOptions<ChartMarkDatum<TMarks[number]>, ChartMarkPointX<TMarks[number]>, ChartMarkPointY<TMarks[number]>>>(config: {
    chart: (context: ChartBuildContext) => TSpec & {
        marks: TMarks;
    };
}, options: TOptions): ChartDefinitionWithOptions<DefinedResponsiveChart<TSpec & {
    marks: TMarks;
}>, TOptions>;
export declare function defineChart<const TSpec extends ErasedChartSpec, const TOptions extends ChartDefinitionOptions<ChartSpecDatum<TSpec>, ChartSpecXValue<TSpec>, ChartSpecYValue<TSpec>>>(definition: DefinedResponsiveChart<TSpec>, options: TOptions): ChartDefinitionWithOptions<DefinedResponsiveChart<TSpec>, TOptions>;
export declare function defineChart<const TDefinition extends StaticChartDefinition<any, any, any>, const TOptions extends ChartDefinitionOptions<ChartDefinitionDatum<TDefinition>, ChartDefinitionXValue<TDefinition>, ChartDefinitionYValue<TDefinition>>>(definition: TDefinition, options: TOptions): ChartDefinitionWithOptions<NoInfer<TDefinition>, NoInfer<TOptions>>;
export declare function defineChart<const TDefinition extends ResponsiveChartDefinition<any, any, any>, const TOptions extends ChartDefinitionOptions<ChartDefinitionDatum<TDefinition>, ChartDefinitionXValue<TDefinition>, ChartDefinitionYValue<TDefinition>>>(definition: TDefinition & ValidResponsiveDefinitionInput<NoInfer<TDefinition>>, options: TOptions): ChartDefinitionWithOptions<NoInfer<TDefinition>, NoInfer<TOptions>>;
export declare function createChartScene<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(definition: StaticChartDefinition<TDatum, TXValue, TYValue>, size: ChartSize, layout?: ChartLayoutOptions): ChartScene<TDatum, TXValue, TYValue>;
export declare function findNearestPoint<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(scene: ChartScene<TDatum, TXValue, TYValue>, x: number, y: number, maxDistance?: number, points?: readonly ChartPoint<TDatum, TXValue, TYValue>[]): ChartPoint<TDatum, TXValue, TYValue> | null;
/** Points whose presented anchors are inside an active viewport clip. */
export declare function viewportInteractionPoints<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(scene: ChartScene<TDatum, TXValue, TYValue>, points?: readonly ChartPoint<TDatum, TXValue, TYValue>[]): readonly ChartPoint<TDatum, TXValue, TYValue>[];
export {};
