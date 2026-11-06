import type { ChartPoint, ChartScene, ChartValue } from './types.js';
/** Legacy point-anchor lookup used by explicit point-only indexes. */
export declare function nearestPoint<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], x: number, y: number, maxDistance: number): ChartPoint<TDatum, TXValue, TYValue> | null;
export declare function nearestScenePoint<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(scene: ChartScene<TDatum, TXValue, TYValue>, x: number, y: number, maxDistance: number, points?: readonly ChartPoint<TDatum, TXValue, TYValue>[]): ChartPoint<TDatum, TXValue, TYValue> | null;
/** Returns the topmost painted interaction target containing a scene point. */
export declare function findContainingScenePoint<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(scene: ChartScene<TDatum, TXValue, TYValue>, x: number, y: number, points?: readonly ChartPoint<TDatum, TXValue, TYValue>[]): Readonly<{
    point: ChartPoint<TDatum, TXValue, TYValue> | null;
}> | null;
