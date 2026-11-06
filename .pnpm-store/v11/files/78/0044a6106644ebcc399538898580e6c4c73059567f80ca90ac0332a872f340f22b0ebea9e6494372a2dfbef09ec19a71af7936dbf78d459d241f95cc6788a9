import type { ChartMotionPhase, ChartMotionRole, ChartMotionTiming } from './types.js';
export interface ChartMotionStaggerOptions {
    /** Index used to calculate the delay. Defaults to `datum`. */
    by?: 'datum' | 'series';
    /** Milliseconds between adjacent entries. */
    each: number;
    /** Fixed milliseconds before the first entry. Defaults to zero. */
    offset?: number;
    /** Restricts staggering to one or more lifecycle phases. Defaults to `enter`. */
    phase?: ChartMotionPhase | readonly ChartMotionPhase[];
    /** Restricts staggering to one or more semantic roles. */
    roles?: ChartMotionRole | readonly ChartMotionRole[];
}
/** Creates a delay timing field that composes through object spread. */
export declare function stagger<TDatum = unknown>(options: ChartMotionStaggerOptions): Pick<ChartMotionTiming<TDatum>, 'delay'>;
