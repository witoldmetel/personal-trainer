import type { VNode, VNodeChild } from 'vue';
import type { ChartValue } from '@tanstack/charts';
import type { ChartProps, ChartTooltipBodySlotContext } from './types.js';
interface ChartComponent {
    <TDatum, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue>(props: ChartProps<TDatum, TXValue, TYValue>): VNode & {
        __ctx?: {
            slots: {
                tooltipBody?: (context: ChartTooltipBodySlotContext<TDatum, TXValue, TYValue>) => VNodeChild;
            };
        };
    };
}
export declare const Chart: ChartComponent;
export {};
