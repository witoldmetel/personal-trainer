import type { ChartScene, ChartValue, StaticChartDefinition } from './types.js';
export interface ChartAdapterLayoutOptions {
    width?: number;
    height?: number;
    initialWidth?: number;
    aspectRatio?: number;
}
export interface ChartAdapterLayout {
    aspectRatio?: number;
    initialWidth: number;
    initialHeight: number;
}
export interface ChartAdapter<TOptions, TDatum = unknown, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> {
    prerender: () => string;
    mount: (container: HTMLElement) => void;
    update: (options: TOptions) => void;
    getScene: () => ChartScene<TDatum, TXValue, TYValue> | undefined;
    destroy: () => void;
}
export declare function resolveChartAdapterLayout(options: ChartAdapterLayoutOptions): ChartAdapterLayout;
export declare function resolveChartHostTabIndex(definition: Pick<StaticChartDefinition, 'cursor' | 'focus' | 'keyboard'>, tabIndex?: number): number;
