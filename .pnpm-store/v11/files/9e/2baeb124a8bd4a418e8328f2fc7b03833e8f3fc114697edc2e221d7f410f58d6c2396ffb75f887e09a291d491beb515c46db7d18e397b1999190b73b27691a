import type { ColorValue } from 'react-native';
export interface NativePaintContext {
    color: ColorValue;
    /** Native equivalent of the browser `Canvas` system color. */
    canvas?: ColorValue;
}
export type NativePaintResolver = (paint: string, context: NativePaintContext) => ColorValue;
export declare function resolveNativePaint(paint: string, context: NativePaintContext): ColorValue;
export declare function resolveNativeSolidPaint(paint: string, context: NativePaintContext, resolvePaint?: NativePaintResolver): ColorValue;
