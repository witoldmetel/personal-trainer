import type { ChartPoint, SceneNode } from './types.js';
export interface ScenePointLookup {
    points: readonly ChartPoint[];
    keys: ReadonlyMap<string, readonly ChartPoint[]>;
    marks: ReadonlyMap<string, readonly ChartPoint[]>;
}
/** Indexes structural point identity without treating opaque keys as prefixes. */
export declare function createScenePointLookup(points: readonly ChartPoint[]): ScenePointLookup;
/** Returns the semantic points explicitly or structurally owned by one node. */
export declare function sceneNodeOwnedPoints(node: SceneNode, scope: readonly ChartPoint[], lookup: ScenePointLookup, fallback?: readonly ChartPoint[]): readonly ChartPoint[];
export declare function sceneKeyOwnedPoints(key: string, scope: readonly ChartPoint[], lookup: ScenePointLookup, fallback?: readonly ChartPoint[]): readonly ChartPoint[];
