import type { TransformValue } from './transform.js';
export type TreeOrientation = 'left' | 'right' | 'top' | 'bottom';
export interface TreeNodeContext<TDatum> {
    readonly id: string;
    readonly parentId: string | null;
    readonly name: string;
    readonly data: TDatum | null;
    readonly depth: number;
    readonly height: number;
    readonly internal: boolean;
    readonly external: boolean;
    readonly source: readonly TDatum[];
    readonly sourceIndexes: readonly number[];
}
export type TreeNodeComparator<TDatum> = (left: TreeNodeContext<TDatum>, right: TreeNodeContext<TDatum>) => number;
export type TreeNodeSeparation<TDatum> = (left: TreeNodeContext<TDatum>, right: TreeNodeContext<TDatum>) => number;
interface TreeLayoutSharedOptions<TDatum> {
    /** Root anchor and growth direction. Defaults to `left`. */
    readonly orientation?: TreeOrientation;
    /** D3 tidy-tree spacing as `[breadth, depth]`. Defaults to `[1, 1]`. */
    readonly nodeSize?: readonly [number, number];
    readonly sort?: TreeNodeComparator<TDatum>;
    readonly separation?: TreeNodeSeparation<TDatum>;
}
export type TreeLayoutPathOptions<TDatum> = TreeLayoutSharedOptions<TDatum> & {
    readonly path: TransformValue<TDatum, string>;
    readonly delimiter?: string;
    readonly id?: never;
    readonly parentId?: never;
};
export type TreeLayoutParentOptions<TDatum> = TreeLayoutSharedOptions<TDatum> & {
    readonly id: TransformValue<TDatum, string>;
    readonly parentId: TransformValue<TDatum, string | null | undefined>;
    readonly path?: never;
    readonly delimiter?: never;
};
export type TreeLayoutOptions<TDatum> = TreeLayoutPathOptions<TDatum> | TreeLayoutParentOptions<TDatum>;
export interface TreeLayoutNode<TDatum> extends TreeNodeContext<TDatum> {
    readonly x: number;
    readonly y: number;
}
export interface TreeLayoutLink<TDatum> {
    /** A tree node has at most one incoming link, so its target id is the link id. */
    readonly id: string;
    readonly source: string;
    readonly target: string;
    readonly data: TDatum | null;
    readonly sourceNode: TreeLayoutNode<TDatum>;
    readonly targetNode: TreeLayoutNode<TDatum>;
    readonly sourceIndex: number | null;
    readonly targetIndex: number | null;
    /** The link represents its target node and carries that node's raw-row lineage. */
    readonly sourceRows: readonly TDatum[];
    readonly sourceIndexes: readonly number[];
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
}
export interface TreeLayoutResult<TDatum> {
    readonly nodes: readonly TreeLayoutNode<TDatum>[];
    readonly links: readonly TreeLayoutLink<TDatum>[];
}
/** Computes a deterministic tidy-tree layout in semantic data-space units. */
export declare function treeLayout<TDatum, const TPath extends TransformValue<TDatum, string>>(source: Iterable<TDatum>, options: TreeLayoutSharedOptions<TDatum> & {
    readonly path: TPath;
    readonly delimiter?: string;
    readonly id?: never;
    readonly parentId?: never;
}): TreeLayoutResult<TDatum>;
export declare function treeLayout<TDatum, const TId extends TransformValue<TDatum, string>, const TParentId extends TransformValue<TDatum, string | null | undefined>>(source: Iterable<TDatum>, options: TreeLayoutSharedOptions<TDatum> & {
    readonly id: TId;
    readonly parentId: TParentId;
    readonly path?: never;
    readonly delimiter?: never;
}): TreeLayoutResult<TDatum>;
export {};
