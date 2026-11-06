const childrenByOptions = /* @__PURE__ */ new WeakMap();
function svgRenderChildren(options) {
  return childrenByOptions.get(options);
}
function withSvgRenderChildren(options, children, render) {
  const previous = childrenByOptions.get(options);
  childrenByOptions.set(options, children);
  try {
    return render();
  } finally {
    if (previous) childrenByOptions.set(options, previous);
    else childrenByOptions.delete(options);
  }
}
export {
  svgRenderChildren,
  withSvgRenderChildren
};
