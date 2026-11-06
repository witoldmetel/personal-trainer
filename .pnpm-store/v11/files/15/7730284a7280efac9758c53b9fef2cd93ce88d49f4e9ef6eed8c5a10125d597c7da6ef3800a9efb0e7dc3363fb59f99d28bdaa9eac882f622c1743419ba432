import * as React from 'react';
import type { ColorValue } from 'react-native';
import type { ChartPoint, ChartFocusSource, ChartScene, ChartTooltipContent, ChartTooltipExtensionToken, ChartTooltipOptions, ChartTooltipPlacement, ChartTooltipPosition, ChartValue } from '@tanstack/charts/types';
import { type NativePaintResolver } from './paint.js';
export interface NativeChartTooltipRenderContext<TDatum, TXValue extends ChartValue, TYValue extends ChartValue> {
    primaryPoint?: ChartPoint<TDatum, TXValue, TYValue>;
    points: readonly ChartPoint<TDatum, TXValue, TYValue>[];
    content: ChartTooltipContent | string;
    pinned: boolean;
    dismiss: () => void;
    defaultBody: React.ReactNode;
}
export interface NativeChartTooltipProps<TDatum, TXValue extends ChartValue, TYValue extends ChartValue> {
    scene: ChartScene<TDatum, TXValue, TYValue>;
    width: number;
    height: number;
    points: readonly ChartPoint<TDatum, TXValue, TYValue>[];
    pointer: ChartTooltipPosition | null;
    focusSource: ChartFocusSource;
    options?: ChartTooltipOptions<TDatum, TXValue, TYValue>;
    pinned: boolean;
    color: ColorValue;
    resolvePaint: NativePaintResolver;
    dismiss: () => void;
    render?: (context: NativeChartTooltipRenderContext<TDatum, TXValue, TYValue>) => React.ReactNode;
}
export declare function NativeChartTooltip<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>({ scene, width, height, points: unorderedPoints, pointer, focusSource, options, pinned, color, resolvePaint, dismiss, render, }: NativeChartTooltipProps<TDatum, TXValue, TYValue>): React.JSX.Element | null;
export type NativeChartTooltipComponent = typeof NativeChartTooltip;
export interface NativeChartTooltipExtension extends ChartTooltipExtensionToken<'react-native'> {
    readonly __chartExtensionType: 'tooltip';
    readonly __chartTooltipHost: 'react-native';
    create: () => NativeChartTooltipComponent;
}
export declare const tooltip: NativeChartTooltipExtension;
export declare function createNativeTooltipContent<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(points: readonly ChartPoint<TDatum, TXValue, TYValue>[], scene: ChartScene<TDatum, TXValue, TYValue>, pinned?: boolean, options?: ChartTooltipOptions<TDatum, TXValue, TYValue>, primaryPoint?: ChartPoint<TDatum, TXValue, TYValue>): ChartTooltipContent | string;
export declare function resolveNativeTooltipAnchor<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(point: ChartPoint<TDatum, TXValue, TYValue>, points: readonly ChartPoint<TDatum, TXValue, TYValue>[], scene: ChartScene<TDatum, TXValue, TYValue>, pointer: ChartTooltipPosition | null, focusSource: ChartFocusSource, pinned: boolean, options?: ChartTooltipOptions<TDatum, TXValue, TYValue>, focusPoints?: readonly ChartPoint<TDatum, TXValue, TYValue>[]): ChartTooltipPosition;
export declare function placeNativeTooltip(anchor: ChartTooltipPosition, tooltip: {
    width: number;
    height: number;
}, boundary: {
    width: number;
    height: number;
}, placement: 'auto' | ChartTooltipPlacement | readonly ChartTooltipPlacement[] | undefined, offset: number | undefined): {
    left: number;
    top: number;
    placement: ChartTooltipPlacement;
};
