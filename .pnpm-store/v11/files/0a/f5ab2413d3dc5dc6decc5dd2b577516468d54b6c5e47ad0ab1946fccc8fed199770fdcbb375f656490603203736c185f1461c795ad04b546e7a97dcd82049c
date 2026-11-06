import type { ControlledSignal } from './interaction-signal.js';
import type { ChartControl } from './types.js';
export type ContinuousCursorValue = number | Date;
export interface ContinuousCursorPosition<TXValue extends ContinuousCursorValue = number, TYValue extends ContinuousCursorValue = number> {
    readonly x: TXValue;
    readonly y: TYValue;
}
export type ContinuousCursorPointerSource = 'pointer' | 'touch';
export type ContinuousCursorSource = ContinuousCursorPointerSource | 'keyboard';
export type ContinuousCursorChange<TXValue extends ContinuousCursorValue, TYValue extends ContinuousCursorValue> = {
    readonly type: 'preview';
    readonly value: ContinuousCursorPosition<TXValue, TYValue> | null;
    readonly origin: ContinuousCursorPosition<TXValue, TYValue> | null;
    readonly source: ContinuousCursorPointerSource;
    readonly cause: 'move' | 'leave' | 'cancel';
} | {
    readonly type: 'commit';
    readonly value: ContinuousCursorPosition<TXValue, TYValue>;
    readonly origin: ContinuousCursorPosition<TXValue, TYValue> | null;
    readonly source: ContinuousCursorPointerSource;
    readonly cause: 'pin';
} | {
    readonly type: 'clear';
    readonly value: null;
    readonly origin: ContinuousCursorPosition<TXValue, TYValue> | null;
    readonly source: ContinuousCursorSource;
    readonly cause: 'toggle' | 'escape';
};
export interface ContinuousCursorRuleOptions {
    stroke?: string;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
    lineCap?: 'butt' | 'round' | 'square';
}
export interface ContinuousCursorMarkerOptions {
    radius?: number;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeOpacity?: number;
    strokeWidth?: number;
}
export interface ContinuousCursorLabelOptions<TValue extends ContinuousCursorValue> {
    format?: (value: TValue) => string;
    side?: 'start' | 'end';
    offset?: number;
    paddingX?: number;
    paddingY?: number;
    radius?: number;
    background?: string;
    color?: string;
    stroke?: string;
    strokeWidth?: number;
    fontSize?: number;
    fontWeight?: number;
}
export interface ContinuousCursorOptions<TXValue extends ContinuousCursorValue, TYValue extends ContinuousCursorValue> {
    id?: string;
    position: ControlledSignal<ContinuousCursorPosition<TXValue, TYValue> | null, ContinuousCursorChange<TXValue, TYValue>>;
    xRule?: false | ContinuousCursorRuleOptions;
    yRule?: false | ContinuousCursorRuleOptions;
    marker?: false | ContinuousCursorMarkerOptions;
    xLabel?: false | ContinuousCursorLabelOptions<TXValue>;
    yLabel?: false | ContinuousCursorLabelOptions<TYValue>;
}
/**
 * Tracks an arbitrary invertible x/y plot position without snapping to data.
 * A non-null controlled position is pinned; pointer previews remain host-local.
 */
export declare function continuousCursor<TXValue extends ContinuousCursorValue, TYValue extends ContinuousCursorValue>(options: ContinuousCursorOptions<TXValue, TYValue>): ChartControl<TXValue, TYValue>;
