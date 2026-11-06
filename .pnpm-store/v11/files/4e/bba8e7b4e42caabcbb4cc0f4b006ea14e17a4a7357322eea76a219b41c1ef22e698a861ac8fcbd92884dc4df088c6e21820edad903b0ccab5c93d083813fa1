declare const viewLayoutBrand: unique symbol;
/** An opaque, deterministic placement plan for named chart views. */
export interface ViewLayout<TPlaced extends string = string, TReferenced extends string = never> {
    readonly [viewLayoutBrand]: {
        readonly placed: TPlaced;
        readonly referenced: TReferenced;
    };
}
export type ViewLayoutPlaced<TLayout extends ViewLayout<any, any>> = TLayout extends ViewLayout<infer TPlaced, any> ? TPlaced : never;
export type ViewLayoutReferenced<TLayout extends ViewLayout<any, any>> = TLayout extends ViewLayout<any, infer TReferenced> ? TReferenced : never;
export type ViewTrack<TId extends string = string> = {
    readonly id: TId;
    readonly size: number;
    readonly grow?: never;
    readonly min?: never;
    readonly max?: never;
} | {
    readonly id: TId;
    readonly grow: number;
    readonly min?: number;
    readonly max?: number;
    readonly size?: never;
};
export type ViewAnchor = 'top-left' | 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'center';
export interface ViewInsetOptions<TReference extends string = string> {
    relativeTo: TReference;
    anchor: ViewAnchor;
    width: number;
    height: number;
    /** Distance from the referenced view's edges. Shrinks with the inset. */
    offset?: number;
}
export interface ViewGridCell<TRow extends string = string, TColumn extends string = string> {
    readonly row: TRow;
    readonly column: TColumn;
}
export interface ViewLayoutBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ResolvedViewFrame extends ViewLayoutBounds {
    id: string;
    /** Paint and focus order, starting at zero. */
    order: number;
}
export interface ViewLayoutMetadata {
    placed: readonly string[];
    referenced: readonly string[];
}
type AnyViewLayout = ViewLayout<any, any>;
type NonEmpty<T> = readonly [T, ...T[]];
type TrackId<TTracks extends readonly ViewTrack[]> = TTracks[number]['id'];
/** Fills the current layout bounds with one complete chart view. */
export declare function fill<const TView extends string>(view: TView): ViewLayout<TView, never>;
/** Places one chart view inside a previously resolved view frame. */
export declare function inset<const TView extends string, const TReference extends string>(view: TView, options: ViewInsetOptions<TReference>): ViewLayout<TView, TReference>;
/** Resolves child layouts in paint order against the same outer bounds. */
export declare function layer<const TLayouts extends NonEmpty<AnyViewLayout>>(...layouts: TLayouts): ViewLayout<ViewLayoutPlaced<TLayouts[number]>, ViewLayoutReferenced<TLayouts[number]>>;
type CheckedCells<TRows extends readonly ViewTrack[], TColumns extends readonly ViewTrack[], TCells extends Readonly<Record<string, ViewGridCell>>> = {
    readonly [TView in keyof TCells]: ViewGridCell<TrackId<TRows>, TrackId<TColumns>>;
};
/** Places named chart views in non-overlapping fixed and flexible tracks. */
export declare function grid<const TRows extends NonEmpty<ViewTrack>, const TColumns extends NonEmpty<ViewTrack>, const TCells extends Readonly<Record<string, ViewGridCell>>>(options: {
    rows: TRows;
    columns: TColumns;
    cells: TCells & CheckedCells<NoInfer<TRows>, NoInfer<TColumns>, TCells> & (keyof TCells extends never ? never : unknown);
    gap?: number;
    rowGap?: number;
    columnGap?: number;
}): ViewLayout<Extract<keyof TCells, string>, never>;
/** @internal Returns authored placement and dependency IDs without resolving frames. */
export declare function getViewLayoutMetadataInternal(layout: AnyViewLayout): ViewLayoutMetadata;
/** @internal Resolves all named views to absolute frames in paint order. */
export declare function resolveViewLayoutInternal(layout: AnyViewLayout, bounds: ViewLayoutBounds): readonly ResolvedViewFrame[];
export {};
