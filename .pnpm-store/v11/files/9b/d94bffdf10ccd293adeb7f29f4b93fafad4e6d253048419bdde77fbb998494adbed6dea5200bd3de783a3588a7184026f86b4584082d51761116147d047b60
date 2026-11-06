import type { ChartPoint, ChartScene, SceneFocusGuide, SceneNode } from './types.js';
export { sceneChildId } from './scene-child-id-internal.js';
interface EmbedChartSceneOptions {
    ownerId: string;
    childId: string;
    x: number;
    y: number;
}
/**
 * Adopts a complete child chart scene inside another scene.
 *
 * Geometry remains local to the translated child group. Interaction points are
 * moved into the outer coordinate system and every point reference is remapped
 * to the same adopted object.
 */
export declare function embedChartScene<TDatum>(scene: ChartScene<TDatum>, options: EmbedChartSceneOptions): {
    nodes: readonly SceneNode[];
    points: readonly ChartPoint<TDatum>[];
    focusGuides: readonly SceneFocusGuide[];
};
