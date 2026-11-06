import type { ControlledSignal } from './interaction-signal.js';
import type { ChartKey, ChartMark, ChartPoint, ChartSelectionController, ChartSelectionSource, ChartValue } from './types.js';
export type KeyedSelectionChange<TDatum, TKey extends ChartKey, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> = {
    type: 'select';
    value: TKey;
    point: ChartPoint<TDatum, TXValue, TYValue>;
    source: ChartSelectionSource;
} | {
    type: 'clear';
    value: null;
    point: null;
    source: ChartSelectionSource;
};
export interface KeyedSelectionKeyContext<TDatum, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> {
    readonly point: ChartPoint<TDatum, TXValue, TYValue>;
}
export interface KeyedSelectionOptions<TDatum, TKey extends ChartKey, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> {
    selected: ControlledSignal<TKey | null, KeyedSelectionChange<TDatum, TKey, TXValue, TYValue>>;
    /** Return null or undefined when a point is not selectable. */
    key: (datum: TDatum, context: KeyedSelectionKeyContext<TDatum, TXValue, TYValue>) => TKey | null | undefined;
}
export interface KeyedSelection<TDatum, TKey extends ChartKey, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> extends ChartSelectionController<TDatum, TXValue, TYValue> {
    readonly selected: ControlledSignal<TKey | null, KeyedSelectionChange<TDatum, TKey, TXValue, TYValue>>;
    readonly key: KeyedSelectionOptions<TDatum, TKey, TXValue, TYValue>['key'];
    readonly matches: (point: ChartPoint<TDatum, TXValue, TYValue>) => boolean;
}
export declare function keyedSelection<TDatum, TKey extends ChartKey, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue>(options: KeyedSelectionOptions<TDatum, TKey, TXValue, TYValue>): KeyedSelection<TDatum, TKey, TXValue, TYValue>;
/** Paints one ordinary mark only for the selected semantic key. */
export declare function whenSelected<TDatum, TKey extends ChartKey, TXPointValue extends ChartValue, TYPointValue extends ChartValue, TXScaleValue extends ChartValue, TYScaleValue extends ChartValue, TXScaleId extends string, TYScaleId extends string>(mark: ChartMark<TDatum, TXPointValue, TYPointValue, TXScaleValue, TYScaleValue, TXScaleId, TYScaleId>, selection: KeyedSelection<TDatum, TKey, TXPointValue, TYPointValue>): ChartMark<TDatum, never, never, TXScaleValue, TYScaleValue, TXScaleId, TYScaleId>;
