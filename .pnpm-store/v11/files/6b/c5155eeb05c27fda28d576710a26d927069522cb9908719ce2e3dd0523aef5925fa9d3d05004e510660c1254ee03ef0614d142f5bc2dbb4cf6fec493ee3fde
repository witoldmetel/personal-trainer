import type { ChartKey } from './types.js';
export interface SpatialGroupedRow {
    readonly group: ChartKey | null;
}
export interface SpatialRowGroup<TRow> {
    readonly group: ChartKey | null;
    readonly identity: string;
    readonly rows: readonly TRow[];
}
/** Partitions spatial rows by canonical ChartKey identity and order. */
export declare function groupRowsByChartKey<TRow extends SpatialGroupedRow>(rows: readonly TRow[]): readonly SpatialRowGroup<TRow>[];
