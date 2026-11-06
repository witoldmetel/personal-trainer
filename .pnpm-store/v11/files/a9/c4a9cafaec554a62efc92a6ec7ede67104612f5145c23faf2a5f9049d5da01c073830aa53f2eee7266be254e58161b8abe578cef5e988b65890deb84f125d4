import type { ChartHostOptions, ChartTooltipBodyContext, ChartValue } from '@tanstack/charts';
export type AlpineChartTooltipBody = Node | string | number | null | undefined | readonly AlpineChartTooltipBody[];
export interface ChartTooltipBodyRenderContext<TDatum = unknown, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> extends ChartTooltipBodyContext<TDatum, TXValue, TYValue> {
    defaultBody: DocumentFragment;
}
export type ChartOptions<TDatum = unknown, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> = ChartHostOptions<TDatum, TXValue, TYValue> & {
    renderTooltipBody?: (context: ChartTooltipBodyRenderContext<TDatum, TXValue, TYValue>) => AlpineChartTooltipBody;
};
interface AlpineDirectiveUtilities {
    evaluateLater: (expression: string) => (receiver: (value: unknown) => void) => void;
    effect: (callback: () => void) => void;
    cleanup: (callback: () => void) => void;
}
interface AlpineLike {
    directive: (name: string, callback: (element: HTMLElement, directive: {
        expression: string;
    }, utilities: AlpineDirectiveUtilities) => void) => void;
}
export declare function charts(Alpine: AlpineLike): void;
export type { DomChartDefinition as ChartDefinition, ChartPoint, } from '@tanstack/charts';
