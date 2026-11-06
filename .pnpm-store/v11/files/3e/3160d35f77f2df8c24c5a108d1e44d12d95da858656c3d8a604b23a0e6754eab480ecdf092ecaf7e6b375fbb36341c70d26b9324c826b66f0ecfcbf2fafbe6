import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Platform } from "react-native";
import {
  Circle,
  ClipPath,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Text
} from "react-native-svg";
import { rectCornerRadiiPath } from "@tanstack/charts/renderer/rect";
function NativeChartSceneNodes({
  scene,
  nodes,
  color,
  focusFill,
  direction,
  fontScale,
  idPrefix,
  resolvePaint
}) {
  const gradientIds = React.useMemo(
    () => new Set(scene.gradients.map((gradient) => gradient.id)),
    [scene.gradients]
  );
  const paint = React.useCallback(
    (value) => resolveScenePaint(
      value,
      gradientIds,
      idPrefix,
      resolvePaint,
      color,
      focusFill
    ),
    [color, focusFill, gradientIds, idPrefix, resolvePaint]
  );
  return /* @__PURE__ */ jsx(Fragment, { children: nodes.map(
    (node) => renderSceneNode(
      node,
      idPrefix,
      paint,
      positiveFinite(fontScale, 1),
      direction
    )
  ) });
}
const NativeChartScene = React.memo(function NativeChartScene2({
  scene,
  color,
  fontFamily,
  fontStyle,
  fontStretch,
  letterSpacing,
  direction,
  fontScale,
  idPrefix,
  resolvePaint,
  focusFill,
  focusPresentation
}) {
  const gradientIds = React.useMemo(
    () => new Set(scene.gradients.map((gradient) => gradient.id)),
    [scene.gradients]
  );
  const paint = React.useCallback(
    (value) => resolveScenePaint(
      value,
      gradientIds,
      idPrefix,
      resolvePaint,
      color,
      focusFill
    ),
    [color, focusFill, gradientIds, idPrefix, resolvePaint]
  );
  return /* @__PURE__ */ jsxs(
    Svg,
    {
      width: "100%",
      height: "100%",
      viewBox: `0 0 ${scene.width} ${scene.height}`,
      color,
      fontFamily,
      fontStyle,
      fontStretch,
      letterSpacing: letterSpacing === void 0 ? void 0 : letterSpacing * positiveFinite(fontScale, 1),
      pointerEvents: "none",
      accessible: false,
      children: [
        scene.gradients.length ? /* @__PURE__ */ jsx(Defs, { children: scene.gradients.map((gradient) => {
          let minimumOffset = 0;
          const stops = gradient.stops.map((stop, index) => {
            const offset = Math.max(minimumOffset, clampUnit(stop.offset));
            minimumOffset = offset;
            return /* @__PURE__ */ jsx(
              Stop,
              {
                offset: percent(offset),
                stopColor: paint(stop.color),
                stopOpacity: stop.opacity
              },
              `${gradient.id}:${index}`
            );
          });
          if (gradient.type === "radial") {
            const cx = gradient.cx ?? 0.5;
            const cy = gradient.cy ?? 0.5;
            return /* @__PURE__ */ jsx(
              RadialGradient,
              {
                id: scopedId(idPrefix, gradient.id),
                cx: percent(cx),
                cy: percent(cy),
                r: percent(gradient.r ?? 0.5),
                fx: percent(gradient.fx ?? cx),
                fy: percent(gradient.fy ?? cy),
                children: stops
              },
              gradient.id
            );
          }
          return /* @__PURE__ */ jsx(
            LinearGradient,
            {
              id: scopedId(idPrefix, gradient.id),
              x1: percent(gradient.x1 ?? 0),
              y1: percent(gradient.y1 ?? 1),
              x2: percent(gradient.x2 ?? 0),
              y2: percent(gradient.y2 ?? 0),
              children: stops
            },
            gradient.id
          );
        }) }) : null,
        scene.theme.background === "transparent" ? null : /* @__PURE__ */ jsx(
          Rect,
          {
            x: 0,
            y: 0,
            width: scene.width,
            height: scene.height,
            fill: paint(scene.theme.background)
          }
        ),
        focusPresentation?.under.map(
          (node) => renderSceneNode(
            node,
            idPrefix,
            paint,
            positiveFinite(fontScale, 1),
            direction
          )
        ),
        scene.nodes.map(
          (node) => renderSceneNode(
            node,
            idPrefix,
            paint,
            positiveFinite(fontScale, 1),
            direction
          )
        ),
        focusPresentation?.over.map(
          (node) => renderSceneNode(
            node,
            idPrefix,
            paint,
            positiveFinite(fontScale, 1),
            direction
          )
        )
      ]
    }
  );
});
function renderSceneNode(node, idPrefix, paint, fontScale, direction) {
  if (node.kind === "group" && node.focus) return null;
  const style = nativeSceneStyle(node.style, paint);
  switch (node.kind) {
    case "group":
      return renderGroup(node, idPrefix, paint, style, fontScale, direction);
    case "rule":
      return /* @__PURE__ */ jsx(
        Line,
        {
          ...style,
          x1: node.x1,
          y1: node.y1,
          x2: node.x2,
          y2: node.y2
        },
        node.key
      );
    case "polyline":
      return /* @__PURE__ */ jsx(
        Path,
        {
          ...style,
          d: node.path ?? pointsPath(node.points, false),
          vectorEffect: "non-scaling-stroke"
        },
        node.key
      );
    case "area":
      return /* @__PURE__ */ jsx(
        Path,
        {
          ...style,
          d: node.polygons !== void 0 ? polygonsPath(node.polygons) : node.path ?? pointsPath(node.points, true),
          fillRule: node.polygons === void 0 ? void 0 : "evenodd",
          vectorEffect: "non-scaling-stroke"
        },
        node.key
      );
    case "dot":
      return /* @__PURE__ */ jsx(
        Circle,
        {
          ...style,
          cx: node.x,
          cy: node.y,
          r: node.radius
        },
        node.key
      );
    case "rect":
      return node.cornerRadii === void 0 ? /* @__PURE__ */ jsx(
        Rect,
        {
          ...style,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          rx: node.radius
        },
        node.key
      ) : /* @__PURE__ */ jsx(
        Path,
        {
          ...style,
          d: rectCornerRadiiPath(
            node.x,
            node.y,
            node.width,
            node.height,
            node.cornerRadii
          )
        },
        node.key
      );
    case "label":
      return /* @__PURE__ */ jsx(
        Text,
        {
          ...style,
          ...webTextDirection(direction),
          x: node.x,
          y: node.y,
          textAnchor: resolveNativeTextAnchor(node.anchor, direction),
          alignmentBaseline: node.baseline === "auto" ? "baseline" : node.baseline,
          transform: node.rotate === void 0 ? void 0 : `rotate(${node.rotate} ${node.x} ${node.y})`,
          fontSize: (node.fontSize ?? 16) * fontScale,
          fontWeight: node.fontWeight,
          children: node.text
        },
        node.key
      );
  }
}
function renderGroup(node, idPrefix, paint, style, fontScale, direction) {
  const clipId = node.clip ? scopedId(idPrefix, `clip-${stableId(node.key)}`) : void 0;
  const transform = node.translateX === void 0 && node.translateY === void 0 ? void 0 : `translate(${node.translateX ?? 0} ${node.translateY ?? 0})`;
  return /* @__PURE__ */ jsxs(
    G,
    {
      ...style,
      transform,
      clipPath: clipId ? `url(#${clipId})` : void 0,
      children: [
        node.clip && clipId ? /* @__PURE__ */ jsx(Defs, { children: /* @__PURE__ */ jsx(ClipPath, { id: clipId, children: /* @__PURE__ */ jsx(
          Rect,
          {
            x: node.clip.x,
            y: node.clip.y,
            width: node.clip.width,
            height: node.clip.height
          }
        ) }) }) : null,
        node.children.map(
          (child) => renderSceneNode(child, idPrefix, paint, fontScale, direction)
        )
      ]
    },
    node.key
  );
}
function nativeSceneStyle(style, paint) {
  if (!style) return {};
  return {
    fill: style.fill === void 0 ? void 0 : paint(style.fill),
    fillOpacity: style.fillOpacity,
    stroke: style.stroke === void 0 ? void 0 : paint(style.stroke),
    strokeOpacity: style.strokeOpacity,
    strokeWidth: style.strokeWidth,
    opacity: style.opacity,
    strokeLinecap: style.lineCap,
    strokeLinejoin: resolveNativeLineJoin(style.lineJoin),
    strokeDasharray: style.strokeDasharray
  };
}
function resolveNativeLineJoin(lineJoin) {
  if (lineJoin === "arcs") return "round";
  if (lineJoin === "miter-clip") return "miter";
  return lineJoin;
}
function resolveNativeTextAnchor(anchor, direction) {
  if (Platform.OS === "web" || direction !== "rtl") return anchor;
  if (anchor === "end") return "start";
  return anchor === "middle" ? "middle" : "end";
}
function webTextDirection(direction) {
  return Platform.OS === "web" && direction !== void 0 ? { direction } : {};
}
function resolveScenePaint(value, gradientIds, idPrefix, resolvePaint, color, canvas) {
  const match = /^url\(#([\s\S]*)\)$/.exec(value);
  const id = match?.[1];
  if (id !== void 0 && gradientIds.has(id)) {
    return `url(#${scopedId(idPrefix, id)})`;
  }
  return resolvePaint(value, { color, canvas });
}
function pointsPath(points, close) {
  return `${points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x},${y}`).join("")}${close ? "Z" : ""}`;
}
function polygonsPath(polygons) {
  return polygons.flatMap((polygon) => polygon).filter((ring) => ring.length > 0).map((ring) => pointsPath(ring, true)).join("");
}
function scopedId(prefix, id) {
  const encodedId = encodeResourceId(id);
  return prefix ? `${prefix}-${encodedId}` : encodedId;
}
function encodeResourceId(value) {
  if (!value) return "_";
  return Array.from(
    value,
    (character) => /^[a-zA-Z0-9-]$/.test(character) ? character : `_x${character.codePointAt(0).toString(16)}_`
  ).join("");
}
function stableId(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  }
  return (hash >>> 0).toString(36);
}
function percent(value) {
  return `${clampUnit(value) * 100}%`;
}
function clampUnit(value) {
  return Number.isNaN(value) ? 0 : Math.max(0, Math.min(1, value));
}
function positiveFinite(value, fallback) {
  return value !== void 0 && Number.isFinite(value) && value > 0 ? value : fallback;
}
export {
  NativeChartScene,
  NativeChartSceneNodes,
  resolveNativeLineJoin
};
