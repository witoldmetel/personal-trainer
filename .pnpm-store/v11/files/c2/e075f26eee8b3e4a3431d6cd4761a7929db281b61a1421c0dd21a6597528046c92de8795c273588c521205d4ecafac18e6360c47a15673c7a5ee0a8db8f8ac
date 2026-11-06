import type { ChartValue, ResolvedScale } from './types.js';
export interface InteractionAxis<TValue extends ChartValue> {
    readonly scale: ResolvedScale;
    readonly extent: readonly [number, number];
    readonly values?: readonly TValue[];
    readonly positions?: readonly number[];
    position: (value: TValue) => number;
    /** Inverts a continuous scale without clamping to the interaction extent. */
    invert: (position: number) => TValue;
    valueAt: (position: number) => TValue;
    order: (first: TValue, second: TValue) => readonly [TValue, TValue];
    indexOf: (value: TValue) => number;
    at: (index: number) => TValue;
    step: (value: TValue, amount: number) => TValue;
    clampPosition: (position: number) => number;
    layoutKey: (value: TValue) => string;
}
export interface InteractionAxisOptions<TValue extends ChartValue> {
    axis: 'x' | 'y';
    scale: ResolvedScale | undefined;
    extent: readonly [number, number];
    sample: TValue;
    values?: readonly TValue[];
}
/** Shared semantic-value/pixel conversion for scale-bound interactions. */
export declare function createInteractionAxis<TValue extends ChartValue>(options: InteractionAxisOptions<TValue>): InteractionAxis<TValue>;
