import { valueKey } from "./scales.js";
function resolveCategoricalLegendItems(colors, format = String) {
  return colors.domain.map((value) => ({
    key: valueKey(value),
    value,
    label: format(value),
    color: colors.map(value)
  }));
}
function layoutCategoricalLegendItems(itemCount, width, minimumItemWidth) {
  const columns = Math.max(
    1,
    Math.min(itemCount || 1, Math.floor(width / minimumItemWidth) || 1)
  );
  return {
    columns,
    rows: Math.ceil(itemCount / columns),
    itemWidth: width / columns
  };
}
function layoutCategoricalLegendFlow(itemWidths, width, gap, justify) {
  const availableWidth = Math.max(0, finiteNumber(width));
  const itemGap = Math.max(0, finiteNumber(gap));
  const rows = [];
  itemWidths.forEach((candidateWidth, index) => {
    const itemWidth = Math.min(
      availableWidth,
      Math.max(0, finiteNumber(candidateWidth))
    );
    const row = rows.at(-1);
    const nextWidth = row ? row.width + itemGap + itemWidth : itemWidth;
    if (!row || nextWidth > availableWidth) {
      rows.push({ indexes: [index], width: itemWidth });
      return;
    }
    row.indexes.push(index);
    row.width = nextWidth;
  });
  const items = [];
  rows.forEach((row, rowIndex) => {
    let x = justify === "center" ? (availableWidth - row.width) / 2 : 0;
    row.indexes.forEach((index) => {
      const itemWidth = Math.min(
        availableWidth,
        Math.max(0, finiteNumber(itemWidths[index]))
      );
      items.push({ index, row: rowIndex, x, width: itemWidth });
      x += itemWidth + itemGap;
    });
  });
  return { rows: rows.length, items };
}
function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
export {
  layoutCategoricalLegendFlow,
  layoutCategoricalLegendItems,
  resolveCategoricalLegendItems
};
