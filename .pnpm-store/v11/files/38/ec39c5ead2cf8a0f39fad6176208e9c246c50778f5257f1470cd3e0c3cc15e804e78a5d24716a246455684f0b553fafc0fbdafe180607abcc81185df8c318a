import { stackOrderInsideOut } from "d3-shape";
import { valueKey } from "./scales.js";
function stackOuterEnds(positions, values, series, starts, ends, options = {}, fallbackSeries = "value") {
  const input = stackEndInput(
    positions,
    values,
    series,
    starts,
    ends,
    fallbackSeries
  );
  const orderedSeries = resolveSeriesOrder(input, options.order);
  if (options.reverse) orderedSeries.reverse();
  const seriesRank = new Map(
    orderedSeries.map((value, index) => [valueKey(value), index])
  );
  const orderedInput = [...input].sort(
    (left, right) => seriesRank.get(valueKey(left.series)) - seriesRank.get(valueKey(right.series))
  );
  const outerEnds = Array.from({
    length: positions.length
  });
  const paintGroups = groupStackEnds(input);
  const orderedGroups = groupStackEnds(orderedInput);
  const diverging = options.offset === void 0 || options.offset === "diverging";
  for (const [position, rows] of orderedGroups) {
    const paintRows = paintGroups.get(position);
    if (diverging) {
      const minimum = Math.min(...rows.flatMap((row) => [row.start, row.end]));
      const maximum = Math.max(...rows.flatMap((row) => [row.start, row.end]));
      if (maximum > 0) markExtremeEnd(rows, paintRows, "max", outerEnds);
      if (minimum < 0) markExtremeEnd(rows, paintRows, "min", outerEnds);
    } else {
      const baseline = rows[0].start;
      const terminal = rows.at(-1).end;
      let extreme;
      if (terminal < baseline) extreme = "min";
      else if (terminal > baseline) extreme = "max";
      else {
        const minimum = Math.min(...rows.flatMap((row) => [row.start, row.end]));
        const maximum = Math.max(...rows.flatMap((row) => [row.start, row.end]));
        extreme = baseline - minimum > maximum - baseline ? "min" : "max";
      }
      markExtremeEnd(rows, paintRows, extreme, outerEnds);
    }
  }
  return outerEnds;
}
function groupStackEnds(input) {
  const groups = /* @__PURE__ */ new Map();
  for (const row of input) {
    if (row.value === 0 || row.start === row.end) continue;
    const position = valueKey(row.position);
    const group = groups.get(position);
    if (group) group.push(row);
    else groups.set(position, [row]);
  }
  return groups;
}
function markExtremeEnd(geometryRows, paintRows, extreme, outerEnds) {
  if (geometryRows.length === 0) return;
  const target = Math[extreme](
    ...geometryRows.flatMap((row) => [row.start, row.end])
  );
  for (const row of paintRows) {
    const start = row.start === target;
    const end = row.end === target;
    if (!start && !end) continue;
    const existing = outerEnds[row.index];
    outerEnds[row.index] = {
      start: existing?.start === true || start,
      end: existing?.end === true || end
    };
  }
}
function stackEndInput(positions, values, series, starts, ends, fallbackSeries) {
  const input = [];
  for (let index = 0; index < positions.length; index += 1) {
    const position = positions[index];
    const value = values[index];
    const start = starts[index];
    const end = ends[index];
    if (!isChartValue(position) || !isFiniteNumber(value) || !isFiniteNumber(start) || !isFiniteNumber(end))
      continue;
    const seriesValue = series[index];
    input.push({
      index,
      position,
      value,
      start,
      end,
      series: isChartKey(seriesValue) ? seriesValue : fallbackSeries === "index" ? index : "value"
    });
  }
  return input;
}
function resolveSeriesOrder(input, order) {
  const firstSeen = [];
  const seen = /* @__PURE__ */ new Set();
  for (const row of input) {
    const identity = valueKey(row.series);
    if (seen.has(identity)) continue;
    seen.add(identity);
    firstSeen.push(row.series);
  }
  if (Array.isArray(order)) {
    const explicit = [...order];
    const explicitKeys = new Set(explicit.map(valueKey));
    return [
      ...explicit,
      ...firstSeen.filter((value) => !explicitKeys.has(valueKey(value)))
    ];
  }
  if (order === "inside-out") {
    const positions = [];
    const positionIndex = /* @__PURE__ */ new Map();
    for (const row of input) {
      const identity = valueKey(row.position);
      if (positionIndex.has(identity)) continue;
      positionIndex.set(identity, positions.length);
      positions.push(row.position);
    }
    const seriesValues = firstSeen.map((seriesValue) => {
      const identity = valueKey(seriesValue);
      const output = positions.map(() => [0, 0]);
      for (const row of input) {
        if (valueKey(row.series) !== identity) continue;
        output[positionIndex.get(valueKey(row.position))][1] = row.value;
      }
      return output;
    });
    return stackOrderInsideOut(
      seriesValues
    ).map((index) => firstSeen[index]);
  }
  if (order !== "ascending" && order !== "descending") return firstSeen;
  const totals = new Map(firstSeen.map((value) => [valueKey(value), 0]));
  for (const row of input) {
    const key = valueKey(row.series);
    totals.set(key, (totals.get(key) ?? 0) + Math.abs(row.value));
  }
  return firstSeen.sort((left, right) => {
    const difference = (totals.get(valueKey(left)) ?? 0) - (totals.get(valueKey(right)) ?? 0);
    return order === "ascending" ? difference : -difference;
  });
}
function isChartKey(value) {
  return typeof value === "string" || typeof value === "number";
}
function isChartValue(value) {
  return typeof value === "string" || isFiniteNumber(value) || value instanceof Date && Number.isFinite(value.getTime());
}
function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
export {
  stackOuterEnds
};
