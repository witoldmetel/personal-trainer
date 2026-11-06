import * as React from 'react';
import { type ColorValue } from 'react-native';
import type { Linejoin, SvgProps } from 'react-native-svg';
import type { ChartFocusPresentation, ChartScene, ChartTextTypography, SceneNode, SceneStyle } from '@tanstack/charts/types';
import type { NativePaintResolver } from './paint.js';
export interface NativeChartSceneProps {
    scene: ChartScene;
    color: ColorValue;
    fontFamily?: string;
    fontStyle?: SvgProps['fontStyle'];
    fontStretch?: SvgProps['fontStretch'];
    letterSpacing?: number;
    direction?: ChartTextTypography['direction'];
    fontScale?: number;
    idPrefix: string;
    resolvePaint: NativePaintResolver;
    focusFill?: ColorValue;
    focusPresentation?: ChartFocusPresentation;
}
export interface NativeChartSceneNodesProps extends NativeChartSceneProps {
    nodes: readonly SceneNode[];
}
export declare function NativeChartSceneNodes({ scene, nodes, color, focusFill, direction, fontScale, idPrefix, resolvePaint, }: NativeChartSceneNodesProps): React.JSX.Element;
export declare const NativeChartScene: React.MemoExoticComponent<({ scene, color, fontFamily, fontStyle, fontStretch, letterSpacing, direction, fontScale, idPrefix, resolvePaint, focusFill, focusPresentation, }: NativeChartSceneProps) => React.JSX.Element>;
export declare function resolveNativeLineJoin(lineJoin: SceneStyle['lineJoin']): Linejoin | undefined;
