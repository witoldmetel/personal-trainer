import type { LinkOptions } from './link.js';
import type { Channel, ChannelOutput, CartesianChartMark, ChartKey, ChartValue, MarkCallOptions, MarkScaleBindings } from './types.js';
export interface DelaunayLinkDatum<TDatum, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> {
    readonly edgeKey: string;
    readonly group: ChartKey | null;
    readonly source: TDatum;
    readonly sourceIndex: number;
    readonly sourceKey: ChartKey;
    readonly target: TDatum;
    readonly targetIndex: number;
    readonly targetKey: ChartKey;
    readonly x1: TXValue;
    readonly y1: TYValue;
    readonly x2: TXValue;
    readonly y2: TYValue;
}
export type DelaunayLinkOptions<TDatum> = {
    x: Channel<TDatum, ChartValue | null | undefined>;
    y: Channel<TDatum, ChartValue | null | undefined>;
    /** Triangulates each non-null group independently. */
    z?: Channel<TDatum, ChartKey | null | undefined>;
    /** Stable point identity used to derive canonical edge keys. */
    key?: Channel<TDatum, ChartKey>;
} & Omit<LinkOptions<DelaunayLinkDatum<TDatum>>, 'x1' | 'y1' | 'x2' | 'y2' | 'z' | 'key'>;
type DelaunayLinkCallOptions<TDatum, TXChannel, TYChannel, TXScaleId extends string | undefined, TYScaleId extends string | undefined> = MarkCallOptions<DelaunayLinkOptions<NoInfer<TDatum>>, {
    x: TXChannel;
    y: TYChannel;
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}>;
/** Connects final-screen Delaunay neighbors while retaining semantic endpoints. */
export declare function delaunayLink<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TYChannel extends Channel<NoInfer<TDatum>, ChartValue | null | undefined>, const TXScaleId extends string | undefined = undefined, const TYScaleId extends string | undefined = undefined>(source: Iterable<TDatum>, options: DelaunayLinkCallOptions<TDatum, TXChannel, TYChannel, TXScaleId, TYScaleId>): CartesianChartMark<DelaunayLinkDatum<TDatum, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>>, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>, ChannelOutput<TDatum, TXChannel, number>, ChannelOutput<TDatum, TYChannel, number>, MarkScaleBindings<TXScaleId, TYScaleId>>;
export {};
