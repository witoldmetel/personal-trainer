import { hookSlots as _$hookSlots, ssrComponent as _$ssrComponent, useMemo } from "octane/server";
const _hs$ = /* @__PURE__ */ _$hookSlots(1);
const _h$0 = /* @__PURE__ */ Symbol(_hs$);
import { renderChartSvg } from "@tanstack/charts/svg";
import { createSvgChartRenderer } from "@tanstack/charts/svg/renderer";
import { RendererChart } from "./RendererChart.js";
const Chart = function Chart2(props, __s, __extra) {
  const renderSvg = props.renderSvg ?? renderChartSvg;
  const renderer = useMemo(() => createSvgChartRenderer(renderSvg), [renderSvg], _h$0);
  const onRender = props.onRender ? (context) => {
    const svg = context.surface.defaultElement ?? context.surface.element;
    const SvgElement = context.container.ownerDocument.defaultView?.SVGSVGElement;
    if (!SvgElement || !(svg instanceof SvgElement)) {
      throw new TypeError("Expected the SVG chart surface.");
    }
    props.onRender?.({
      container: context.container,
      scene: context.scene,
      surface: context.surface,
      svg,
      interaction: context.interaction
    });
  } : void 0;
  return _$ssrComponent(__s, RendererChart, { ...props, "renderer": renderer, "onRender": onRender });
};
export {
  Chart
};
