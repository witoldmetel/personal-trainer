import type { Channel, CartesianChartMark, ChartKey, ChartMark, ChartMarkMotionOptions, ChartValue, MarkCallOptions, MarkChannelOutput, MarkScaleBindings, VisualChannel, WidenChartValue } from './types.js';
export interface RuleYOptions<TDatum> extends ChartMarkMotionOptions<never> {
    id?: string;
    y?: Channel<TDatum, ChartValue | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
    yScale?: string;
}
export interface RuleXOptions<TDatum> extends ChartMarkMotionOptions<never> {
    id?: string;
    x?: Channel<TDatum, ChartValue | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
    xScale?: string;
}
type RuleYCallOptions<TDatum, TYChannel, TYScaleId extends string | undefined> = MarkCallOptions<RuleYOptions<NoInfer<TDatum>>, {
    y?: TYChannel;
    yScale?: TYScaleId;
}>;
type RuleXCallOptions<TDatum, TXChannel, TXScaleId extends string | undefined> = MarkCallOptions<RuleXOptions<NoInfer<TDatum>>, {
    x?: TXChannel;
    xScale?: TXScaleId;
}>;
type RuleFallback<TDatum> = [
    WidenChartValue<Extract<TDatum, ChartValue>>
] extends [never] ? ChartValue : WidenChartValue<Extract<TDatum, ChartValue>>;
export declare function ruleY<TDatum>(source: Iterable<TDatum>): ChartMark<never, never, RuleFallback<TDatum>>;
export declare function ruleY<TDatum, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: RuleYCallOptions<TDatum, TYChannel, TYScaleId> | undefined): CartesianChartMark<never, never, MarkChannelOutput<TDatum, TYChannel, RuleFallback<TDatum>>, never, MarkChannelOutput<TDatum, TYChannel, RuleFallback<TDatum>>, MarkScaleBindings<'x', TYScaleId>>;
export declare function ruleX<TDatum>(source: Iterable<TDatum>): ChartMark<never, RuleFallback<TDatum>, never>;
export declare function ruleX<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TXScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: RuleXCallOptions<TDatum, TXChannel, TXScaleId> | undefined): CartesianChartMark<never, MarkChannelOutput<TDatum, TXChannel, RuleFallback<TDatum>>, never, MarkChannelOutput<TDatum, TXChannel, RuleFallback<TDatum>>, never, MarkScaleBindings<TXScaleId, 'y'>>;
export {};
