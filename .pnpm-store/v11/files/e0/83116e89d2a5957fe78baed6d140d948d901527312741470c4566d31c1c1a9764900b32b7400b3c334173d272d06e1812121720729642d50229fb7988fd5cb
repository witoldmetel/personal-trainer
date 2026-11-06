import { compositeChildMarkId } from './mark-composite-internal.js';
import type { ChartValue, InitializedMark, ResolvedMarkLayout } from './types.js';
type AnyInitializedMark = InitializedMark<any, any, any>;
type ChildDatum<TMark> = TMark extends InitializedMark<infer TDatum, any, any> ? TDatum : never;
type ChildXValue<TMark> = TMark extends InitializedMark<any, infer TXValue, any> ? TXValue : never;
type ChildYValue<TMark> = TMark extends InitializedMark<any, any, infer TYValue> ? TYValue : never;
/** Adopts the resolved fields of a direct child mark without nesting layouts. */
export declare function adoptResolvedChildMark<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(child: InitializedMark<TDatum, TXValue, TYValue>): ResolvedMarkLayout<TDatum, TXValue, TYValue>;
/** Composes direct child marks that already express final pixel coordinates. */
export declare function composeResolvedChildMarks<const TChildren extends readonly AnyInitializedMark[]>(parentId: string, children: TChildren): ResolvedMarkLayout<ChildDatum<TChildren[number]>, ChildXValue<TChildren[number]>, ChildYValue<TChildren[number]>>;
/** Resolves one direct child's stable mark and scene namespace. */
export declare const resolvedChildMarkId: typeof compositeChildMarkId;
export {};
