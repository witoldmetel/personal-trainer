import type { ChartMark, ChartMarkDatum, ChartMarkPointX, ChartMarkPointY, ChartMotionDefinition, InitializedMark, MarkRenderContext, MarkScene, MaterializedChannel, SceneLabel } from './types.js';
export type AnyInitializedMark = InitializedMark<any, any, any>;
type ChildDatum<TMark> = TMark extends InitializedMark<infer TDatum, any, any> ? TDatum : never;
type ChildXValue<TMark> = TMark extends InitializedMark<any, infer TXValue, any> ? TXValue : never;
type ChildYValue<TMark> = TMark extends InitializedMark<any, any, infer TYValue> ? TYValue : never;
export interface InitializedMarkComposition<TChildren extends readonly AnyInitializedMark[]> {
    channels: Readonly<Record<string, MaterializedChannel>>;
    seriesFromColor?: boolean;
    childMotions: ReadonlyMap<string, ChartMotionDefinition<any>>;
    layoutLabels?: (context: MarkRenderContext) => readonly SceneLabel[];
    render: (context: MarkRenderContext) => MarkScene<ChildDatum<TChildren[number]>, ChildXValue<TChildren[number]>, ChildYValue<TChildren[number]>>;
}
interface ComposeInitializedMarksOptions {
    coordinates: 'semantic' | 'pixel';
    owner: 'Composite mark' | 'Resolved layout';
    interactiveChildren?: ReadonlySet<string>;
}
/** Composes initialized child marks while preserving their normal scene API. */
export declare function composeInitializedMarks<const TChildren extends readonly AnyInitializedMark[]>(parentId: string, children: TChildren, options: ComposeInitializedMarksOptions): InitializedMarkComposition<TChildren>;
type AnyChartMark = ChartMark<any, any, any, any, any, any, any>;
interface InitializeCompositeMarkOptions<TDatum> {
    motion?: ChartMotionDefinition<TDatum>;
    interactiveChildren?: ReadonlySet<string>;
}
/** Initializes one ordinary semantic composite through the shared scene kernel. */
export declare function initializeCompositeMark<const TMarks extends readonly AnyChartMark[]>(id: string, marks: TMarks, options?: InitializeCompositeMarkOptions<ChartMarkDatum<TMarks[number]>>): InitializedMark<ChartMarkDatum<TMarks[number]>, ChartMarkPointX<TMarks[number]>, ChartMarkPointY<TMarks[number]>>;
/** Resolves one direct child's stable mark and scene namespace. */
export declare function compositeChildMarkId(parentId: string, childId: string): string;
export {};
