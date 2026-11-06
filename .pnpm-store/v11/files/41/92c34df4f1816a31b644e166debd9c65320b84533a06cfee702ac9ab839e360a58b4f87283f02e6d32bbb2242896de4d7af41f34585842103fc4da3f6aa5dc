function stagger(options) {
  const phases = values(options.phase ?? "enter");
  const roles = options.roles === void 0 ? void 0 : values(options.roles);
  const each = nonNegative(options.each);
  const offset = nonNegative(options.offset ?? 0);
  return {
    delay(context) {
      if (!phases.includes(context.phase) || roles !== void 0 && !roles.includes(context.role)) {
        return void 0;
      }
      const index = options.by === "series" ? context.seriesIndex : context.datumIndex;
      return offset + each * Math.max(0, index);
    }
  };
}
function values(value) {
  return Array.isArray(value) ? value : [value];
}
function nonNegative(value) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}
export {
  stagger
};
