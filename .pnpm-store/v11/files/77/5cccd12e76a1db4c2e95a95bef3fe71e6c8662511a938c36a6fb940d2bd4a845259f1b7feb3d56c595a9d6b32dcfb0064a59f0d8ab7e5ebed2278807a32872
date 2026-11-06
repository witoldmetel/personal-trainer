import type { ChartBounds, ChartPoint, ChartRollingPathMotion, ResolvedScale } from './types.js';
export interface RollingPathSnapshot {
    kind: 'polyline' | 'area';
    points: readonly ChartPoint[];
    geometry: readonly (readonly [number, number])[];
    chart: ChartBounds;
    yScale: ResolvedScale;
    viewportTranslate: Readonly<{
        x: number;
        y: number;
    }>;
    clipped: boolean;
    customPath: boolean;
}
export interface RollingPathTransform {
    x: number;
    yScale: number;
    y: number;
}
export type RollingPathInvalidReason = 'missing-clip' | 'plot-bounds-changed' | 'path-kind-changed' | 'transient-viewport' | 'custom-path' | 'missing-semantic-points' | 'unbalanced-batch' | 'unstable-keys' | 'noncontiguous-window' | 'semantic-value-changed' | 'nonuniform-x-shift' | 'fixed-y-changed' | 'non-affine-y' | 'insufficient-coverage';
export type RollingPathPlan = {
    kind: 'transform';
    transform: RollingPathTransform;
    batchSize: number;
} | {
    kind: 'fallback';
    fallback: 'snap' | 'morph';
    reason: RollingPathInvalidReason;
};
export declare function resolveRollingPathPlan(previous: RollingPathSnapshot, next: RollingPathSnapshot, options: ChartRollingPathMotion): RollingPathPlan;
