import type { ChartBounds, ChartTextMeasurer, SceneLabel, SceneNode, SceneStyle } from './types.js';
export interface ResolvedGuideRule {
    readonly style: SceneStyle;
}
export interface ResolvedGuideMarker {
    readonly radius: number;
    readonly style: SceneStyle;
}
export interface ResolvedGuideLabel {
    readonly text: string;
    readonly side?: 'start' | 'end';
    readonly offset?: number;
    readonly paddingX?: number;
    readonly paddingY?: number;
    readonly radius?: number;
    readonly fontSize?: number;
    readonly fontWeight?: number;
    readonly style: SceneStyle;
    readonly boxStyle: SceneStyle;
}
export interface GuideNodesOptions {
    readonly id: string;
    readonly classPrefix: string;
    readonly chart: ChartBounds;
    readonly x: number;
    readonly y: number;
    readonly xRule?: false | ResolvedGuideRule;
    readonly yRule?: false | ResolvedGuideRule;
    readonly marker?: false | ResolvedGuideMarker;
    readonly xLabel?: false | ResolvedGuideLabel;
    readonly yLabel?: false | ResolvedGuideLabel;
    readonly measureText?: ChartTextMeasurer;
}
/** Builds the shared renderer-neutral geometry for focus and free cursors. */
export declare function createGuideNodes(options: GuideNodesOptions): {
    readonly nodes: readonly SceneNode[];
    readonly labels: readonly SceneLabel[];
};
