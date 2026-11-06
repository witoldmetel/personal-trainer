import type { TransformValue } from './transform.js';
import type { Channel, ChartKey, ChartMark, ChartMarkMotionOptions, ChartMarkState, ChartRectStateStyle, VisualChannel } from './types.js';
import type { HierarchyRectangularNode } from 'd3-hierarchy';
export type TreemapMethod = 'squarify' | 'binary' | 'dice' | 'slice' | 'slice-dice';
export interface TreemapTileDatum<TDatum> {
    readonly id: string;
    readonly parentId: string | null;
    readonly name: string;
    readonly datum: TDatum | null;
    readonly sourceIndex: number | null;
}
/** A native D3-compatible tiler over the mark's private hierarchy copy. */
export type TreemapTile<TDatum = unknown> = (node: HierarchyRectangularNode<TreemapTileDatum<TDatum>>, x0: number, y0: number, x1: number, y1: number) => void;
export interface TreemapNode<TDatum> {
    readonly id: string;
    readonly parentId: string | null;
    readonly ancestorIds: readonly string[];
    readonly name: string;
    readonly data: TDatum | null;
    readonly depth: number;
    readonly height: number;
    readonly internal: boolean;
    readonly external: boolean;
    readonly value: number;
    readonly source: readonly TDatum[];
    readonly sourceIndexes: readonly number[];
}
export type TreemapNodeComparator<TDatum> = (left: TreemapNode<TDatum>, right: TreemapNode<TDatum>) => number;
interface TreemapSharedOptions<TDatum> extends ChartMarkMotionOptions<TreemapNode<TDatum>> {
    /** Mark identity. Explicit hierarchy identity uses `nodeId`. */
    readonly id?: string;
    readonly value: TransformValue<TDatum, number | null | undefined>;
    /** Built-in shorthand or a D3-compatible tiler. Defaults to `squarify`. */
    readonly method?: TreemapMethod | TreemapTile<TDatum>;
    /** Target squarify aspect ratio. Defaults to the golden ratio. */
    readonly ratio?: number;
    readonly round?: boolean;
    /** Pixel gap between adjacent children. Defaults to zero. */
    readonly paddingInner?: number;
    /** Pixel gap between parent edges and children. Defaults to zero. */
    readonly paddingOuter?: number;
    readonly sort?: TreemapNodeComparator<TDatum>;
    readonly color?: Channel<TreemapNode<TDatum>, ChartKey | null | undefined>;
    readonly fill?: VisualChannel<TreemapNode<TDatum>, string>;
    readonly fillOpacity?: number;
    readonly stroke?: VisualChannel<TreemapNode<TDatum>, string>;
    readonly strokeOpacity?: number;
    readonly strokeWidth?: number;
    readonly inset?: number;
    readonly radius?: number;
    readonly states?: readonly ChartMarkState<TreemapNode<TDatum>, ChartRectStateStyle<TreemapNode<TDatum>>>[];
    readonly label?: Channel<TreemapNode<TDatum>, string | number | null | undefined>;
    readonly labelFill?: VisualChannel<TreemapNode<TDatum>, string>;
    readonly labelFontSize?: number;
    readonly labelFontWeight?: number;
    /** Minimum painted pixels around an in-cell label. Defaults to 4. */
    readonly labelPadding?: number;
}
export type TreemapPathOptions<TDatum> = TreemapSharedOptions<TDatum> & {
    readonly path: TransformValue<TDatum, string>;
    readonly delimiter?: string;
    readonly nodeId?: never;
    readonly parentId?: never;
};
export type TreemapParentOptions<TDatum> = TreemapSharedOptions<TDatum> & {
    readonly nodeId: TransformValue<TDatum, string>;
    readonly parentId: TransformValue<TDatum, string | null | undefined>;
    readonly path?: never;
    readonly delimiter?: never;
};
export type TreemapOptions<TDatum> = TreemapPathOptions<TDatum> | TreemapParentOptions<TDatum>;
/** Lays out and renders hierarchy leaves in final plot-space pixels. */
export declare function treemap<TDatum, const TPath extends TransformValue<TDatum, string>>(source: Iterable<TDatum>, options: TreemapSharedOptions<TDatum> & {
    readonly path: TPath;
    readonly delimiter?: string;
    readonly nodeId?: never;
    readonly parentId?: never;
}): ChartMark<TreemapNode<TDatum>, string, number, never, never>;
export declare function treemap<TDatum, const TNodeId extends TransformValue<TDatum, string>, const TParentId extends TransformValue<TDatum, string | null | undefined>>(source: Iterable<TDatum>, options: TreemapSharedOptions<TDatum> & {
    readonly nodeId: TNodeId;
    readonly parentId: TParentId;
    readonly path?: never;
    readonly delimiter?: never;
}): ChartMark<TreemapNode<TDatum>, string, number, never, never>;
export {};
