import * as React from 'react';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import type { ChartDefinition, ChartPoint, ChartScene, ChartTextMeasurer, ChartTextTypography, ChartTooltipInput, ChartValue } from '@tanstack/charts/types';
import { type NativePaintResolver } from './paint.js';
import type { NativeChartTooltipRenderContext } from './Tooltip.js';
export interface NativeChartRenderContext<TDatum, TXValue extends ChartValue, TYValue extends ChartValue> {
    scene: ChartScene<TDatum, TXValue, TYValue>;
}
export interface ChartProps<TDatum = unknown, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue, TDefinition extends ChartDefinition<TDatum, TXValue, TYValue> = ChartDefinition<TDatum, TXValue, TYValue>> {
    definition: TDefinition & NativeTooltipCompatibility<TDefinition>;
    accessibilityLabel: string;
    accessibilityHint?: string;
    width?: number;
    height?: number;
    aspectRatio?: number;
    style?: StyleProp<ViewStyle>;
    color?: ColorValue;
    focusFill?: ColorValue;
    fontFamily?: string;
    fontStyle?: SvgProps['fontStyle'];
    fontStretch?: SvgProps['fontStretch'];
    letterSpacing?: number;
    direction?: ChartTextTypography['direction'];
    locale?: string;
    fontScale?: number;
    idPrefix?: string;
    testID?: string;
    measureText?: ChartTextMeasurer;
    resolvePaint?: NativePaintResolver;
    onFocusChange?: (point: ChartPoint<TDatum, TXValue, TYValue> | null) => void;
    onFocusGroupChange?: (points: readonly ChartPoint<TDatum, TXValue, TYValue>[]) => void;
    onSelect?: (point: ChartPoint<TDatum, TXValue, TYValue> | null) => void;
    onRender?: (context: NativeChartRenderContext<TDatum, TXValue, TYValue>) => void;
    renderTooltip?: (context: NativeChartTooltipRenderContext<TDatum, TXValue, TYValue>) => React.ReactNode;
}
type DefinitionDatum<TDefinition> = TDefinition extends {
    readonly __datum?: infer TDatum;
} ? TDatum : unknown;
type DefinitionXValue<TDefinition> = TDefinition extends {
    readonly __xValue?: infer TXValue extends ChartValue;
} ? TXValue : ChartValue;
type DefinitionYValue<TDefinition> = TDefinition extends {
    readonly __yValue?: infer TYValue extends ChartValue;
} ? TYValue : ChartValue;
export declare function Chart<const TDefinition extends ChartDefinition<any, any, any>>(props: ChartProps<DefinitionDatum<TDefinition>, DefinitionXValue<TDefinition>, DefinitionYValue<TDefinition>, TDefinition>): React.JSX.Element;
type NativeTooltipCompatibility<TDefinition> = TDefinition extends {
    tooltip: infer TTooltip;
} ? TTooltip extends false | ChartTooltipInput<any, any, any, 'react-native'> ? unknown : never : unknown;
export {};
