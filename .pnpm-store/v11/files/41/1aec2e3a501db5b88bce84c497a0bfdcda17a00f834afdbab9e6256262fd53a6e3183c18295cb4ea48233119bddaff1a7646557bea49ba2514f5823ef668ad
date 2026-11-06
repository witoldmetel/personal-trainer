import type { ScenePolygon } from './types.js';
type ContourPoint = readonly number[];
type ContourRing = readonly ContourPoint[];
type ContourPolygon = readonly ContourRing[];
export type ContourLevelIdentity = readonly ['explicit', value: number, occurrence: number] | readonly ['generated', count: number, index: number];
export type ContourLevelMode = {
    readonly kind: 'explicit';
} | {
    readonly kind: 'generated';
    readonly count: number;
};
export interface IdentifiedContourLevel {
    readonly value: number;
    readonly identity: ContourLevelIdentity;
}
/** Validates a threshold count or returns a finite sorted copy of exact levels. */
export declare function normalizeContourThresholds(input: number | Iterable<number> | undefined, defaultCount: number, markName: string): number | readonly number[];
/** Assigns motion identity before any empty contour levels are removed. */
export declare function identifyContourLevels(levels: readonly number[], mode: ContourLevelMode): readonly IdentifiedContourLevel[];
/** Maps renderer-agnostic contour rings without introducing SVG path data. */
export declare function mapContourPolygons(coordinates: readonly ContourPolygon[], project?: (x: number, y: number) => readonly [number, number]): readonly ScenePolygon[];
export {};
