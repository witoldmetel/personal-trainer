import type { ChartBounds, ChartColorLegend, ChartKey, ChartLegendPlacement, SceneNode } from './types.js';
export interface ColorLegendItemContext {
    color: string;
    index: number;
    label: string;
}
export type ColorLegendIndicatorShape = 'dot' | 'square' | 'line' | 'line-dot';
export type ColorLegendItemValue<TValue extends ChartKey, TResult> = TResult | ((value: TValue, context: ColorLegendItemContext) => TResult);
export interface ColorLegendIndicatorRenderContext extends ColorLegendItemContext {
    bounds: ChartBounds;
}
export interface ColorLegendIndicatorOptions<TValue extends ChartKey = ChartKey> {
    shape?: ColorLegendItemValue<TValue, ColorLegendIndicatorShape>;
    width?: number;
    height?: number;
    gap?: number;
    render?: (value: TValue, context: ColorLegendIndicatorRenderContext) => SceneNode | readonly SceneNode[];
}
export interface ColorLegendLabelOptions<TValue extends ChartKey = ChartKey> {
    format?: (value: TValue) => string;
    fontSize?: number;
    fontWeight?: number;
    fill?: ColorLegendItemValue<TValue, string>;
    fillOpacity?: number;
}
export interface ColorLegendItemOptions<TValue extends ChartKey = ChartKey> {
    justify?: 'start' | 'center' | 'stretch';
    gap?: number;
    rowGap?: number;
    indicator?: ColorLegendIndicatorOptions<TValue>;
    label?: ColorLegendLabelOptions<TValue>;
}
declare const colorLegendItemsBrand: unique symbol;
export interface ColorLegendItems<in TValue extends ChartKey = ChartKey> {
    readonly [colorLegendItemsBrand]: unknown;
}
export interface ColorLegendOptions<TValue extends ChartKey = ChartKey> {
    label?: string;
    itemWidth?: number;
    items?: ColorLegendItems<TValue>;
    width?: number;
    format?: (value: number) => string;
    placement?: ChartLegendPlacement;
}
export interface ColorGradientLegendOptions {
    label?: string;
    steps?: number;
    width?: number;
    format?: (value: number) => string;
    placement?: ChartLegendPlacement;
}
export declare function colorLegendItems<TValue extends ChartKey = ChartKey>(options?: ColorLegendItemOptions<TValue>): ColorLegendItems<TValue>;
export declare function colorLegend<TValue extends ChartKey = ChartKey>(options?: ColorLegendOptions<TValue>): ChartColorLegend;
export declare function colorGradientLegend(options?: ColorGradientLegendOptions): ChartColorLegend;
export {};
