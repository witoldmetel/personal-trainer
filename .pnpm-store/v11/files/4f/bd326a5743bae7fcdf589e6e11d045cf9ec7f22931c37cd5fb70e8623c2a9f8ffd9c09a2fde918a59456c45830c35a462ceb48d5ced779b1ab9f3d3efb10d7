import type { TransformLineage, TransformValue, TransformValueOutput } from './transform.js';
import type { ChartKey } from './types.js';
import type { Force, SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';
export type ForceNumericValue<TDatum> = number | TransformValue<TDatum, number>;
export interface ForceLinkDescriptor<TLink> {
    readonly type: 'link';
    readonly distance?: ForceNumericValue<TLink>;
    readonly strength?: ForceNumericValue<TLink>;
}
export interface ForceManyBodyDescriptor<TNode> {
    readonly type: 'manyBody';
    readonly strength?: ForceNumericValue<TNode>;
}
export interface ForceCenterDescriptor {
    readonly type: 'center';
    readonly x?: number;
    readonly y?: number;
}
export interface ForceCollideDescriptor<TNode> {
    readonly type: 'collide';
    readonly radius?: ForceNumericValue<TNode>;
    readonly strength?: number;
}
export interface ForceXDescriptor<TNode> {
    readonly type: 'x';
    readonly x?: ForceNumericValue<TNode>;
    readonly strength?: ForceNumericValue<TNode>;
}
export interface ForceYDescriptor<TNode> {
    readonly type: 'y';
    readonly y?: ForceNumericValue<TNode>;
    readonly strength?: ForceNumericValue<TNode>;
}
/** A private node clone initialized and mutated only by the D3 simulation. */
export type ForceLayoutWorkingNode<TNode extends object> = Omit<TNode, keyof SimulationNodeDatum> & SimulationNodeDatum;
/** A private link clone whose endpoints may be resolved by a D3 link force. */
export type ForceLayoutWorkingLink<TNode extends object, TLink extends object> = Omit<TLink, keyof SimulationLinkDatum<ForceLayoutWorkingNode<TNode>>> & SimulationLinkDatum<ForceLayoutWorkingNode<TNode>>;
export interface ForceFactoryContext<TNode extends object, TLink extends object, TNodeKey extends ChartKey = ChartKey> {
    readonly nodes: ForceLayoutWorkingNode<TNode>[];
    readonly links: ForceLayoutWorkingLink<TNode, TLink>[];
    readonly nodeKeys: readonly TNodeKey[];
    readonly sourceKeys: readonly ChartKey[];
    readonly targetKeys: readonly ChartKey[];
    readonly nodeKey: (node: ForceLayoutWorkingNode<TNode>, index: number) => TNodeKey;
}
export type ForceFactory<TNode extends object, TLink extends object, TNodeKey extends ChartKey = ChartKey> = (context: ForceFactoryContext<TNode, TLink, TNodeKey>) => Force<ForceLayoutWorkingNode<TNode>, ForceLayoutWorkingLink<TNode, TLink>>;
export interface ForceFactoryDescriptor<TNode extends object, TLink extends object, TNodeKey extends ChartKey = ChartKey> {
    readonly type: 'custom';
    readonly name: string;
    readonly create: ForceFactory<TNode, TLink, TNodeKey>;
}
export type ForceDescriptor<TNode extends object, TLink extends object, TNodeKey extends ChartKey = ChartKey> = ForceLinkDescriptor<TLink> | ForceManyBodyDescriptor<TNode> | ForceCenterDescriptor | ForceCollideDescriptor<TNode> | ForceXDescriptor<TNode> | ForceYDescriptor<TNode> | ForceFactoryDescriptor<TNode, TLink, TNodeKey>;
export interface ForceLayoutOptions<TNode extends object, TLink extends object, TNodeKey extends TransformValue<TNode, ChartKey> = TransformValue<TNode, ChartKey>, TSource extends TransformValue<TLink, ChartKey> = TransformValue<TLink, ChartKey>, TTarget extends TransformValue<TLink, ChartKey> = TransformValue<TLink, ChartKey>> {
    readonly nodeKey: TNodeKey;
    readonly source: TSource;
    readonly target: TTarget;
    /** Number of synchronous simulation ticks. Defaults to D3's natural 300. */
    readonly iterations?: number;
    /** Fraction of each positional span added to both domain ends. Defaults to 0.2. */
    readonly domainPadding?: number;
    /** Forces are initialized and applied in authored order. */
    readonly forces: readonly ForceDescriptor<TNode, TLink, Extract<TransformValueOutput<TNode, TNodeKey>, ChartKey>>[];
}
export type ForceLayoutNode<TNode> = Omit<TNode, keyof TransformLineage<TNode> | 'x' | 'y' | 'vx' | 'vy'> & TransformLineage<TNode> & {
    readonly x: number;
    readonly y: number;
    readonly vx: number;
    readonly vy: number;
};
/**
 * Link lineage uses `sourceRows` because `source` remains the raw graph endpoint.
 * This is the deliberate exception to the ordinary `TransformLineage` field name.
 */
export interface ForceLinkLineage<TLink> {
    readonly sourceRows: readonly TLink[];
    readonly sourceIndexes: readonly number[];
}
type ForceLinkDerivedFields = keyof ForceLinkLineage<unknown> | 'source' | 'target' | 'sourceNode' | 'targetNode' | 'sourceIndex' | 'targetIndex' | 'sourceKey' | 'targetKey' | 'x1' | 'y1' | 'x2' | 'y2';
export type ForceLayoutLink<TNode, TLink, TSourceKey extends ChartKey = ChartKey, TTargetKey extends ChartKey = ChartKey> = Omit<TLink, ForceLinkDerivedFields> & ForceLinkLineage<TLink> & {
    /** Raw source identifier, preserved after D3 resolves its private clone. */
    readonly source: TSourceKey;
    /** Raw target identifier, preserved after D3 resolves its private clone. */
    readonly target: TTargetKey;
    readonly sourceKey: TSourceKey;
    readonly targetKey: TTargetKey;
    readonly sourceIndex: number;
    readonly targetIndex: number;
    readonly sourceNode: ForceLayoutNode<TNode>;
    readonly targetNode: ForceLayoutNode<TNode>;
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
};
export interface ForceLayoutResult<TNode, TLink, TSourceKey extends ChartKey = ChartKey, TTargetKey extends ChartKey = ChartKey> {
    readonly nodes: readonly ForceLayoutNode<TNode>[];
    readonly links: readonly ForceLayoutLink<TNode, TLink, TSourceKey, TTargetKey>[];
    readonly xDomain: readonly [number, number];
    readonly yDomain: readonly [number, number];
}
type EndpointKey<TDatum, TValue> = Extract<TransformValueOutput<TDatum, TValue>, ChartKey>;
/** Settles a deterministic, synchronous D3 force simulation over private clones. */
export declare function forceLayout<TNode extends object, TLink extends object, const TNodeKey extends TransformValue<TNode, ChartKey>, const TSource extends TransformValue<TLink, ChartKey>, const TTarget extends TransformValue<TLink, ChartKey>>(nodes: Iterable<TNode>, links: Iterable<TLink>, options: ForceLayoutOptions<NoInfer<TNode>, NoInfer<TLink>, TNodeKey, TSource, TTarget>): ForceLayoutResult<TNode, TLink, EndpointKey<TLink, TSource>, EndpointKey<TLink, TTarget>>;
export {};
