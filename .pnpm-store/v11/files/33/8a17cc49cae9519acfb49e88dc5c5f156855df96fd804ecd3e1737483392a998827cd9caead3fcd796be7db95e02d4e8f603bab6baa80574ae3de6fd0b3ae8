import type { Channel, CartesianChartMark, CartesianScaleBindings, ChartKey, ChartMark, ChartMarkMotionOptions, ChartMarkState, ChartBarStateStyle, ChartValue, MarkCallOptions, MarkChannelOutput, MarkScaleBindings, RectRadius, VisualChannel } from './types.js';
import type { GroupLayout } from './group.js';
import type { StackLayout } from './stack.js';
type BarLayout = GroupLayout | StackLayout;
export interface BarEndRadius<TDatum> {
    end: VisualChannel<TDatum, number>;
    stack?: 'outer' | 'each';
}
export type BarRadius<TDatum> = VisualChannel<TDatum, RectRadius> | BarEndRadius<TDatum>;
export interface BarYOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    x?: Channel<TDatum, ChartValue | null | undefined>;
    y?: Channel<TDatum, number | null | undefined>;
    y1?: number | Channel<TDatum, number | null | undefined>;
    y2?: number | Channel<TDatum, number | null | undefined>;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    fill?: VisualChannel<TDatum, string>;
    fillOpacity?: number;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: VisualChannel<TDatum, string>;
    layout?: BarLayout;
    /** Pixels removed from both categorical edges after band layout. */
    inset?: number;
    /** Maximum painted width in pixels after grouping and inset. */
    maxThickness?: number;
    radius?: BarRadius<TDatum>;
    states?: readonly ChartMarkState<TDatum, ChartBarStateStyle<TDatum>>[];
}
export interface BarXOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    x?: Channel<TDatum, number | null | undefined>;
    x1?: number | Channel<TDatum, number | null | undefined>;
    x2?: number | Channel<TDatum, number | null | undefined>;
    y?: Channel<TDatum, ChartValue | null | undefined>;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    fill?: VisualChannel<TDatum, string>;
    fillOpacity?: number;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: VisualChannel<TDatum, string>;
    layout?: BarLayout;
    /** Pixels removed from both categorical edges after band layout. */
    inset?: number;
    /** Maximum painted height in pixels after grouping and inset. */
    maxThickness?: number;
    radius?: BarRadius<TDatum>;
    states?: readonly ChartMarkState<TDatum, ChartBarStateStyle<TDatum>>[];
}
type BarYCallOptions<TDatum, TXChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<BarYOptions<NoInfer<TDatum>>, {
    x?: TXChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
type BarXCallOptions<TDatum, TYChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<BarXOptions<NoInfer<TDatum>>, {
    y?: TYChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
export declare function barY<TDatum>(source: Iterable<TDatum>): ChartMark<TDatum, number, number>;
export declare function barY<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: BarYCallOptions<TDatum, TXChannel, TXScaleId, TYScaleId> | undefined): CartesianChartMark<TDatum, MarkChannelOutput<TDatum, TXChannel, number>, number, MarkChannelOutput<TDatum, TXChannel, number>, number, MarkScaleBindings<TXScaleId, TYScaleId>>;
export declare function barX<TDatum>(source: Iterable<TDatum>): ChartMark<TDatum, number, number>;
export declare function barX<TDatum, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined> | undefined = never, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: BarXCallOptions<TDatum, TYChannel, TXScaleId, TYScaleId> | undefined): CartesianChartMark<TDatum, number, MarkChannelOutput<TDatum, TYChannel, number>, number, MarkChannelOutput<TDatum, TYChannel, number>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
