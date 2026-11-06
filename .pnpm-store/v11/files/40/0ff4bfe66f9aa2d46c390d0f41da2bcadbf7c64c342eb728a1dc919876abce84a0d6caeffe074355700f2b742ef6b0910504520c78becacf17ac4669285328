import type { TransformLineage } from './transform.js';
export type FoldField<TDatum> = Extract<keyof TDatum, string>;
export interface FoldOutputNames<TKey extends string = 'key', TValue extends string = 'value'> {
    readonly key: TKey;
    readonly value: TValue;
}
export interface FoldOptions<TDatum, TFields extends readonly FoldField<TDatum>[] = readonly FoldField<TDatum>[], TOutputNames extends FoldOutputNames<string, string> = FoldOutputNames<'key', 'value'>> {
    readonly fields: TFields;
    readonly as?: TOutputNames;
}
type FoldFieldDatum<TDatum extends object, TField extends FoldField<TDatum>, TOutputNames extends FoldOutputNames<string, string>> = TField extends FoldField<TDatum> ? Omit<TDatum, keyof TransformLineage<TDatum> | TOutputNames['key'] | TOutputNames['value']> & TransformLineage<TDatum> & {
    readonly [TKey in TOutputNames['key']]: TField;
} & {
    readonly [TValue in TOutputNames['value']]: TDatum[TField];
} : never;
export type FoldDatum<TDatum extends object, TFields extends readonly FoldField<TDatum>[], TOutputNames extends FoldOutputNames<string, string> = FoldOutputNames<'key', 'value'>> = FoldFieldDatum<TDatum, TFields[number], TOutputNames>;
type LiteralFoldFields<TFields extends readonly string[]> = number extends TFields['length'] ? never : TFields;
export declare function fold<TDatum extends object, const TFields extends readonly FoldField<TDatum>[]>(source: Iterable<TDatum>, options: {
    readonly fields: LiteralFoldFields<TFields>;
    readonly as?: undefined;
}): FoldDatum<TDatum, TFields>[];
export declare function fold<TDatum extends object, const TFields extends readonly FoldField<TDatum>[], const TOutputNames extends FoldOutputNames<string, string>>(source: Iterable<TDatum>, options: {
    readonly fields: LiteralFoldFields<TFields>;
    readonly as: TOutputNames;
}): FoldDatum<TDatum, TFields, TOutputNames>[];
export {};
