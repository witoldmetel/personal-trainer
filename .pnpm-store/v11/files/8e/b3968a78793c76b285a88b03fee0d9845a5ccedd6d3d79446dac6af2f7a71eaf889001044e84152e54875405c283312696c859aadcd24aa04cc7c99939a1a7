import { resolveCrosshairGuide } from './crosshair-resolver.js';
import type { CartesianScaleBindings, ChartMark, ChartMarkMotionOptions, ChartValue } from './types.js';
export { resolveCrosshairGuide };
export interface CrosshairRuleOptions {
    stroke?: string;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
}
export interface CrosshairLabelOptions<TValue extends ChartValue = ChartValue> {
    format?: (value: TValue) => string;
    offset?: number;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeOpacity?: number;
    strokeWidth?: number;
    opacity?: number;
    fontSize?: number;
    fontWeight?: number;
}
/** Paint for a categorical cursor band that replaces one crosshair rule. */
export interface CrosshairBandOptions {
    /** Inset from both scale-band edges. Negative values create an outset. */
    inset?: number;
    radius?: number;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeOpacity?: number;
    strokeWidth?: number;
    opacity?: number;
}
export interface CrosshairAxisOptions<TValue extends ChartValue = ChartValue> extends CrosshairRuleOptions {
    label?: boolean | CrosshairLabelOptions<TValue>;
    /** Paints the categorical scale band instead of an axis rule. */
    band?: boolean | CrosshairBandOptions;
}
export interface CrosshairMarkerOptions {
    radius?: number;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeOpacity?: number;
    strokeWidth?: number;
    opacity?: number;
}
export interface CrosshairOptions<TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> extends ChartMarkMotionOptions<never>, CrosshairRuleOptions, CartesianScaleBindings {
    id?: string;
    /** Draws the vertical guide at the focused x position. Defaults to true. */
    x?: boolean | CrosshairAxisOptions<TXValue>;
    /** Draws the horizontal guide at the focused y position. Defaults to true. */
    y?: boolean | CrosshairAxisOptions<TYValue>;
    /** Draws a marker at the primary focused point. Defaults to false. */
    marker?: boolean | CrosshairMarkerOptions;
}
/** Draws renderer-native guides from the chart's existing focus state. */
export declare function crosshair<TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(options?: CrosshairOptions<TXValue, TYValue> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<never, never, never, never, never, TXScaleId, TYScaleId>;
