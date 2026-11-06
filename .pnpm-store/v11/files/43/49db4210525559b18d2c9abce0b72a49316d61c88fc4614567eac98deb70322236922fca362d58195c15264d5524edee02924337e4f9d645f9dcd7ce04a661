export interface SerializeChartSvgOptions {
    width?: number;
    height?: number;
    includeFocus?: boolean;
}
export interface RenderChartImageOptions extends SerializeChartSvgOptions {
    scale?: number;
    background?: string;
    type?: 'image/png' | 'image/jpeg' | 'image/webp';
    quality?: number;
}
export declare function serializeChartSvg(target: Element, options?: SerializeChartSvgOptions): string;
export declare function downloadChartSvg(target: Element, filename?: string, options?: SerializeChartSvgOptions): void;
export declare function renderChartImage(target: Element, options?: RenderChartImageOptions): Promise<Blob>;
export declare function downloadChartImage(target: Element, filename?: string, options?: RenderChartImageOptions): Promise<void>;
