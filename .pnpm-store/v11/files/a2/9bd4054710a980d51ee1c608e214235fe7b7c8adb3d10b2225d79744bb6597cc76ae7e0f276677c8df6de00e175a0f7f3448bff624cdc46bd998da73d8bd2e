import type { ControlledSignal } from './interaction-signal.js';
import type { ChartControl, ChartValue, SceneStyle } from './types.js';
export type HandleXPointerSource = 'pointer' | 'touch';
export type HandleXSource = HandleXPointerSource | 'keyboard';
export type HandleXChange<TValue extends ChartValue> = HandleXChangeEvent<TValue, 'preview', HandleXPointerSource> | HandleXChangeEvent<TValue, 'commit', HandleXSource> | HandleXChangeEvent<TValue, 'cancel', HandleXSource>;
interface HandleXChangeEvent<TValue extends ChartValue, TType extends 'preview' | 'commit' | 'cancel', TSource extends HandleXSource> {
    readonly type: TType;
    readonly value: TValue;
    readonly origin: TValue;
    readonly source: TSource;
}
export type HandleXCross<TValue extends ChartValue = ChartValue> = {
    readonly edge: 'top' | 'bottom';
    readonly offset?: number;
    readonly value?: never;
} | {
    readonly value: TValue;
    readonly edge?: never;
    readonly offset?: never;
};
export interface HandleXOptions<TXValue extends ChartValue, TYValue extends ChartValue = any> {
    id?: string;
    value: ControlledSignal<TXValue, HandleXChange<TXValue>>;
    /** Ordered candidates used for snapping and indexed keyboard movement. */
    values: readonly TXValue[];
    cross: HandleXCross<TYValue>;
    trackStyle?: SceneStyle;
    ruleStyle?: SceneStyle | false;
    handleStyle?: SceneStyle;
    hitSize?: number;
    ariaLabel?: string;
    format?: (value: TXValue) => string;
    keyboard?: boolean;
}
/** A controlled, candidate-bound horizontal scale handle. */
export declare function handleX<TXValue extends ChartValue, TYValue extends ChartValue = any>(options: HandleXOptions<TXValue, TYValue>): ChartControl<TXValue, TYValue>;
export {};
