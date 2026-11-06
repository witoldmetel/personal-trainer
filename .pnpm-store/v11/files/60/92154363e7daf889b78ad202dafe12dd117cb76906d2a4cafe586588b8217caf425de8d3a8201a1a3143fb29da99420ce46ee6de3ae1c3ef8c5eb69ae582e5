import { LitElement } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import type { ChartValue } from '@tanstack/charts';
import type { ChartProps } from './types.js';
export declare class Chart<TDatum = unknown, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> extends LitElement {
    static properties: {
        options: {
            attribute: boolean;
        };
    };
    options: ChartProps<TDatum, TXValue, TYValue>;
    private adapter?;
    private activeRenderSvg?;
    private renderer?;
    private tooltipBodyTarget?;
    private idPrefix;
    private initialMarkup;
    private mounted;
    protected createRenderRoot(): this;
    protected willUpdate(changed: PropertyValues<this>): void;
    protected firstUpdated(): void;
    protected updated(changed: PropertyValues<this>): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected render(): TemplateResult<1> | undefined;
    private resolveRenderer;
    private readonly handleTooltipBodyChange;
    private renderTooltipBody;
    private clearTooltipBody;
    private mountAdapter;
}
export declare function defineChartElement(tagName?: string): void;
