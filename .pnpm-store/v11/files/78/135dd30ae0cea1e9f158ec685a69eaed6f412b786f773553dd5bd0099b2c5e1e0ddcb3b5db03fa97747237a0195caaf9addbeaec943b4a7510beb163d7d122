import type { TransformLineage } from './transform.js';
import type { Channel, ChannelOutput, CartesianScaleBindings, ChartKey, ChartLineStateStyle, ChartMark, ChartMarkMotionOptions, ChartMarkState, VisualChannel } from './types.js';
export type DifferenceIndependent = number | Date;
export type DifferenceSign = 'positive' | 'negative';
/** One source or interpolated boundary point in a difference-area lobe. */
export interface DifferenceAreaDatum<TDatum, TIndependent extends DifferenceIndependent = DifferenceIndependent> extends TransformLineage<TDatum> {
    readonly kind: 'difference-area';
    readonly independent: TIndependent;
    readonly comparison: number;
    readonly primary: number;
    readonly sign: DifferenceSign;
    readonly segment: string;
    readonly crossing: boolean;
    readonly markKey: ChartKey;
}
/** Raw line data plus the derived, decorative difference-area data. */
export type DifferenceDatum<TDatum, TIndependent extends DifferenceIndependent = DifferenceIndependent> = TDatum | DifferenceAreaDatum<TDatum, TIndependent>;
interface DifferenceOptions<TDatum, TIndependent extends DifferenceIndependent> extends CartesianScaleBindings, ChartMarkMotionOptions<DifferenceDatum<TDatum, TIndependent>> {
    id?: string;
    z?: Channel<TDatum, ChartKey | null | undefined>;
    key?: Channel<TDatum, ChartKey>;
    positiveFill?: VisualChannel<DifferenceAreaDatum<TDatum, TIndependent>, string> | null;
    negativeFill?: VisualChannel<DifferenceAreaDatum<TDatum, TIndependent>, string> | null;
    fillOpacity?: number;
    positiveFillOpacity?: number;
    negativeFillOpacity?: number;
    /** Paint for the primary boundary line. */
    stroke?: VisualChannel<TDatum, string>;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: string;
    /** Paint for the comparison boundary line. */
    comparisonStroke?: VisualChannel<TDatum, string>;
    comparisonStrokeOpacity?: number;
    comparisonStrokeWidth?: number;
    comparisonStrokeDasharray?: string;
    points?: boolean;
    states?: readonly ChartMarkState<TDatum, ChartLineStateStyle<TDatum>>[];
    comparisonStates?: readonly ChartMarkState<TDatum, ChartLineStateStyle<TDatum>>[];
}
export interface DifferenceYOptions<TDatum, TIndependent extends DifferenceIndependent = DifferenceIndependent> extends DifferenceOptions<TDatum, TIndependent> {
    x: Channel<TDatum, TIndependent | null | undefined>;
    y1: number | Channel<TDatum, number | null | undefined>;
    y2: number | Channel<TDatum, number | null | undefined>;
}
export interface DifferenceXOptions<TDatum, TIndependent extends DifferenceIndependent = DifferenceIndependent> extends DifferenceOptions<TDatum, TIndependent> {
    x1: number | Channel<TDatum, number | null | undefined>;
    x2: number | Channel<TDatum, number | null | undefined>;
    y: Channel<TDatum, TIndependent | null | undefined>;
}
type IndependentOutput<TDatum, TChannel> = Extract<ChannelOutput<TDatum, TChannel, number>, DifferenceIndependent>;
type DifferenceYCallOptions<TDatum, TXChannel extends Channel<NoInfer<TDatum>, DifferenceIndependent | null | undefined>> = Omit<DifferenceYOptions<NoInfer<TDatum>, IndependentOutput<TDatum, TXChannel>>, 'x'> & {
    x: TXChannel;
};
type DifferenceXCallOptions<TDatum, TYChannel extends Channel<NoInfer<TDatum>, DifferenceIndependent | null | undefined>> = Omit<DifferenceXOptions<NoInfer<TDatum>, IndependentOutput<TDatum, TYChannel>>, 'y'> & {
    y: TYChannel;
};
/** Compares two vertical values and fills their positive and negative lobes. */
export declare function differenceY<TDatum, const TXChannel extends Channel<NoInfer<TDatum>, DifferenceIndependent | null | undefined>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: DifferenceYCallOptions<TDatum, TXChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<DifferenceDatum<TDatum, IndependentOutput<TDatum, TXChannel>>, IndependentOutput<TDatum, TXChannel>, number, IndependentOutput<TDatum, TXChannel>, number, TXScaleId, TYScaleId>;
/** Compares two horizontal values and fills their positive and negative lobes. */
export declare function differenceX<TDatum, const TYChannel extends Channel<NoInfer<TDatum>, DifferenceIndependent | null | undefined>, const TXScaleId extends string = 'x', const TYScaleId extends string = 'y'>(source: Iterable<TDatum>, options: DifferenceXCallOptions<TDatum, TYChannel> & {
    xScale?: TXScaleId;
    yScale?: TYScaleId;
}): ChartMark<DifferenceDatum<TDatum, IndependentOutput<TDatum, TYChannel>>, number, IndependentOutput<TDatum, TYChannel>, number, IndependentOutput<TDatum, TYChannel>, TXScaleId, TYScaleId>;
export {};
