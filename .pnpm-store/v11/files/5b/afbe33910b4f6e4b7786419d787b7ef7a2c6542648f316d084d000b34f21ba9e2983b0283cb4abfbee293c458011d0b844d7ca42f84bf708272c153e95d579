import type { PolarLength, PolarMark } from './polar.js';
import type { TransformValue } from './transform.js';
import type { Channel, ChartKey, ChartMarkMotionOptions, VisualChannel } from './types.js';
export interface SunburstNode<TDatum> {
    readonly id: string;
    readonly parentId: string | null;
    readonly ancestorIds: readonly string[];
    readonly branchId: string | null;
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
export type SunburstNodeComparator<TDatum> = (left: SunburstNode<TDatum>, right: SunburstNode<TDatum>) => number;
interface SunburstSharedOptions<TDatum> extends ChartMarkMotionOptions<SunburstNode<TDatum>> {
    readonly id?: string;
    readonly className?: string;
    readonly value: TransformValue<TDatum, number | null | undefined>;
    readonly sort?: SunburstNodeComparator<TDatum>;
    /** Hierarchy node whose children form the first rendered ring. */
    readonly rootId?: string;
    /** Maximum descendant rings rendered below the active root. */
    readonly visibleDepth?: number;
    readonly innerRadius?: PolarLength;
    readonly outerRadius?: PolarLength;
    /** Fixed pixel gap between adjacent hierarchy rings. Defaults to zero. */
    readonly ringPadding?: number;
    readonly z?: Channel<SunburstNode<TDatum>, ChartKey | null | undefined>;
    readonly color?: Channel<SunburstNode<TDatum>, ChartKey | null | undefined>;
    readonly fill?: VisualChannel<SunburstNode<TDatum>, string>;
    readonly fillOpacity?: number;
    readonly stroke?: VisualChannel<SunburstNode<TDatum>, string>;
    readonly strokeOpacity?: number;
    readonly strokeWidth?: number;
    readonly strokeDasharray?: string;
    readonly opacity?: number;
}
export type SunburstPathOptions<TDatum> = SunburstSharedOptions<TDatum> & {
    readonly path: TransformValue<TDatum, string>;
    readonly delimiter?: string;
    readonly nodeId?: never;
    readonly parentId?: never;
};
export type SunburstParentOptions<TDatum> = SunburstSharedOptions<TDatum> & {
    readonly nodeId: TransformValue<TDatum, string>;
    readonly parentId: TransformValue<TDatum, string | null | undefined>;
    readonly path?: never;
    readonly delimiter?: never;
};
export type SunburstOptions<TDatum> = SunburstPathOptions<TDatum> | SunburstParentOptions<TDatum>;
/** Lays out and renders a flat hierarchy as responsive polar sectors. */
export declare function sunburst<TDatum, const TPath extends TransformValue<TDatum, string>>(source: Iterable<TDatum>, options: SunburstSharedOptions<TDatum> & {
    readonly path: TPath;
    readonly delimiter?: string;
    readonly nodeId?: never;
    readonly parentId?: never;
}): PolarMark<SunburstNode<TDatum>, number, number, never, never>;
export declare function sunburst<TDatum, const TNodeId extends TransformValue<TDatum, string>, const TParentId extends TransformValue<TDatum, string | null | undefined>>(source: Iterable<TDatum>, options: SunburstSharedOptions<TDatum> & {
    readonly nodeId: TNodeId;
    readonly parentId: TParentId;
    readonly path?: never;
    readonly delimiter?: never;
}): PolarMark<SunburstNode<TDatum>, number, number, never, never>;
export {};
