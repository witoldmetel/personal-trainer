import type { ChartMotionContext, ChartMotionDefinition, ChartMotionTiming } from './types.js';
type ResolvedCompositeMotion<TDatum> = false | ChartMotionTiming<TDatum>;
export declare function resolveCompositeMotion<TDatum>(definition: ChartMotionDefinition<TDatum> | undefined, context: ChartMotionContext<TDatum>): ResolvedCompositeMotion<TDatum> | undefined;
export declare function resolveCompositeChildMotion<TDatum>(parent: ChartMotionDefinition<TDatum> | undefined, children: ReadonlyMap<string, ChartMotionDefinition<any>>, context: ChartMotionContext<TDatum>): ResolvedCompositeMotion<TDatum> | undefined;
export declare function mergeCompositeMotion<TDatum>(parent: ResolvedCompositeMotion<TDatum> | undefined, child: ResolvedCompositeMotion<TDatum> | undefined): ResolvedCompositeMotion<TDatum> | undefined;
export {};
