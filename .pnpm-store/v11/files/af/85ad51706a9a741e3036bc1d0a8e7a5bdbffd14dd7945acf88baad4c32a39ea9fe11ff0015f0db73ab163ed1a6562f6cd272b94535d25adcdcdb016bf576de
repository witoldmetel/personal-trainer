import { applyMarkRenderer, normalizeMarkInitialization } from "./mark.js";
function createMarkWithScaleValues(initialize, motion, renderer) {
  const normalizedInitialize = (context) => {
    const initialized = normalizeMarkInitialization(initialize(context));
    const withMotion = motion === void 0 || initialized.motion !== void 0 ? initialized : { ...initialized, motion };
    return renderer === void 0 ? withMotion : applyMarkRenderer(withMotion, renderer);
  };
  return {
    initialize: normalizedInitialize,
    ...motion === void 0 ? {} : { motion },
    ...renderer === void 0 ? {} : { renderer }
  };
}
export {
  createMarkWithScaleValues
};
