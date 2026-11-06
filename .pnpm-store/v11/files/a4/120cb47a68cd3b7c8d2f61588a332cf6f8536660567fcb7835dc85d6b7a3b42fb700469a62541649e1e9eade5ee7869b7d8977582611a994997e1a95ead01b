import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Text, View } from "react-native";
import {
  createChartTooltipContent,
  orderChartTooltipPoints,
  resolveChartTooltipAnchor,
  resolveChartTooltipPlacement
} from "@tanstack/charts/tooltip/model";
import { resolveNativeSolidPaint } from "./paint.js";
function NativeChartTooltip({
  scene,
  width,
  height,
  points: unorderedPoints,
  pointer,
  focusSource,
  options,
  pinned,
  color,
  resolvePaint,
  dismiss,
  render
}) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const points = React.useMemo(
    () => orderChartTooltipPoints(unorderedPoints, scene, options?.sort),
    [options?.sort, scene, unorderedPoints]
  );
  const point = unorderedPoints[0];
  if (!point) return null;
  const content = createChartTooltipContent(
    points,
    scene,
    pinned,
    options,
    point
  );
  const sceneAnchor = resolveChartTooltipAnchor(
    point,
    points,
    scene,
    pointer,
    options,
    {
      primary: point,
      group: unorderedPoints,
      source: focusSource,
      pinned
    }
  );
  const anchor = {
    x: sceneAnchor.x / scene.width * width,
    y: sceneAnchor.y / scene.height * height
  };
  const position = placeNativeTooltip(
    anchor,
    size,
    { width, height },
    options?.placement,
    options?.offset
  );
  const defaultBody = /* @__PURE__ */ jsx(
    DefaultNativeTooltipBody,
    {
      content,
      color,
      resolvePaint
    }
  );
  const body = render ? render({
    primaryPoint: point,
    points,
    content,
    pinned,
    dismiss,
    defaultBody
  }) : defaultBody;
  const accessibilityLabel = tooltipAccessibilityLabel(content);
  const handleLayout = (event) => {
    const next = event.nativeEvent.layout;
    if (next.width !== size.width || next.height !== size.height) {
      setSize({ width: next.width, height: next.height });
    }
  };
  return /* @__PURE__ */ jsx(
    View,
    {
      accessibilityLabel,
      accessibilityLiveRegion: pinned ? "none" : "polite",
      accessibilityRole: pinned ? "summary" : void 0,
      onLayout: handleLayout,
      onStartShouldSetResponder: () => pinned,
      pointerEvents: pinned ? "auto" : "none",
      style: [tooltipStyle, { left: position.left, top: position.top }],
      children: body
    }
  );
}
const tooltip = {
  id: "react-native-tooltip",
  __chartExtensionType: "tooltip",
  __chartTooltipHost: "react-native",
  create: () => NativeChartTooltip
};
function DefaultNativeTooltipBody({
  content,
  color,
  resolvePaint
}) {
  if (typeof content === "string") {
    return /* @__PURE__ */ jsx(Text, { style: tooltipTextStyle, children: content });
  }
  return /* @__PURE__ */ jsxs(View, { children: [
    content.title ? /* @__PURE__ */ jsxs(View, { style: titleStyle, children: [
      content.color ? /* @__PURE__ */ jsx(
        View,
        {
          style: [
            swatchStyle,
            {
              backgroundColor: resolveNativeSolidPaint(
                content.color,
                { color },
                resolvePaint
              )
            }
          ]
        }
      ) : null,
      /* @__PURE__ */ jsx(Text, { style: titleTextStyle, children: content.title })
    ] }) : null,
    content.rows.map((row, index) => /* @__PURE__ */ jsxs(View, { style: rowStyle, children: [
      /* @__PURE__ */ jsx(
        View,
        {
          style: [
            swatchStyle,
            {
              backgroundColor: row.color ? resolveNativeSolidPaint(row.color, { color }, resolvePaint) : "transparent"
            }
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        Text,
        {
          numberOfLines: 1,
          style: row.active ? { ...rowLabelStyle, fontWeight: "700" } : rowLabelStyle,
          children: row.label
        }
      ),
      /* @__PURE__ */ jsx(
        Text,
        {
          numberOfLines: 1,
          style: row.active ? { ...rowValueStyle, fontWeight: "700" } : rowValueStyle,
          children: row.value
        }
      )
    ] }, `${row.label}:${index}`))
  ] });
}
function createNativeTooltipContent(points, scene, pinned = false, options, primaryPoint) {
  return createChartTooltipContent(points, scene, pinned, options, primaryPoint);
}
function resolveNativeTooltipAnchor(point, points, scene, pointer, focusSource, pinned, options, focusPoints = points) {
  return resolveChartTooltipAnchor(point, points, scene, pointer, options, {
    primary: point,
    group: focusPoints,
    source: focusSource,
    pinned
  });
}
function placeNativeTooltip(anchor, tooltip2, boundary, placement, offset) {
  return resolveChartTooltipPlacement(
    anchor,
    tooltip2,
    { left: 0, top: 0, right: boundary.width, bottom: boundary.height },
    placement,
    offset
  );
}
function tooltipAccessibilityLabel(content) {
  return typeof content === "string" ? content : [
    content.title,
    ...content.rows.map((row) => `${row.label}: ${row.value}`)
  ].filter(Boolean).join("\n");
}
const tooltipStyle = {
  position: "absolute",
  zIndex: 1,
  maxWidth: "80%",
  paddingHorizontal: 9,
  paddingVertical: 7,
  borderWidth: 1,
  borderColor: "rgba(17, 24, 39, 0.16)",
  borderRadius: 7,
  backgroundColor: "#ffffff",
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.14,
  shadowRadius: 12,
  elevation: 4
};
const tooltipTextStyle = {
  color: "#111827",
  fontSize: 12,
  fontWeight: "500"
};
const titleStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  marginBottom: 4
};
const titleTextStyle = {
  color: "#111827",
  fontSize: 12,
  fontWeight: "700"
};
const rowStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 6
};
const swatchStyle = {
  width: 9,
  height: 9,
  borderRadius: 2
};
const rowLabelStyle = {
  flexGrow: 1,
  flexShrink: 1,
  color: "#374151",
  fontSize: 12
};
const rowValueStyle = {
  color: "#111827",
  fontSize: 12,
  fontVariant: ["tabular-nums"]
};
export {
  NativeChartTooltip,
  createNativeTooltipContent,
  placeNativeTooltip,
  resolveNativeTooltipAnchor,
  tooltip
};
