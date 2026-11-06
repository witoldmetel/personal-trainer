import { valueKey } from "./scales.js";
const polarFocusGeometry = /* @__PURE__ */ Symbol("tanstack-charts-polar-focus");
var Geometry = /* @__PURE__ */ ((Geometry2) => {
  Geometry2[Geometry2["Scope"] = 0] = "Scope";
  Geometry2[Geometry2["Angle"] = 1] = "Angle";
  Geometry2[Geometry2["Radius"] = 2] = "Radius";
  Geometry2[Geometry2["OffsetX"] = 3] = "OffsetX";
  Geometry2[Geometry2["OffsetY"] = 4] = "OffsetY";
  return Geometry2;
})(Geometry || {});
function withPolarFocusGeometry(point, layout, angle, radius, offsetX, offsetY) {
  return Object.assign(point, {
    [polarFocusGeometry]: [layout, angle, radius, offsetX, offsetY]
  });
}
const focusGroupAngle = {
  resolve(points, context) {
    const maximum = Math.max(0, context.maxDistance);
    let nearest;
    let nearestGeometry;
    let primaryDistance = maximum;
    let secondaryDistance = Infinity;
    for (const point of points) {
      const geometry = geometryForPoint(point);
      if (!geometry) continue;
      const centerX = point.x - geometry[3 /* OffsetX */];
      const centerY = point.y - geometry[4 /* OffsetY */];
      const nextPrimary = distanceToPolarRay(
        context.x,
        context.y,
        centerX,
        centerY,
        geometry[1 /* Angle */],
        geometry[0 /* Scope */].radius
      );
      if (nextPrimary > primaryDistance) continue;
      const nextSecondary = Math.hypot(point.x - context.x, point.y - context.y);
      if (nextPrimary < primaryDistance || nextSecondary < secondaryDistance) {
        nearest = point;
        nearestGeometry = geometry;
        primaryDistance = nextPrimary;
        secondaryDistance = nextSecondary;
      }
    }
    return nearest && nearestGeometry ? groupAnglePoints(points, nearest, nearestGeometry) : [];
  },
  group(points, context) {
    const geometry = geometryForPoint(context.point);
    return geometry ? groupAnglePoints(points, context.point, geometry) : [context.point];
  },
  navigation(points) {
    const sorted = points.flatMap((point) => {
      const geometry = geometryForPoint(point);
      return geometry ? [{ point, geometry }] : [];
    }).sort(
      (left, right) => left.geometry[1 /* Angle */] - right.geometry[1 /* Angle */] || left.geometry[2 /* Radius */] - right.geometry[2 /* Radius */]
    );
    const scopes = /* @__PURE__ */ new Map();
    return sorted.flatMap(({ point, geometry }) => {
      let values = scopes.get(geometry[0 /* Scope */]);
      if (!values) scopes.set(geometry[0 /* Scope */], values = /* @__PURE__ */ new Set());
      const key = valueKey(point.xValue);
      if (values.has(key)) return [];
      values.add(key);
      return [point];
    });
  }
};
function geometryForPoint(point) {
  return point[polarFocusGeometry];
}
function groupAnglePoints(points, point, geometry) {
  const value = valueKey(point.xValue);
  const unique = /* @__PURE__ */ new Map();
  unique.set(valueKey(point.group), point);
  for (const candidate of points) {
    const candidateGeometry = geometryForPoint(candidate);
    if (candidateGeometry?.[0 /* Scope */] !== geometry[0 /* Scope */] || valueKey(candidate.xValue) !== value) {
      continue;
    }
    const group = valueKey(candidate.group);
    if (!unique.has(group)) unique.set(group, candidate);
  }
  const sorted = [...unique.values()].sort(
    (left, right) => (geometryForPoint(left)?.[2 /* Radius */] ?? 0) - (geometryForPoint(right)?.[2 /* Radius */] ?? 0)
  );
  return [point, ...sorted.filter((candidate) => candidate !== point)];
}
function distanceToPolarRay(x, y, centerX, centerY, angle, radius) {
  const unitX = Math.sin(angle);
  const unitY = -Math.cos(angle);
  const deltaX = x - centerX;
  const deltaY = y - centerY;
  const projection = Math.min(
    Math.max(deltaX * unitX + deltaY * unitY, 0),
    Math.max(0, radius)
  );
  return Math.hypot(deltaX - projection * unitX, deltaY - projection * unitY);
}
export {
  focusGroupAngle,
  withPolarFocusGeometry
};
