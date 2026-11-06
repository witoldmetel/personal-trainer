import type { ChartTooltipPlacement, ChartTooltipPosition } from './types.js';
export interface TooltipBounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export interface TooltipSize {
    width: number;
    height: number;
}
/** Resolves host-local tooltip placement without reading the DOM. */
export declare function resolveChartTooltipPlacement(anchor: ChartTooltipPosition, tooltip: TooltipSize, boundary: TooltipBounds, placement: 'auto' | ChartTooltipPlacement | readonly ChartTooltipPlacement[] | undefined, offset: number | undefined): {
    left: number;
    top: number;
    placement: ChartTooltipPlacement;
};
