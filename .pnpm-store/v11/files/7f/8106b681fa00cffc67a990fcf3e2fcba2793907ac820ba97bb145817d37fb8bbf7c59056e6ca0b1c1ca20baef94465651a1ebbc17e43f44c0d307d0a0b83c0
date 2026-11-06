import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Circle, Svg } from "react-native-svg";
import {
  focusedSceneNodes,
  resolveFocusScene
} from "@tanstack/charts/universal";
import { resolveNativeSolidPaint } from "./paint.js";
import { NativeChartSceneNodes } from "./SvgScene.js";
function NativeChartFocusOverlay({
  width,
  height,
  scene,
  points,
  placement,
  source,
  pinned,
  showDefault,
  color,
  fill,
  fontFamily,
  direction,
  idPrefix,
  resolvePaint
}) {
  const focus = points[0] ? {
    primary: points[0],
    group: points,
    source,
    pinned
  } : null;
  const focusedScene = resolveFocusScene(scene, focus).scene;
  const nodes = focusedSceneNodes(focusedScene, focus, placement);
  const defaultPoints = placement === "over" && showDefault ? points : [];
  if (!nodes.length && !defaultPoints.length) return null;
  return /* @__PURE__ */ jsxs(
    Svg,
    {
      width: "100%",
      height: "100%",
      viewBox: `0 0 ${width} ${height}`,
      pointerEvents: "none",
      accessible: false,
      color,
      fontFamily,
      style: absoluteFill,
      children: [
        /* @__PURE__ */ jsx(
          NativeChartSceneNodes,
          {
            scene: focusedScene,
            nodes,
            color,
            fontFamily,
            direction,
            idPrefix,
            resolvePaint
          }
        ),
        defaultPoints.map((point, index) => /* @__PURE__ */ jsx(
          Circle,
          {
            cx: point.x,
            cy: point.y,
            r: index === 0 ? 6 : 4,
            fill,
            stroke: resolveNativeSolidPaint(point.color, { color }, resolvePaint),
            strokeWidth: index === 0 ? 2.5 : 2,
            vectorEffect: "non-scaling-stroke"
          },
          `default-focus:${index}`
        ))
      ]
    }
  );
}
const absoluteFill = {
  position: "absolute",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0
};
export {
  NativeChartFocusOverlay
};
