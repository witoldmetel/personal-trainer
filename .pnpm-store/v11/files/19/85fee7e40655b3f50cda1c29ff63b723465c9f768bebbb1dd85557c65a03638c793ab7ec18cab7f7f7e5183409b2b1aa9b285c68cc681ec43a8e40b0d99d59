export interface LinearScale {
    (value: number | null | undefined): number | undefined;
    domain(): [number, number];
    domain(values: Iterable<number>): LinearScale;
    range(): [number, number];
    range(values: Iterable<number>): LinearScale;
    invert(value: number): number;
    clamp(): boolean;
    clamp(value: boolean): LinearScale;
    ticks(count?: number): number[];
    tickFormat(count?: number): (value: number) => string;
    nice(count?: number): LinearScale;
    copy(): LinearScale;
}
export declare function scaleLinear(): LinearScale;
export declare function scaleLinear(range: Iterable<number>): LinearScale;
export declare function scaleLinear(domain: Iterable<number>, range: Iterable<number>): LinearScale;
