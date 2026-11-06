import type { DelaunayPosition } from './spatial-delaunay-internal.js';
import type { ChartBounds } from './types.js';
export interface VoronoiCellPolygon {
    readonly pointIndex: number;
    readonly points: readonly (readonly [number, number])[];
}
/**
 * Returns nondegenerate Voronoi cells clipped to positive final plot bounds.
 * Exact coincident sites share one cell; all other sites remain distinct.
 */
export declare function voronoiCellPolygons(positions: readonly DelaunayPosition[], bounds: ChartBounds): readonly VoronoiCellPolygon[];
