import type { ChartBounds, ChartMargin, ChartTextMeasurer, ChartTextMeasureOptions, ChartTextMetrics, ChartTextTypography, SceneGroup, SceneLabel } from './types.js';
export interface GuideMarginOptions {
    inset?: number;
    measureText?: ChartTextMeasurer;
}
export declare function physicalTextAnchor(side: 'left' | 'middle' | 'right', direction: ChartTextMeasureOptions['direction'] | undefined): ChartTextMeasureOptions['anchor'];
export declare function logicalTextAnchorOffset(width: number, anchor: ChartTextMeasureOptions['anchor'], direction: ChartTextMeasureOptions['direction']): number;
export declare function estimateSceneText(text: string, style: ChartTextMeasureOptions): ChartTextMetrics;
export declare function measureSceneLabelBounds(label: SceneLabel, measureText?: ChartTextMeasurer): ChartBounds;
export declare function withChartTextTypography(measureText?: ChartTextMeasurer, typography?: ChartTextTypography): ChartTextMeasurer;
export declare function resolveGuideMargins(axes: SceneGroup, plot: ChartBounds, options?: GuideMarginOptions): ChartMargin;
export declare function includeGuideStrokeMargins(margin: ChartMargin, guides: SceneGroup, plot: ChartBounds): void;
