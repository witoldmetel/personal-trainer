import type { ChartRenderer, UniversalChartRenderer } from './dom-types.js';
import type { ChartMotionTransition, ChartValue } from './types.js';
export type { ChartMotionContext, ChartMotionDefinition, ChartMotionPath, ChartMotionPhase, ChartRollingPathMotion, ChartMotionRole, ChartMotionSpringTransition, ChartMotionTiming, ChartMotionTransition, ChartMotionTweenTransition, } from './types.js';
export { stagger } from './motion-definition.js';
export type { ChartMotionStaggerOptions } from './motion-definition.js';
export interface ChartMotionOptions {
    /** Animate the first client render. Use `always` to replay adopted server-rendered SVG. */
    initial?: boolean | 'always';
    /** Default transition. Definition-local motion can refine or replace it. */
    transition?: ChartMotionTransition;
    /** Snap when the user requests reduced motion. Defaults to true. */
    respectReducedMotion?: boolean;
    /** Animate updates caused only by a chart resize. Defaults to false. */
    resize?: boolean;
}
export declare function motion(options?: ChartMotionOptions): UniversalChartRenderer;
export declare function motion<TDatum = unknown, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue>(options?: ChartMotionOptions): ChartRenderer<TDatum, TXValue, TYValue>;
