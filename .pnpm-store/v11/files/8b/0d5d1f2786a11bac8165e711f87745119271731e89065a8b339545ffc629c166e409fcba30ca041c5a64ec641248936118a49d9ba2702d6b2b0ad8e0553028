import { type ScaleDomainValue } from './intern.js';
export interface OrdinalScale<TDomain extends ScaleDomainValue = string, TRange = unknown> {
    (value: TDomain): TRange | undefined;
    domain(): TDomain[];
    domain(values: Iterable<TDomain>): OrdinalScale<TDomain, TRange>;
    range(): TRange[];
    range(values: Iterable<TRange>): OrdinalScale<TDomain, TRange>;
    unknown(): TRange | undefined;
    unknown(value: TRange | undefined): OrdinalScale<TDomain, TRange>;
    copy(): OrdinalScale<TDomain, TRange>;
}
export declare function scaleOrdinal<TDomain extends ScaleDomainValue = string, TRange = unknown>(): OrdinalScale<TDomain, TRange>;
export declare function scaleOrdinal<TRange>(range: Iterable<TRange>): OrdinalScale<string, TRange>;
export declare function scaleOrdinal<TDomain extends ScaleDomainValue, TRange>(domain: Iterable<TDomain>, range: Iterable<TRange>): OrdinalScale<TDomain, TRange>;
