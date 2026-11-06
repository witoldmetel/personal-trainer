const mappedCoordinates = /* @__PURE__ */ new WeakMap();
function setMappedFocusCoordinate(point, axis, coordinate) {
  const current = mappedCoordinates.get(point);
  if (current) {
    current[axis] = coordinate;
  } else {
    mappedCoordinates.set(point, { [axis]: coordinate });
  }
}
function mappedFocusCoordinate(point, axis) {
  return mappedCoordinates.get(point)?.[axis] ?? point[axis];
}
export {
  mappedFocusCoordinate,
  setMappedFocusCoordinate
};
