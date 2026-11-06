import { applyMarkRendererToScene } from "./mark.js";
function createPolarMark(initialize, motion, renderer) {
  return {
    ...motion === void 0 ? {} : { motion },
    ...renderer === void 0 ? {} : { renderer },
    initialize(context) {
      const initialized = initialize(context);
      const withMotion = motion === void 0 || initialized.motion !== void 0 ? initialized : { ...initialized, motion };
      if (renderer === void 0) return withMotion;
      const render = withMotion.render;
      return {
        ...withMotion,
        render: (renderContext) => applyMarkRendererToScene(render(renderContext), renderer)
      };
    }
  };
}
export {
  createPolarMark
};
