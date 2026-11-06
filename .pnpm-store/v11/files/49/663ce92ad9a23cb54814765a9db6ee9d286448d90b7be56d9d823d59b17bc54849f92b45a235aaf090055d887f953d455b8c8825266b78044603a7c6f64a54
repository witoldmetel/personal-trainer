function markStatesMayUseCornerRadii(states) {
  return states?.some(({ style }) => {
    const radius = style.radius;
    return typeof radius === "function" || Array.isArray(radius);
  }) ?? false;
}
function resolveSceneRectRadius(radius, preferCornerRadii) {
  if (radius === void 0) {
    return preferCornerRadii ? { cornerRadii: [0, 0, 0, 0] } : {};
  }
  if (typeof radius !== "number") return { cornerRadii: radius };
  return preferCornerRadii ? { cornerRadii: [radius, radius, radius, radius] } : { radius };
}
export {
  markStatesMayUseCornerRadii,
  resolveSceneRectRadius
};
