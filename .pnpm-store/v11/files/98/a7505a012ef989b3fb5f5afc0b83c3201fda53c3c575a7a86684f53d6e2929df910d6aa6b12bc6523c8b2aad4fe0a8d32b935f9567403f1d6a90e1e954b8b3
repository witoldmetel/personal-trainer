import type { ChartKey, ResolvedColorScale } from './types.js';
export interface CategoricalLegendItem<TValue extends ChartKey = ChartKey> {
    key: string;
    value: TValue;
    label: string;
    color: string;
}
export interface CategoricalLegendLayout {
    columns: number;
    rows: number;
    itemWidth: number;
}
export interface CategoricalLegendFlowItem {
    index: number;
    row: number;
    x: number;
    width: number;
}
export interface CategoricalLegendFlowLayout {
    rows: number;
    items: readonly CategoricalLegendFlowItem[];
}
export declare function resolveCategoricalLegendItems<TValue extends ChartKey = ChartKey>(colors: ResolvedColorScale, format?: (value: TValue) => string): readonly CategoricalLegendItem<TValue>[];
export declare function layoutCategoricalLegendItems(itemCount: number, width: number, minimumItemWidth: number): CategoricalLegendLayout;
export declare function layoutCategoricalLegendFlow(itemWidths: readonly number[], width: number, gap: number, justify: 'start' | 'center'): CategoricalLegendFlowLayout;
