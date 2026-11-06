import type { ChartTextMeasurer, ChartTextTypography } from './types.js';
export interface DomTextMeasurer {
    measureText: ChartTextMeasurer;
    typography: () => ChartTextTypography;
    refresh: () => boolean;
    invalidate: () => void;
}
export declare function createDomTextMeasurer(container: HTMLElement): DomTextMeasurer;
