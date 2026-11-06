import { fill, grid, inset, layer } from './view-layout.js';
import type { ChartBuildContext, ChartTheme, ChartValue, ResponsiveChartDefinition, StaticChartDefinition } from './types.js';
import type { ViewAnchor, ViewGridCell, ViewInsetOptions, ViewLayout, ViewLayoutPlaced, ViewLayoutReferenced, ViewTrack } from './view-layout.js';
export { fill, grid, inset, layer };
export type { ViewAnchor, ViewGridCell, ViewInsetOptions, ViewLayout, ViewTrack, };
type EmbeddedHostOption = 'maxFocusDistance' | 'focus' | 'focusRing' | 'cursor' | 'spatialIndex' | 'svgAnimation' | 'keyboard' | 'pointer' | 'selection' | 'controls' | 'tooltip' | 'motion';
type WithoutEmbeddedHostOptions<TDefinition> = Omit<TDefinition, EmbeddedHostOption> & {
    [TOption in EmbeddedHostOption]?: never;
};
type ComposableChartTheme = Omit<Partial<ChartTheme>, 'background' | 'focusRing'> & {
    background?: never;
    focusRing?: never;
};
/** A chart definition that can be embedded without creating a second host. */
export type ComposableStaticChartDefinition<TDatum = unknown, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> = Omit<WithoutEmbeddedHostOptions<StaticChartDefinition<TDatum, TXValue, TYValue>>, 'gradients' | 'theme'> & {
    gradients?: readonly [];
    theme?: ComposableChartTheme;
};
/** A responsive chart definition whose resolved spec can be embedded in a view. */
export type ComposableResponsiveChartDefinition<TDatum = unknown, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> = Omit<WithoutEmbeddedHostOptions<ResponsiveChartDefinition<TDatum, TXValue, TYValue>>, 'chart'> & {
    chart: (context: ChartBuildContext) => ComposableStaticChartDefinition<TDatum, TXValue, TYValue>;
};
export type ComposableChartDefinition<TDatum = unknown, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> = ComposableStaticChartDefinition<TDatum, TXValue, TYValue> | ComposableResponsiveChartDefinition<TDatum, TXValue, TYValue>;
type AnyComposableChartDefinition = ComposableChartDefinition<any, any, any>;
export type ViewDefinitions = Readonly<Record<string, AnyComposableChartDefinition>>;
export interface ViewLink {
    x?: string;
    y?: string;
}
export interface ViewGridItem<TChart extends AnyComposableChartDefinition = AnyComposableChartDefinition, TRow extends string = string, TColumn extends string = string> {
    id: string;
    row: TRow;
    column: TColumn;
    chart: TChart;
    /** Share scale semantics and align the corresponding plot range. */
    share?: ViewLink;
    /** Align a plot range without requiring equal scale domains. */
    align?: ViewLink;
}
type TrackId<TTracks extends readonly ViewTrack[]> = TTracks[number]['id'];
export interface ViewGridOptions<TRows extends readonly ViewTrack[] = readonly ViewTrack[], TColumns extends readonly ViewTrack[] = readonly ViewTrack[], TViews extends readonly ViewGridItem<AnyComposableChartDefinition, TrackId<TRows>, TrackId<TColumns>>[] = readonly ViewGridItem<AnyComposableChartDefinition, TrackId<TRows>, TrackId<TColumns>>[]> {
    id?: string;
    rows: TRows;
    columns: TColumns;
    views: TViews;
    gap?: number;
    rowGap?: number;
    columnGap?: number;
}
type ViewDefinition<TView> = TView extends ViewGridItem<infer TDefinition, any, any> ? TDefinition : never;
type DefinitionDatum<TDefinition> = TDefinition extends ComposableChartDefinition<infer TDatum, any, any> ? TDatum : never;
type DefinitionXValue<TDefinition> = TDefinition extends ComposableChartDefinition<any, infer TXValue extends ChartValue, any> ? TXValue : never;
type DefinitionYValue<TDefinition> = TDefinition extends ComposableChartDefinition<any, any, infer TYValue extends ChartValue> ? TYValue : never;
type ViewDatum<TViews extends readonly ViewGridItem[]> = DefinitionDatum<ViewDefinition<TViews[number]>>;
type ViewXValue<TViews extends readonly ViewGridItem[]> = DefinitionXValue<ViewDefinition<TViews[number]>>;
type ViewYValue<TViews extends readonly ViewGridItem[]> = DefinitionYValue<ViewDefinition<TViews[number]>>;
type NamedViewId<TViews extends ViewDefinitions> = Extract<keyof TViews, string>;
type NamedViewDefinition<TViews extends ViewDefinitions> = TViews[NamedViewId<TViews>];
type NamedViewDatum<TViews extends ViewDefinitions> = DefinitionDatum<NamedViewDefinition<TViews>>;
type NamedViewXValue<TViews extends ViewDefinitions> = DefinitionXValue<NamedViewDefinition<TViews>>;
type NamedViewYValue<TViews extends ViewDefinitions> = DefinitionYValue<NamedViewDefinition<TViews>>;
type InvalidResponsiveViewDefinition<TDefinition> = TDefinition extends ResponsiveChartDefinition<any, any, any> ? ReturnType<TDefinition['chart']> extends infer TResult ? TResult extends {
    theme: infer TTheme;
} ? 'focusRing' extends keyof TTheme ? TResult : never : never : never : never;
type ValidResponsiveViewDefinitions<TDefinition> = [
    InvalidResponsiveViewDefinition<TDefinition>
] extends [never] ? unknown : never;
type ValidViewLayout<TViews extends ViewDefinitions, TLayout extends ViewLayout<any, any>> = [Exclude<ViewLayoutPlaced<TLayout>, NamedViewId<TViews>>] extends [never] ? [Exclude<ViewLayoutReferenced<TLayout>, NamedViewId<TViews>>] extends [
    never
] ? [Exclude<NamedViewId<TViews>, ViewLayoutPlaced<TLayout>>] extends [never] ? unknown : never : never : never;
export type ViewAxis = 'x' | 'y';
export type ViewScaleLinkMode = 'share' | 'align';
export interface ViewScaleLink<TView extends string = string> {
    readonly source: TView;
    readonly target: TView;
    readonly axis: ViewAxis;
    readonly mode: ViewScaleLinkMode;
}
export interface ComposeViewsOptions<TViews extends ViewDefinitions = ViewDefinitions, TLayout extends ViewLayout<any, any> = ViewLayout<any, any>> {
    id?: string;
    views: TViews;
    layout: TLayout;
    links?: readonly ViewScaleLink<NamedViewId<NoInfer<TViews>>>[];
}
export declare function shareX<const TSource extends string, const TTarget extends string>(source: TSource, target: TTarget): ViewScaleLink<TSource | TTarget>;
export declare function shareY<const TSource extends string, const TTarget extends string>(source: TSource, target: TTarget): ViewScaleLink<TSource | TTarget>;
export declare function alignX<const TSource extends string, const TTarget extends string>(source: TSource, target: TTarget): ViewScaleLink<TSource | TTarget>;
export declare function alignY<const TSource extends string, const TTarget extends string>(source: TSource, target: TTarget): ViewScaleLink<TSource | TTarget>;
/** Composes named complete chart definitions through one deterministic layout. */
export declare function composeViews<const TViews extends ViewDefinitions, const TLayout extends ViewLayout<any, any>>(options: ComposeViewsOptions<TViews, TLayout> & ValidResponsiveViewDefinitions<NamedViewDefinition<TViews>> & {
    layout: TLayout & ValidViewLayout<NoInfer<TViews>, TLayout>;
}): StaticChartDefinition<NamedViewDatum<TViews>, NamedViewXValue<TViews>, NamedViewYValue<TViews>> & ComposableStaticChartDefinition<NamedViewDatum<TViews>, NamedViewXValue<TViews>, NamedViewYValue<TViews>>;
/** Convenience syntax for non-overlapping row and column view composition. */
export declare function viewGrid<const TRows extends readonly ViewTrack[], const TColumns extends readonly ViewTrack[], const TViews extends readonly ViewGridItem<AnyComposableChartDefinition, TrackId<TRows>, TrackId<TColumns>>[]>(options: ViewGridOptions<TRows, TColumns, TViews> & ValidResponsiveViewDefinitions<ViewDefinition<TViews[number]>>): StaticChartDefinition<ViewDatum<TViews>, ViewXValue<TViews>, ViewYValue<TViews>> & ComposableStaticChartDefinition<ViewDatum<TViews>, ViewXValue<TViews>, ViewYValue<TViews>>;
