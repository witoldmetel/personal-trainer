import type { RenderChartSvgOptions, SceneGroup, SceneNode } from './types.js';
export type SvgRenderChildren = (group: SceneGroup) => readonly SceneNode[] | undefined;
export declare function svgRenderChildren(options: RenderChartSvgOptions): SvgRenderChildren | undefined;
/** Keep renderer-local presentation out of the public scene and options. */
export declare function withSvgRenderChildren<T>(options: RenderChartSvgOptions, children: SvgRenderChildren, render: () => T): T;
