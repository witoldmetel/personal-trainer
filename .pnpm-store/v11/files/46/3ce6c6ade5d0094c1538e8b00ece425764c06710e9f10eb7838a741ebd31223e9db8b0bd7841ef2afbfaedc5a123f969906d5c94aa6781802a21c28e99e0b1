import type { SankeyNode as D3SankeyNode } from 'd3-sankey';
import type { TransformValue, TransformValueOutput } from './transform.js';
import type { ChartBounds, ChartKey, ChartMark, ChartMarkDatum, ChartMarkPointX, ChartMarkPointY, ChartMarkMotionOptions } from './types.js';
type AnyChartMark = ChartMark<any, any, any, any, any>;
type SankeyMarks = readonly [AnyChartMark, ...AnyChartMark[]];
type ResolvedKey<TDatum, TValue> = Extract<TransformValueOutput<TDatum, TValue>, ChartKey>;
export type SankeyAlignment = 'left' | 'right' | 'center' | 'justify';
type SankeyAlignmentNodeDatum<TNode extends object, TNodeKey extends ChartKey> = {
    readonly data: TNode;
    readonly key: TNodeKey;
    readonly sourceIndex: number;
};
type SankeyAlignmentLinkDatum<TLink extends object> = {
    readonly data: TLink;
    readonly key: ChartKey;
    readonly sourceIndex: number;
};
/** The private D3 node supplied to a custom alignment callable. */
export type SankeyAlignmentNode<TNode extends object, TLink extends object, TNodeKey extends ChartKey = ChartKey> = D3SankeyNode<SankeyAlignmentNodeDatum<TNode, TNodeKey>, SankeyAlignmentLinkDatum<TLink>>;
/** A native D3-compatible horizontal node-layer aligner. */
export type SankeyNodeAligner<TNode extends object, TLink extends object, TNodeKey extends ChartKey = ChartKey> = (node: SankeyAlignmentNode<TNode, TLink, TNodeKey>, columnCount: number) => number;
export interface SankeyInset {
    readonly top?: number;
    readonly right?: number;
    readonly bottom?: number;
    readonly left?: number;
}
export type SankeyLayoutValue<TValue> = TValue | ((chart: ChartBounds) => TValue);
export interface SankeyEndpointContext<TNode, TNodeKey extends ChartKey = ChartKey> {
    readonly kind: 'node';
    readonly key: TNodeKey;
    readonly data: TNode;
    readonly source: readonly TNode[];
    readonly sourceIndexes: readonly number[];
    readonly index: number;
}
export interface SankeyNodeContext<TNode, TNodeKey extends ChartKey = ChartKey> extends SankeyEndpointContext<TNode, TNodeKey> {
    readonly depth: number;
    readonly height: number;
    readonly value: number;
}
export interface SankeyLinkContext<TNode, TLink, TNodeKey extends ChartKey = ChartKey> {
    readonly kind: 'link';
    readonly key: ChartKey;
    readonly data: TLink;
    readonly sourceRows: readonly TLink[];
    readonly sourceIndexes: readonly number[];
    readonly source: TNodeKey;
    readonly target: TNodeKey;
    readonly sourceKey: TNodeKey;
    readonly targetKey: TNodeKey;
    readonly sourceIndex: number;
    readonly targetIndex: number;
    readonly sourceNode: SankeyEndpointContext<TNode, TNodeKey>;
    readonly targetNode: SankeyEndpointContext<TNode, TNodeKey>;
    readonly value: number;
}
export interface SankeyNode<TNode, TLink, TNodeKey extends ChartKey = ChartKey> extends SankeyNodeContext<TNode, TNodeKey> {
    readonly layer: number;
    readonly x0: number;
    readonly x1: number;
    readonly y0: number;
    readonly y1: number;
    readonly x: number;
    readonly y: number;
    readonly incomingLinks: readonly SankeyLink<TNode, TLink, TNodeKey>[];
    readonly outgoingLinks: readonly SankeyLink<TNode, TLink, TNodeKey>[];
}
export interface SankeyLink<TNode, TLink, TNodeKey extends ChartKey = ChartKey> extends Omit<SankeyLinkContext<TNode, TLink, TNodeKey>, 'sourceNode' | 'targetNode'> {
    readonly sourceNode: SankeyNode<TNode, TLink, TNodeKey>;
    readonly targetNode: SankeyNode<TNode, TLink, TNodeKey>;
    readonly width: number;
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
}
export interface SankeyDiagramContext<TNode, TLink, TNodeKey extends ChartKey = ChartKey> {
    readonly id: string;
    readonly chart: ChartBounds;
    readonly nodes: readonly SankeyNode<TNode, TLink, TNodeKey>[];
    readonly links: readonly SankeyLink<TNode, TLink, TNodeKey>[];
}
export type SankeyNodeComparator<TNode, TNodeKey extends ChartKey = ChartKey> = (left: SankeyNodeContext<TNode, TNodeKey>, right: SankeyNodeContext<TNode, TNodeKey>) => number;
export type SankeyLinkComparator<TNode, TLink, TNodeKey extends ChartKey = ChartKey> = (left: SankeyLinkContext<TNode, TLink, TNodeKey>, right: SankeyLinkContext<TNode, TLink, TNodeKey>) => number;
export interface SankeyDiagramOptions<TNode extends object, TLink extends object, TNodeKey extends TransformValue<TNode, ChartKey>, TSource extends TransformValue<TLink, ChartKey>, TTarget extends TransformValue<TLink, ChartKey>, TValue extends TransformValue<TLink, number>, TMarks extends SankeyMarks> extends ChartMarkMotionOptions<ChartMarkDatum<TMarks[number]>> {
    readonly id?: string;
    readonly nodes: Iterable<TNode>;
    readonly links: Iterable<TLink>;
    readonly nodeKey: TNodeKey;
    readonly source: TSource;
    readonly target: TTarget;
    readonly value: TValue;
    readonly linkKey?: TransformValue<TLink, ChartKey>;
    /** Built-in shorthand or D3-compatible node aligner. Defaults to `justify`. */
    readonly align?: SankeyAlignment | SankeyNodeAligner<TNode, TLink, ResolvedKey<TNode, TNodeKey>>;
    /** `undefined` lets the layout order nodes; `null` preserves input order. */
    readonly nodeSort?: SankeyNodeComparator<TNode, ResolvedKey<TNode, TNodeKey>> | null;
    /** `undefined` lets the layout order links; `null` preserves input order. */
    readonly linkSort?: SankeyLinkComparator<TNode, TLink, ResolvedKey<TNode, TNodeKey>> | null;
    /** Node width in final pixels. Defaults to 24. */
    readonly nodeWidth?: SankeyLayoutValue<number>;
    /** Same-column node separation in final pixels. Defaults to 8. */
    readonly nodePadding?: SankeyLayoutValue<number>;
    /** Final-pixel inset from the resolved plot bounds. Defaults to zero. */
    readonly inset?: SankeyLayoutValue<number | SankeyInset>;
    /** Number of relaxation passes. Defaults to D3 Sankey's 6. */
    readonly iterations?: number;
    /** Ordinary marks over immutable final-pixel node and link rows. */
    readonly marks: (context: SankeyDiagramContext<TNode, TLink, ResolvedKey<TNode, TNodeKey>>) => TMarks;
}
/** Resolves a proportional flow layout, then composes ordinary pixel marks. */
export declare function sankeyDiagram<TNode extends object, TLink extends object, const TNodeKey extends TransformValue<TNode, ChartKey>, const TSource extends TransformValue<TLink, ChartKey>, const TTarget extends TransformValue<TLink, ChartKey>, const TValue extends TransformValue<TLink, number>, const TMarks extends SankeyMarks>(options: SankeyDiagramOptions<TNode, TLink, TNodeKey, TSource, TTarget, TValue, TMarks>): ChartMark<ChartMarkDatum<TMarks[number]>, ChartMarkPointX<TMarks[number]>, ChartMarkPointY<TMarks[number]>, never, never>;
export {};
