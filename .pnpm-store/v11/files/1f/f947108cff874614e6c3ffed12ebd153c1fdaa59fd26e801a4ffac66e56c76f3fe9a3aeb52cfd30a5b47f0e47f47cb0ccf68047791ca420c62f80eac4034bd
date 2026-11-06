export interface ProportionalInterval {
    readonly fraction: number;
    readonly start: number;
    readonly end: number;
}
export interface ProportionalIntervalOptions {
    /** Start of the allocation extent. Defaults to zero. */
    readonly start?: number;
    /** End of the allocation extent. Defaults to one. */
    readonly end?: number;
    /** Empty extent between positive intervals. Defaults to zero. */
    readonly gap?: number;
    /** Reserve one additional gap after the final positive interval. */
    readonly gapAfterLast?: boolean;
}
/** Allocates ordered nonnegative weights into aligned proportional intervals. */
export declare function allocateProportionalIntervals(weights: readonly number[], options?: Readonly<ProportionalIntervalOptions>): ProportionalInterval[];
