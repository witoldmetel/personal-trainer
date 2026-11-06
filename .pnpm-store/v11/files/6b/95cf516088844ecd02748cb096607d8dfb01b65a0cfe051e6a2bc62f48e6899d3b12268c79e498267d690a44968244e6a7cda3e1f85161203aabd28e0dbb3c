import { type ChartCursorHostExtension } from './cursor-host-contract.js';
export { chartPointFromNavigationOrder, chartPointFromSceneOrder, resolveChartFocusStrategy, resolveChartPointerFocus, restoreChartFocusPoint, sameChartPointIdentity, } from './interaction.js';
import type { ChartCursorBinding, ChartCursorController, ChartCursorPresentation, ChartCursorState, ChartFocusSource, ChartFocusState, ChartFocusStrategy, ChartPoint, ChartScene, ChartValue } from './types.js';
/** Creates a framework-neutral cursor store that can be shared by many hosts. */
export declare function createChartCursor<TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue>(initialState?: ChartCursorState<TXValue, TYValue> | null): ChartCursorController<TXValue, TYValue>;
/** Platform-neutral cursor behavior injected into chart hosts by a binding. */
export declare const cursorHost: ChartCursorHostExtension;
/** Projects shared cursor state into one chart's plot and scales. */
export declare function resolveChartCursorPresentation<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(scene: ChartScene<TDatum, TXValue, TYValue>, binding: ChartCursorBinding<TDatum, TXValue, TYValue>, state: ChartCursorState<TXValue, TYValue> | null): ChartCursorPresentation<TXValue, TYValue> | null;
/** Creates free-cursor state from a scene position without resolving a datum. */
export declare function createFreeChartCursorState<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(scene: ChartScene<TDatum, TXValue, TYValue>, binding: Extract<ChartCursorBinding<TDatum, TXValue, TYValue>, {
    mode: 'free';
}>, position: Readonly<{
    x: number;
    y: number;
}>, source?: ChartFocusSource, pinned?: boolean): ChartCursorState<TXValue, TYValue>;
/** Creates a semantic cursor from focus selected by the existing focus engine. */
export declare function createFocusChartCursorState<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(scene: ChartScene<TDatum, TXValue, TYValue>, binding: Extract<ChartCursorBinding<TDatum, TXValue, TYValue>, {
    mode: 'focus';
}>, focus: ChartFocusState<TDatum, TXValue, TYValue>): ChartCursorState<TXValue, TYValue>;
/** Resolves a semantic shared cursor to local points, then reuses focus grouping. */
export declare function resolveChartCursorFocus<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], binding: Extract<ChartCursorBinding<TDatum, TXValue, TYValue>, {
    mode: 'focus';
}>, state: ChartCursorState<TXValue, TYValue> | null, strategy?: ChartFocusStrategy<TDatum, TXValue, TYValue>): readonly ChartPoint<TDatum, TXValue, TYValue>[];
export declare function sameChartValue(left: unknown, right: unknown): boolean;
