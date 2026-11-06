import { resolveChartAdapterLayout } from "@tanstack/charts/adapter";
import { createChartRendererAdapter } from "@tanstack/charts/adapter/renderer";
import { renderChartSvg } from "@tanstack/charts/svg";
import { createSvgChartRenderer } from "@tanstack/charts/svg/renderer";
let nextChartId = 0;
function charts(Alpine) {
  Alpine.directive(
    "chart",
    (element, { expression }, { evaluateLater, effect, cleanup }) => {
      const evaluate = evaluateLater(expression);
      const surface = element.ownerDocument.createElement("div");
      surface.className = "ts-chart-surface";
      surface.style.width = "100%";
      surface.style.height = "100%";
      const hadHostClass = element.classList.contains("ts-chart-host");
      element.classList.add("ts-chart-host");
      element.append(surface);
      const initialStyle = {
        position: element.style.position,
        width: element.style.width,
        height: element.style.height,
        aspectRatio: element.style.aspectRatio
      };
      let adapter;
      let activeRenderSvg;
      let renderer = createSvgChartRenderer(renderChartSvg);
      let activeRenderTooltipBody;
      let onTooltipBodyChange;
      const generatedId = `ts-chart-alpine-${++nextChartId}`;
      effect(() => {
        evaluate((value) => {
          const options = value;
          if (options.renderSvg !== activeRenderSvg) {
            activeRenderSvg = options.renderSvg;
            renderer = createSvgChartRenderer(
              options.renderSvg ?? renderChartSvg
            );
          }
          if (options.renderTooltipBody !== activeRenderTooltipBody) {
            activeRenderTooltipBody = options.renderTooltipBody;
            onTooltipBodyChange = options.renderTooltipBody ? createTooltipBodyChangeHandler(options.renderTooltipBody) : void 0;
          }
          const hostOptions = {
            renderer,
            definition: options.definition,
            ariaLabel: options.ariaLabel,
            ariaDescription: options.ariaDescription,
            className: options.className,
            tabIndex: options.tabIndex,
            idPrefix: options.idPrefix ?? generatedId,
            height: options.height,
            aspectRatio: options.aspectRatio,
            width: options.width,
            initialWidth: options.initialWidth,
            measureText: options.measureText,
            onFocusChange: options.onFocusChange,
            onFocusGroupChange: options.onFocusGroupChange,
            onSelect: options.onSelect,
            onRender: options.onRender ? (context) => {
              const svg = context.surface.defaultElement ?? context.surface.element;
              const SvgElement = context.container.ownerDocument.defaultView?.SVGSVGElement;
              if (!SvgElement || !(svg instanceof SvgElement)) {
                throw new TypeError("Expected the SVG chart surface.");
              }
              options.onRender?.({
                container: context.container,
                scene: context.scene,
                surface: context.surface,
                svg,
                interaction: context.interaction
              });
            } : void 0,
            onTooltipBodyChange
          };
          applyLayout(element, options, initialStyle);
          if (adapter) {
            adapter.update(hostOptions);
          } else {
            adapter = createChartRendererAdapter(hostOptions);
            adapter.mount(surface);
          }
        });
      });
      cleanup(() => {
        adapter?.destroy();
        surface.remove();
        if (!hadHostClass) element.classList.remove("ts-chart-host");
        Object.assign(element.style, initialStyle);
      });
    }
  );
}
function createTooltipBodyChangeHandler(renderTooltipBody) {
  let activeElement;
  return (target) => {
    if (activeElement) activeElement.replaceChildren();
    activeElement = target?.element;
    if (!target) return;
    const defaultBody = createDefaultTooltipBody(
      target.element.ownerDocument,
      target.content
    );
    const content = renderTooltipBody({
      primaryPoint: target.primaryPoint,
      points: target.points,
      content: target.content,
      defaultBody,
      pinned: target.pinned,
      dismiss: target.dismiss
    });
    const fragment = target.element.ownerDocument.createDocumentFragment();
    appendTooltipBody(fragment, content);
    target.element.replaceChildren(fragment);
  };
}
function appendTooltipBody(parent, content) {
  if (content === null || content === void 0) return;
  if (Array.isArray(content)) {
    for (const child of content) appendTooltipBody(parent, child);
    return;
  }
  if (typeof content === "string" || typeof content === "number") {
    parent.append(String(content));
    return;
  }
  parent.append(content);
}
function createDefaultTooltipBody(document, content) {
  const fragment = document.createDocumentFragment();
  if (typeof content === "string") {
    fragment.append(content);
    return fragment;
  }
  if (content.title) {
    const title = document.createElement("div");
    title.className = "ts-chart-tooltip__title";
    title.style.cssText = `display:flex;align-items:center;gap:.4rem;font-weight:650;margin-bottom:${content.rows.length ? ".3rem" : "0"}`;
    if (content.color)
      title.append(createTooltipSwatch(document, content.color));
    title.append(content.title);
    fragment.append(title);
  }
  if (content.rows.length) {
    const rows = document.createElement("div");
    rows.className = "ts-chart-tooltip__rows";
    rows.setAttribute("aria-hidden", "true");
    for (const row of content.rows) {
      const line = document.createElement("div");
      line.className = "ts-chart-tooltip__row";
      line.style.cssText = "display:grid;grid-template-columns:.55rem minmax(0,1fr) auto;align-items:center;column-gap:.4rem";
      line.dataset.active = String(row.active === true);
      if (row.active) {
        line.style.fontWeight = "var(--ts-chart-tooltip-active-row-font-weight, 700)";
        line.style.background = "var(--ts-chart-tooltip-active-row-background, color-mix(in srgb, currentColor 12%, transparent))";
        line.style.borderRadius = "var(--ts-chart-tooltip-active-row-border-radius, .2rem)";
        line.style.boxShadow = "var(--ts-chart-tooltip-active-row-shadow, 0 0 0 2px color-mix(in srgb, currentColor 12%, transparent))";
      }
      const swatch = row.color ? createTooltipSwatch(document, row.color) : document.createElement("span");
      const label = document.createElement("span");
      label.textContent = row.label;
      const value = document.createElement("span");
      value.textContent = row.value;
      value.style.cssText = "text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap";
      line.append(swatch, label, value);
      rows.append(line);
    }
    fragment.append(rows);
  }
  return fragment;
}
function createTooltipSwatch(document, color) {
  const swatch = document.createElement("span");
  swatch.className = "ts-chart-tooltip__swatch";
  swatch.setAttribute("aria-hidden", "true");
  swatch.style.cssText = "display:block;width:.55rem;height:.55rem;border-radius:.15rem;box-shadow:inset 0 0 0 1px rgb(0 0 0/.12)";
  swatch.style.background = color;
  return swatch;
}
function applyLayout(element, options, initial) {
  const layout = resolveChartAdapterLayout(options);
  element.style.position = initial.position || "relative";
  element.style.width = options.width === void 0 ? initial.width || "100%" : `${options.width}px`;
  element.style.height = options.height !== void 0 ? `${options.height}px` : layout.aspectRatio === void 0 ? initial.height || "320px" : initial.height;
  element.style.aspectRatio = options.height === void 0 && layout.aspectRatio !== void 0 ? String(layout.aspectRatio) : initial.aspectRatio;
}
export {
  charts
};
