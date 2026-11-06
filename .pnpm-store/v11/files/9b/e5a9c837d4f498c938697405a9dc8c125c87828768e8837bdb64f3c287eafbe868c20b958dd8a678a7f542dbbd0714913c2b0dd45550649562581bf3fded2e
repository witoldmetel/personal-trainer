import type { TransformValue, TransformValueOutput } from './transform.js';
import type { ChartKey } from './types.js';
type ResolvedNetworkKey<TDatum, TValue> = Extract<TransformValueOutput<TDatum, TValue>, ChartKey>;
export interface NetworkGraphResolution<TNode, TLink, TNodeKey extends ChartKey = ChartKey, TSourceKey extends ChartKey = ChartKey, TTargetKey extends ChartKey = ChartKey> {
    readonly nodes: readonly TNode[];
    readonly links: readonly TLink[];
    readonly nodeKeys: readonly TNodeKey[];
    readonly sourceKeys: readonly TSourceKey[];
    readonly targetKeys: readonly TTargetKey[];
    readonly nodeIndexes: ReadonlyMap<ChartKey, number>;
}
/** Materializes and validates the shared identity boundary of a flat graph. */
export declare function resolveNetworkGraph<TNode, TLink, const TNodeKey extends TransformValue<TNode, ChartKey>, const TSource extends TransformValue<TLink, ChartKey>, const TTarget extends TransformValue<TLink, ChartKey>>(nodeSource: Iterable<TNode>, linkSource: Iterable<TLink>, options: {
    readonly nodeKey: TNodeKey;
    readonly source: TSource;
    readonly target: TTarget;
}, owner: string): NetworkGraphResolution<TNode, TLink, ResolvedNetworkKey<TNode, TNodeKey>, ResolvedNetworkKey<TLink, TSource>, ResolvedNetworkKey<TLink, TTarget>>;
export {};
