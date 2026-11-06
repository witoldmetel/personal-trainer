import { type ScaleDomainValue } from './intern.js';
export interface BandScale<TDomain extends ScaleDomainValue = string> {
    (value: TDomain): number | undefined;
    domain(): TDomain[];
    domain(values: Iterable<TDomain>): BandScale<TDomain>;
    range(): [number, number];
    range(values: Iterable<number>): BandScale<TDomain>;
    rangeRound(values: Iterable<number>): BandScale<TDomain>;
    bandwidth(): number;
    step(): number;
    round(): boolean;
    round(value: boolean): BandScale<TDomain>;
    padding(): number;
    padding(value: number): BandScale<TDomain>;
    paddingInner(): number;
    paddingInner(value: number): BandScale<TDomain>;
    paddingOuter(): number;
    paddingOuter(value: number): BandScale<TDomain>;
    align(): number;
    align(value: number): BandScale<TDomain>;
    copy(): BandScale<TDomain>;
}
export interface PointScale<TDomain extends ScaleDomainValue = string> {
    (value: TDomain): number | undefined;
    domain(): TDomain[];
    domain(values: Iterable<TDomain>): PointScale<TDomain>;
    range(): [number, number];
    range(values: Iterable<number>): PointScale<TDomain>;
    rangeRound(values: Iterable<number>): PointScale<TDomain>;
    bandwidth(): 0;
    step(): number;
    round(): boolean;
    round(value: boolean): PointScale<TDomain>;
    padding(): number;
    padding(value: number): PointScale<TDomain>;
    align(): number;
    align(value: number): PointScale<TDomain>;
    copy(): PointScale<TDomain>;
}
export declare function createBandScale<TDomain extends ScaleDomainValue>(point: false, first?: Iterable<TDomain> | Iterable<number>, second?: Iterable<number>): BandScale<TDomain>;
export declare function createBandScale<TDomain extends ScaleDomainValue>(point: true, first?: Iterable<TDomain> | Iterable<number>, second?: Iterable<number>): PointScale<TDomain>;
