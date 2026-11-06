import type { InteractionAxis } from './interaction-axis-internal.js';
import type { ChartValue } from './types.js';
export interface InteractionRange<TValue extends ChartValue> {
    readonly start: TValue;
    readonly end: TValue;
}
/** Shared semantic interval normalization for axis-bound interactions. */
export declare function normalizeInteractionRange<TValue extends ChartValue>(axis: InteractionAxis<TValue>, range: InteractionRange<TValue>): InteractionRange<TValue>;
export declare function sameInteractionRange<TValue extends ChartValue>(axis: InteractionAxis<TValue>, left: InteractionRange<TValue>, right: InteractionRange<TValue>): boolean;
export declare function cloneInteractionRange<TValue extends ChartValue>(range: InteractionRange<TValue>): InteractionRange<TValue>;
export declare function cloneInteractionValue<TValue extends ChartValue>(value: TValue): TValue;
