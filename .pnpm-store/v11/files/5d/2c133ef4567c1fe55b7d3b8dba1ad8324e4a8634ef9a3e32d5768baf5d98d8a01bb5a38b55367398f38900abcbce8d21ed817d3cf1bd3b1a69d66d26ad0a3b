import type { ControlledSignal } from './interaction-signal.js';
import type { ChartControl } from './types.js';
export type ZoomXValue = number | Date;
export interface ZoomXWindow<TValue extends ZoomXValue> {
    readonly start: TValue;
    readonly end: TValue;
}
export type ZoomXSource = 'wheel' | 'pointer' | 'touch' | 'keyboard';
export type ZoomXAction = 'zoom' | 'pan' | 'reset';
export type ZoomXWheelActivation = 'focus' | 'modifier' | 'always';
export type ZoomXChange<TValue extends ZoomXValue> = ZoomXChangeEvent<TValue, 'preview', 'wheel' | 'pointer' | 'touch', 'zoom' | 'pan'> | ZoomXChangeEvent<TValue, 'commit', ZoomXSource, ZoomXAction> | ZoomXChangeEvent<TValue, 'cancel', ZoomXSource, 'zoom' | 'pan'>;
interface ZoomXChangeEvent<TValue extends ZoomXValue, TType extends 'preview' | 'commit' | 'cancel', TSource extends ZoomXSource, TAction extends ZoomXAction> {
    readonly type: TType;
    readonly value: ZoomXWindow<TValue>;
    readonly origin: ZoomXWindow<TValue>;
    readonly source: TSource;
    readonly action: TAction;
}
export interface ZoomXOptions<TValue extends ZoomXValue> {
    id?: string;
    window: ControlledSignal<ZoomXWindow<TValue>, ZoomXChange<TValue>>;
    /** Full semantic x-domain available to pan and zoom. */
    extent: readonly [TValue, TValue];
    /** Minimum and maximum zoom factors relative to `extent`. */
    scaleExtent?: readonly [number, number];
    /** When wheel input may zoom or pan. Defaults to `focus`. */
    wheelActivation?: ZoomXWheelActivation;
    keyboard?: boolean;
    ariaLabel?: string;
    ariaDescription?: string;
    format?: (value: TValue) => string;
    onActiveChange?: (active: boolean) => void;
}
/**
 * Controls a continuous x-domain with configurable wheel activation, pan,
 * touch, and keyboard input. The application owns the accepted semantic
 * window.
 */
export declare function zoomX<TValue extends ZoomXValue>(options: ZoomXOptions<TValue>): ChartControl<TValue, any>;
export {};
