import type { Channel, ChannelOutput, CartesianScaleBindings, ChartFocusMatch, ChartKey, ChartMark, ChartMarkMotionOptions, ChartPoint, ChartValue, VisualChannel } from './types.js';
export interface FocusGuideRuleOptions<TDatum> {
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: VisualChannel<TDatum, number>;
    strokeWidth?: VisualChannel<TDatum, number>;
    strokeDasharray?: VisualChannel<TDatum, string>;
    lineCap?: 'butt' | 'round' | 'square';
}
export interface FocusGuideMarkerOptions<TDatum> {
    radius?: VisualChannel<TDatum, number>;
    fill?: VisualChannel<TDatum, string>;
    fillOpacity?: VisualChannel<TDatum, number>;
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: VisualChannel<TDatum, number>;
    strokeWidth?: VisualChannel<TDatum, number>;
}
export interface FocusGuideLabelFormatContext<TDatum, TXValue extends ChartValue, TYValue extends ChartValue> {
    readonly point: ChartPoint<TDatum, TXValue, TYValue>;
}
export interface FocusGuideLabelOptions<TDatum, TValue extends ChartValue, TXValue extends ChartValue, TYValue extends ChartValue> {
    format?: (value: TValue, context: FocusGuideLabelFormatContext<TDatum, TXValue, TYValue>) => string;
    side?: 'start' | 'end';
    offset?: number;
    paddingX?: number;
    paddingY?: number;
    radius?: number;
    background?: VisualChannel<TDatum, string>;
    color?: VisualChannel<TDatum, string>;
    stroke?: VisualChannel<TDatum, string>;
    strokeWidth?: number;
    fontSize?: number;
    fontWeight?: number;
}
type FocusGuideChannel<TDatum> = Channel<TDatum, ChartValue | null | undefined>;
export interface FocusGuideOptions<TDatum, TXChannel extends FocusGuideChannel<TDatum>, TYChannel extends FocusGuideChannel<TDatum>> extends ChartMarkMotionOptions<TDatum>, CartesianScaleBindings {
    id?: string;
    x: TXChannel;
    y: TYChannel;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    match?: ChartFocusMatch;
    xRule?: false | FocusGuideRuleOptions<TDatum>;
    yRule?: false | FocusGuideRuleOptions<TDatum>;
    marker?: false | FocusGuideMarkerOptions<TDatum>;
    xLabel?: false | FocusGuideLabelOptions<TDatum, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>>;
    yLabel?: false | FocusGuideLabelOptions<TDatum, ChannelOutput<TDatum, TYChannel, number>, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>>;
}
export declare function focusGuideX<TDatum, const TXChannel extends FocusGuideChannel<NoInfer<TDatum>>, const TYChannel extends FocusGuideChannel<NoInfer<TDatum>>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: FocusGuideOptions<NoInfer<TDatum>, TXChannel, TYChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<TDatum, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>, TXScaleId, TYScaleId>;
export declare function focusGuideY<TDatum, const TXChannel extends FocusGuideChannel<NoInfer<TDatum>>, const TYChannel extends FocusGuideChannel<NoInfer<TDatum>>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: FocusGuideOptions<NoInfer<TDatum>, TXChannel, TYChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<TDatum, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>, TXScaleId, TYScaleId>;
export {};
