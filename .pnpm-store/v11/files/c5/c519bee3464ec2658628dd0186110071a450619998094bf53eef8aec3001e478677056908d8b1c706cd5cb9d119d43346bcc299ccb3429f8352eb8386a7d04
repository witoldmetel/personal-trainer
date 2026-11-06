import { Delaunay } from 'd3-delaunay';
import type { ChartKey } from './types.js';
export interface DelaunayPosition {
    readonly x: number;
    readonly y: number;
}
export interface DelaunayIdentityPosition extends DelaunayPosition {
    readonly key: ChartKey;
    readonly sourceIndex: number;
}
/** Orders topology inputs by stable identity and keeps one row per exact position. */
export declare function canonicalDelaunayPoints<TPoint extends DelaunayIdentityPosition>(points: readonly TPoint[]): readonly TPoint[];
export declare function createDelaunay<TPoint extends DelaunayPosition>(points: readonly TPoint[]): Delaunay<TPoint>;
/** Derives adjacency from triangle and hull edges. */
export declare function delaunayNeighborIndexes<TPoint extends DelaunayPosition>(delaunay: Delaunay<TPoint>, pointCount: number, includeDegenerateTriangles?: boolean): readonly (readonly number[])[];
/** Orders triangle-and-hull adjacency counterclockwise around each site. */
export declare function angularDelaunayNeighborIndexes<TPoint extends DelaunayPosition>(delaunay: Delaunay<TPoint>, pointCount: number, includeDegenerateTriangles?: boolean): readonly (readonly number[])[];
/** Returns each undirected neighbor pair once for final-screen positions. */
export declare function delaunayNeighborPairs(points: readonly DelaunayPosition[]): readonly (readonly [number, number])[];
