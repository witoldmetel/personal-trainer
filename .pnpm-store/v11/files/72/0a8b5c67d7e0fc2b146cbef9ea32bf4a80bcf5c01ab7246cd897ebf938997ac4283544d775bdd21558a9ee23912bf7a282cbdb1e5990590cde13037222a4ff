import {
  channelValues,
  createMark,
  inferredKeyValues,
  isChartKey,
  isChartValue,
  visualValue
} from "./mark.js";
import { createMarkWithScaleValues } from "./mark-with-scale-values.js";
import { minimumMappedSpacing } from "./mapped-spacing-internal.js";
import { valueKey } from "./scales.js";
function bandX(source, options = {}) {
  const data = Array.isArray(source) ? source : Array.from(source);
  const xScale = options.xScale ?? "x";
  return createMarkWithScaleValues(
    ({ markIndex }) => {
      const id = options.id ?? `band-x-${markIndex}`;
      const values = channelValues(
        data,
        options.x,
        (_datum, { index }) => index
      );
      const zValues = channelValues(data, options.z, () => null);
      const colorValues = options.color === void 0 ? zValues : channelValues(data, options.color, () => null);
      const keys = inferredKeyValues(data, options.key, {
        groups: zValues,
        candidates: [values],
        markId: id,
        warningIdentity: options
      });
      return {
        id,
        channels: {
          x: { scale: xScale, values: values.filter(isChartValue) },
          color: { scale: "color", values: colorValues.filter(isChartKey) }
        },
        render: ({ chart, scales, color }) => {
          const width = Number.isFinite(options.width) ? Math.max(0, options.width) : scales[xScale].bandwidth || inferBandwidth(scales[xScale], values, chart.width, data.length);
          const inset = Number.isFinite(options.inset) ? options.inset : 0;
          const nodes = [];
          data.forEach((datum, index) => {
            const xValue = values[index];
            if (!isChartValue(xValue)) return;
            const x = scales[xScale].map(xValue);
            const fill = visualValue(
              options.fill,
              datum,
              index,
              data,
              color(colorValues[index])
            );
            const group = zValues[index] ?? null;
            const key = `${id}:${valueKey(group)}:${valueKey(keys[index])}`;
            const left = x - width / 2 + inset;
            const paintedWidth = Math.max(0, width - inset * 2);
            const point = {
              key,
              markId: id,
              group,
              groupLabel: group == null ? id : String(group),
              datum,
              datumIndex: index,
              xValue,
              yValue: 0,
              x,
              y: chart.y + chart.height / 2,
              color: fill
            };
            nodes.push({
              kind: "rect",
              key,
              x: left,
              y: chart.y,
              width: paintedWidth,
              height: chart.height,
              radius: options.radius,
              interaction: { point, affinity: "x" },
              style: { fill, fillOpacity: options.fillOpacity }
            });
          });
          return {
            nodes: [
              {
                kind: "group",
                key: id,
                className: "ts-chart__band ts-chart__band-x",
                ariaHidden: true,
                children: nodes
              }
            ]
          };
        }
      };
    },
    options.motion,
    options.renderer
  );
}
function bandY(source, options = {}) {
  const data = Array.isArray(source) ? source : Array.from(source);
  const yScale = options.yScale ?? "y";
  return createMark(
    ({ markIndex }) => {
      const id = options.id ?? `band-y-${markIndex}`;
      const values = channelValues(
        data,
        options.y,
        (_datum, { index }) => index
      );
      const zValues = channelValues(data, options.z, () => null);
      const colorValues = options.color === void 0 ? zValues : channelValues(data, options.color, () => null);
      const keys = inferredKeyValues(data, options.key, {
        groups: zValues,
        candidates: [values],
        markId: id,
        warningIdentity: options
      });
      return {
        id,
        channels: {
          y: { scale: yScale, values: values.filter(isChartValue) },
          color: { scale: "color", values: colorValues.filter(isChartKey) }
        },
        render: ({ chart, scales, color }) => {
          const height = Number.isFinite(options.height) ? Math.max(0, options.height) : scales[yScale].bandwidth || inferBandwidth(scales[yScale], values, chart.height, data.length);
          const inset = Number.isFinite(options.inset) ? options.inset : 0;
          const nodes = [];
          data.forEach((datum, index) => {
            const yValue = values[index];
            if (!isChartValue(yValue)) return;
            const y = scales[yScale].map(yValue);
            const fill = visualValue(
              options.fill,
              datum,
              index,
              data,
              color(colorValues[index])
            );
            const group = zValues[index] ?? null;
            const key = `${id}:${valueKey(group)}:${valueKey(keys[index])}`;
            const top = y - height / 2 + inset;
            const paintedHeight = Math.max(0, height - inset * 2);
            const point = {
              key,
              markId: id,
              group,
              groupLabel: group == null ? id : String(group),
              datum,
              datumIndex: index,
              xValue: 0,
              yValue,
              x: chart.x + chart.width / 2,
              y,
              color: fill
            };
            nodes.push({
              kind: "rect",
              key,
              x: chart.x,
              y: top,
              width: chart.width,
              height: paintedHeight,
              radius: options.radius,
              interaction: { point, affinity: "y" },
              style: { fill, fillOpacity: options.fillOpacity }
            });
          });
          return {
            nodes: [
              {
                kind: "group",
                key: id,
                className: "ts-chart__band ts-chart__band-y",
                ariaHidden: true,
                children: nodes
              }
            ]
          };
        }
      };
    },
    options.motion,
    options.renderer
  );
}
function inferBandwidth(scale, values, span, count) {
  const spacing = minimumMappedSpacing(scale, values);
  return spacing !== void 0 ? spacing * 0.8 : Math.min(48, span / Math.max(2, count + 1) * 0.8);
}
export {
  bandX,
  bandY
};
