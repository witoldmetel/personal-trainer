import type { Channel, ChannelOutput, CartesianChartMark, CartesianScaleBindings, ChartKey, ChartMarkMotionOptions, ChartValue, MarkCallOptions, MarkScaleBindings, VisualChannel } from './types.js';
export type VectorAnchor = 'start' | 'middle' | 'end';
export interface VectorOptions<TDatum> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    x: Channel<TDatum, ChartValue | null | undefined>;
    y: Channel<TDatum, ChartValue | null | undefined>;
    length?: number | Channel<TDatum, number | null | undefined>;
    rotate?: number | Channel<TDatum, number | null | undefined>;
    anchor?: VectorAnchor;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    color?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    headLength?: number;
    headAngle?: number;
}
type VectorCallOptions<TDatum, TXChannel, TYChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<VectorOptions<NoInfer<TDatum>>, {
    x: TXChannel;
    y: TYChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
/**
 * Draws fixed-pixel vectors at scaled anchors. Rotation is clockwise in
 * degrees, with zero pointing up.
 */
export declare function vector<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: VectorCallOptions<TDatum, TXChannel, TYChannel, TXScaleId, TYScaleId>): CartesianChartMark<TDatum, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
