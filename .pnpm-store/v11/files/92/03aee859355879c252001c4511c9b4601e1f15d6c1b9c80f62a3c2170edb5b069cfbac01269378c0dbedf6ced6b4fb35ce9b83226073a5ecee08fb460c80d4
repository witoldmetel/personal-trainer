import type { ChartFocusState, ChartPoint, ChartScene, ChartTooltipContent, ChartTooltipOptions, ChartTooltipPosition, ChartValue } from './types.js';
export { resolveChartTooltipPlacement } from './tooltip-placement.js';
export type { TooltipBounds, TooltipSize } from './tooltip-placement.js';
/** Orders focused points for host tooltip presentation. */
export declare function orderChartTooltipPoints<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], scene: ChartScene<TDatum, TXValue, TYValue>, sort: ChartTooltipOptions<TDatum, TXValue, TYValue>['sort']): ChartPoint<TDatum, TXValue, TYValue>[];
/** Resolves authored formatting and the built-in structured tooltip model. */
export declare function createChartTooltipContent<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], scene: ChartScene<TDatum, TXValue, TYValue>, pinned?: boolean, options?: ChartTooltipOptions<TDatum, TXValue, TYValue>, primaryPoint?: ChartPoint<TDatum, TXValue, TYValue>): ChartTooltipContent | string;
/** Resolves a scene-space anchor identically for every tooltip host. */
export declare function resolveChartTooltipAnchor<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(point: ChartPoint<TDatum, TXValue, TYValue>, points: readonly ChartPoint<TDatum, TXValue, TYValue>[], scene: ChartScene<TDatum, TXValue, TYValue>, pointer: ChartTooltipPosition | null, options?: ChartTooltipOptions<TDatum, TXValue, TYValue>, focus?: ChartFocusState<TDatum, TXValue, TYValue>): ChartTooltipPosition;
export declare function formatChartTooltipValue(value: ChartValue): string;
