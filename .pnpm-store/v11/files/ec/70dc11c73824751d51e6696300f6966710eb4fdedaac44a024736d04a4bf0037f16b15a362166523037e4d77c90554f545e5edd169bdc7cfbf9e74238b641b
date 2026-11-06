import type { TransformValue } from './transform.js';
import type { HierarchyNode } from 'd3-hierarchy';
export interface FlatHierarchyDatum<TDatum> {
    readonly id: string;
    readonly parentId: string | null;
    readonly name: string;
    readonly datum: TDatum | null;
    readonly sourceIndex: number | null;
}
export type FlatHierarchyNode<TDatum> = HierarchyNode<FlatHierarchyDatum<TDatum>> & {
    readonly id: string;
};
export interface FlatHierarchy<TDatum> {
    readonly data: readonly TDatum[];
    readonly root: FlatHierarchyNode<TDatum>;
}
export interface FlatHierarchyNodeContext<TDatum> {
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
export interface FlatHierarchyPathOptions<TDatum> {
    readonly path: TransformValue<TDatum, string>;
    readonly delimiter?: string;
    readonly id?: never;
    readonly parentId?: never;
}
export interface FlatHierarchyParentOptions<TDatum> {
    readonly id: TransformValue<TDatum, string>;
    readonly parentId: TransformValue<TDatum, string | null | undefined>;
    readonly path?: never;
    readonly delimiter?: never;
}
export type FlatHierarchyOptions<TDatum> = FlatHierarchyPathOptions<TDatum> | FlatHierarchyParentOptions<TDatum>;
/** Builds a private D3 hierarchy while retaining honest raw-row lineage. */
export declare function buildFlatHierarchy<TDatum>(source: Iterable<TDatum>, options: FlatHierarchyOptions<TDatum>, owner: string): FlatHierarchy<TDatum>;
/** Materializes the hierarchy metadata shared by public hierarchy layouts. */
export declare function flatHierarchyNodeContext<TDatum>(node: FlatHierarchyNode<TDatum>): FlatHierarchyNodeContext<TDatum>;
/** Aggregates nonnegative source values without expanding node lineage. */
export declare function aggregateFlatHierarchyValues<TDatum>(hierarchy: FlatHierarchy<TDatum>, value: TransformValue<TDatum, number | null | undefined>, owner: string): void;
/** Returns root-to-parent ids for a hierarchy node. */
export declare function flatHierarchyAncestorIds<TDatum>(node: FlatHierarchyNode<TDatum>): readonly string[];
/** Returns the depth-one branch containing a node, or null for the root. */
export declare function flatHierarchyBranchId<TDatum>(node: FlatHierarchyNode<TDatum>): string | null;
export declare function flatHierarchyNodeValue<TDatum>(node: FlatHierarchyNode<TDatum>): number;
