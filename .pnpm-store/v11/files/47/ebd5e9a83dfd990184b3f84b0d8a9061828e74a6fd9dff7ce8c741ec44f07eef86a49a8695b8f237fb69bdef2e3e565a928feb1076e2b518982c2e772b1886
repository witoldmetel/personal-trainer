const defaultFocusLayer = /* @__PURE__ */ Symbol("default-focus-layer");
function markDefaultFocusLayer(layer) {
  if (layer.focus) Object.assign(layer.focus, { [defaultFocusLayer]: true });
  return layer;
}
function isDefaultFocusLayer(layer) {
  return layer.focus?.[defaultFocusLayer] === true;
}
export {
  isDefaultFocusLayer,
  markDefaultFocusLayer
};
