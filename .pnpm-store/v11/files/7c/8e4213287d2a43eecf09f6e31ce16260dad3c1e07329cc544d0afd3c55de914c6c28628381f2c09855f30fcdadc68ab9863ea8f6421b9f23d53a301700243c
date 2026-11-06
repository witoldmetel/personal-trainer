import type { ChartCursorPresentation, ChartFocusAnchor, ChartFocusPresentation, ChartFocusState, ChartScene, ChartTooltipPosition, SceneGroup, SceneNode } from './types.js';
export interface ResolvedFocusScene<TScene extends ChartScene = ChartScene> {
    scene: TScene;
    retargeted: boolean;
}
export declare function resolveFocusPresentation(scene: ChartScene, focus: ChartFocusState | null, pointer?: ChartTooltipPosition | null, cursor?: ChartCursorPresentation | null): ChartFocusPresentation;
/** Resolves only renderer-native guide marks, excluding authored focus layers. */
export declare function resolveFocusGuides(scene: ChartScene, focus: ChartFocusState | null, pointer?: ChartTooltipPosition | null, cursor?: ChartCursorPresentation | null): ChartFocusPresentation;
/** Resolves retargeting focus candidates into stable selected scene children. */
export declare function resolveFocusScene<TScene extends ChartScene>(scene: TScene, focus: ChartFocusState | null): ResolvedFocusScene<TScene>;
export declare function focusedSceneNodes(scene: ChartScene, focus: ChartFocusState | null, placement: 'under' | 'over'): SceneNode[];
export declare function focusedNodeKeys(layer: SceneGroup, focus: ChartFocusState | null): Set<string>;
export declare function selectedFocusChildren(layer: SceneGroup, focus: ChartFocusState): readonly SceneNode[];
export declare function matchesFocusAnchor(candidate: ChartFocusAnchor, focus: ChartFocusState, match: NonNullable<SceneGroup['focus']>['match']): boolean;
