import type { ChartDefinition, ChartPoint, ChartScene, ChartValue } from '@tanstack/charts/types';
export interface NativeChartFocusModel<TDatum, TXValue extends ChartValue, TYValue extends ChartValue> {
    resolve: (x: number, y: number) => readonly ChartPoint<TDatum, TXValue, TYValue>[];
    group: (point: ChartPoint<TDatum, TXValue, TYValue>) => readonly ChartPoint<TDatum, TXValue, TYValue>[];
    navigation: readonly ChartPoint<TDatum, TXValue, TYValue>[];
    restore: (point: ChartPoint<TDatum, TXValue, TYValue>) => ChartPoint<TDatum, TXValue, TYValue> | null;
}
export declare function createNativeChartFocusModel<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(scene: ChartScene<TDatum, TXValue, TYValue>, definition: ChartDefinition<TDatum, TXValue, TYValue>): NativeChartFocusModel<TDatum, TXValue, TYValue>;
export declare function adjacentFocusPoint<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(model: NativeChartFocusModel<TDatum, TXValue, TYValue>, current: ChartPoint<TDatum, TXValue, TYValue> | null, direction: -1 | 1): ChartPoint<TDatum, TXValue, TYValue>;
export declare function samePointIdentity<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(left: ChartPoint<TDatum, TXValue, TYValue> | null, right: ChartPoint<TDatum, TXValue, TYValue> | null): boolean;
export declare function samePointReferences<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(left: readonly ChartPoint<TDatum, TXValue, TYValue>[], right: readonly ChartPoint<TDatum, TXValue, TYValue>[]): boolean;
