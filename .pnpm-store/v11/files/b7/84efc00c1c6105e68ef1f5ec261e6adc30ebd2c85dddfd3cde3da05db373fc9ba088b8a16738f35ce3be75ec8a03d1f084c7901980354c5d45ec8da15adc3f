import type { ChartFocusGroupContext, ChartFocusResolveContext, ChartPoint, ChartValue } from './types.js';
export declare const focusDisabled: UniversalChartFocusStrategy;
interface UniversalChartFocusStrategy {
    resolve: <TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], context: ChartFocusResolveContext) => readonly ChartPoint<TDatum, TXValue, TYValue>[];
    group: <TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], context: ChartFocusGroupContext<TDatum, TXValue, TYValue>) => readonly ChartPoint<TDatum, TXValue, TYValue>[];
    navigation: <TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[]) => readonly ChartPoint<TDatum, TXValue, TYValue>[];
}
export {};
