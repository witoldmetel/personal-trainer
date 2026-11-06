import type { PolarLayoutContext } from './polar-mark-internal.js';
import type { ChartFocusGroupContext, ChartFocusResolveContext, ChartPoint, ChartValue } from './types.js';
/** Attaches renderer-neutral polar coordinates without widening ChartPoint. */
export declare function withPolarFocusGeometry<TPoint extends ChartPoint<any, any, any>>(point: TPoint, layout: PolarLayoutContext, angle: number, radius: number, offsetX: number, offsetY: number): TPoint;
/** Groups the nearest angular ray across radial series. */
export declare const focusGroupAngle: {
    resolve<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], context: ChartFocusResolveContext): ChartPoint<TDatum, TXValue, TYValue>[];
    group<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], context: ChartFocusGroupContext<TDatum, TXValue, TYValue>): ChartPoint<TDatum, TXValue, TYValue>[];
    navigation<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[]): ChartPoint<TDatum, TXValue, TYValue>[];
};
