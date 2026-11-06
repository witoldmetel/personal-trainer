import {
  resolveChartFocusStrategy,
  resolveChartPointerFocus,
  restoreChartFocusPoint,
  sameChartPointIdentity
} from "@tanstack/charts/cursor/host";
import { focusDisabled } from "@tanstack/charts/focus/disabled";
import {
  findNearestPoint,
  viewportInteractionPoints
} from "@tanstack/charts/scene";
function createNativeChartFocusModel(scene, definition) {
  const points = viewportInteractionPoints(scene);
  const strategy = resolveFocusStrategy(definition.focus);
  const spatialIndex = definition.focus === false ? void 0 : definition.spatialIndex?.(points, { scene });
  const maxDistance = definition.maxFocusDistance ?? 48;
  const navigation = strategy?.navigation(points) ?? sceneOrder(points);
  return {
    resolve(x, y) {
      const focused = resolveChartPointerFocus(
        scene,
        strategy,
        x,
        y,
        maxDistance,
        points
      );
      if (focused) return focused;
      const point = spatialIndex ? spatialIndex.findNearest(x, y, maxDistance) : findNearestPoint(scene, x, y, maxDistance, points);
      const visible = point ? restoreFocusedPoint(points, point) : null;
      return visible ? [visible] : [];
    },
    group(point) {
      return strategy?.group(points, { point }) ?? [point];
    },
    navigation,
    restore(point) {
      return restoreFocusedPoint(points, point);
    }
  };
}
function adjacentFocusPoint(model, current, direction) {
  const currentIndex = current ? model.navigation.findIndex((point) => samePointIdentity(point, current)) : -1;
  const nextIndex = currentIndex < 0 ? direction > 0 ? 0 : model.navigation.length - 1 : Math.max(
    0,
    Math.min(model.navigation.length - 1, currentIndex + direction)
  );
  return model.navigation[nextIndex] ?? null;
}
function samePointIdentity(left, right) {
  return sameChartPointIdentity(left, right);
}
function samePointReferences(left, right) {
  return left.length === right.length && left.every((point, index) => point === right[index]);
}
function resolveFocusStrategy(focus) {
  if (focus === false) return focusDisabled;
  return resolveChartFocusStrategy(focus);
}
function sceneOrder(points) {
  return points.map((point, index) => ({ point, index })).sort(
    (left, right) => left.point.x - right.point.x || left.point.y - right.point.y || left.index - right.index
  ).map(({ point }) => point);
}
const restoreFocusedPoint = restoreChartFocusPoint;
export {
  adjacentFocusPoint,
  createNativeChartFocusModel,
  samePointIdentity,
  samePointReferences
};
