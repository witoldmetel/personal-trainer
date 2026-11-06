import type { ChartFocusMode, ChartFocusStrategy, ChartPoint, ChartScene, ChartValue } from './types.js';
/** Resolves built-in focus names without importing cursor or platform code. */
export declare function resolveChartFocusStrategy<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(focus: ChartFocusMode<TDatum, TXValue, TYValue> | undefined): ChartFocusStrategy<TDatum, TXValue, TYValue> | undefined;
/**
 * Resolves explicit pointer focus, or returns undefined for default nearest
 * focus. An empty array means the explicit strategy found no target. A points
 * array distinct from scene.points preserves presentation-point resolution.
 */
export declare function resolveChartPointerFocus<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(scene: ChartScene<TDatum, TXValue, TYValue>, focusMode: ChartFocusMode<TDatum, TXValue, TYValue> | undefined, x: number, y: number, maxDistance: number, points?: readonly ChartPoint<TDatum, TXValue, TYValue>[]): readonly ChartPoint<TDatum, TXValue, TYValue>[] | undefined;
export declare function sameChartPointIdentity<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(left: ChartPoint<TDatum, TXValue, TYValue> | null, right: ChartPoint<TDatum, TXValue, TYValue> | null): boolean;
export declare function restoreChartFocusPoint<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], previous: ChartPoint<TDatum, TXValue, TYValue>): ChartPoint<TDatum, TXValue, TYValue>;
export declare function chartPointFromNavigationOrder<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], current: ChartPoint<TDatum, TXValue, TYValue> | null, key: string): ChartPoint<TDatum, TXValue, TYValue> | null | undefined;
export declare function chartPointFromSceneOrder<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], current: ChartPoint<TDatum, TXValue, TYValue> | null, key: string): ChartPoint<TDatum, TXValue, TYValue> | null | undefined;
