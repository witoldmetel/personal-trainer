import { hexbin as createHexbinLayout } from "d3-hexbin";
import { hexagon } from "./hexagon.js";
import { createMark } from "./mark.js";
import { adoptResolvedChildMark } from "./resolved-layout-child.js";
import { projectLayoutX, projectLayoutY } from "./resolved-layout-position.js";
import { toArray, transformValues } from "./transform-internal.js";
import {
  assertTransformOutputNames,
  prepareOutputs,
  reducePreparedOutputs
} from "./transform-reduce-internal.js";
function hexbin(source, options) {
  const data = toArray(source);
  const binWidth = options.binWidth ?? 20;
  if (!Number.isFinite(binWidth) || binWidth <= 0) {
    throw new TypeError("hexbin: binWidth must be a positive finite number");
  }
  const outputs = options.outputs ?? {
    count: { reduce: "count" }
  };
  assertTransformOutputNames(
    outputs,
    ["x", "y", "source", "sourceIndexes"],
    "hexbin"
  );
  const preparedOutputs = prepareOutputs(data, outputs);
  const xValues = transformValues(data, options.x);
  const yValues = transformValues(data, options.y);
  const sourceRows = data.flatMap(
    (datum, sourceIndex) => {
      const xValue = xValues[sourceIndex];
      const yValue = yValues[sourceIndex];
      return isFiniteNumber(xValue) && isFiniteNumber(yValue) ? [{ datum, sourceIndex, xValue, yValue }] : [];
    }
  );
  const {
    x: _x,
    y: _y,
    binWidth: _binWidth,
    outputs: _outputs,
    ...presentation
  } = options;
  const layoutRadius = binWidth / Math.sqrt(3);
  const xScale = options.xScale ?? "x";
  const yScale = options.yScale ?? "y";
  return createMark(
    ({ markIndex }) => {
      const id = options.id ?? `hexbin-${markIndex}`;
      return {
        id,
        channels: {
          x: {
            scale: xScale,
            values: sourceRows.map((row) => row.xValue)
          },
          y: {
            scale: yScale,
            values: sourceRows.map((row) => row.yValue)
          }
        },
        resolveLayout: ({ chart, scales }) => {
          const resolvedXScale = scales[xScale];
          const resolvedYScale = scales[yScale];
          if (!resolvedXScale?.invert || !resolvedYScale?.invert) {
            throw new TypeError("hexbin: x and y scales must support inversion");
          }
          const rows = projectLayoutY(
            projectLayoutX(sourceRows, xValues, resolvedXScale),
            yValues,
            resolvedYScale
          );
          const layout = createHexbinLayout().x((row) => row.x).y((row) => row.y).radius(layoutRadius).extent([
            [chart.x, chart.y],
            [chart.x + chart.width, chart.y + chart.height]
          ]);
          const bins = layout([...rows]).map((bin) => {
            const x = resolvedXScale.invert(bin.x);
            const y = resolvedYScale.invert(bin.y);
            if (!isFiniteNumber(x) || !isFiniteNumber(y)) {
              throw new TypeError(
                "hexbin: x and y scales must invert to finite numbers"
              );
            }
            const sourceIndexes = bin.map((row) => row.sourceIndex);
            return {
              x,
              y,
              source: sourceIndexes.map((index) => data[index]),
              sourceIndexes,
              ...reducePreparedOutputs(
                data,
                sourceIndexes,
                {},
                preparedOutputs
              )
            };
          });
          const childOptions = {
            ...presentation,
            id,
            x: (datum) => datum.x,
            y: (datum) => datum.y,
            key: (datum) => `${datum.x}:${datum.y}`,
            r: presentation.r ?? Math.max(0, layoutRadius - 1)
          };
          const child = hexagon(bins, childOptions);
          return adoptResolvedChildMark(child.initialize({ markIndex }));
        }
      };
    },
    options.motion,
    options.renderer
  );
}
function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
export {
  hexbin
};
