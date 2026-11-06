import type { ChartScene, RenderChartSvgOptions, SceneGroup, SceneNode } from './types.js';
import { type SvgRenderChildren } from './svg-render-context-internal.js';
export interface ChartSvgRenderHooks {
    renderDefinitions?: (scene: ChartScene, idPrefix: string) => string;
    renderGroup?: (node: SceneGroup, idPrefix: string) => {
        attributes: string;
        content: string;
    } | undefined;
    resolvePaint?: (value: string, idPrefix: string) => string;
}
export declare function renderChartSvgWithHooks(scene: ChartScene, options: RenderChartSvgOptions, hooks?: ChartSvgRenderHooks): string;
export declare function renderSceneNodes(nodes: readonly SceneNode[], idPrefix?: string, hooks?: ChartSvgRenderHooks, children?: SvgRenderChildren): string;
export declare function renderFocusGuideLayer(nodes: readonly SceneNode[], placement: 'under' | 'over', idPrefix?: string, hooks?: ChartSvgRenderHooks): string;
export declare function renderSvgClip(node: SceneGroup, idPrefix: string): {
    attributes: string;
    content: string;
} | undefined;
