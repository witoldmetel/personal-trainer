import { Fragment, jsx, jsxs } from "preact/jsx-runtime";
import { createPortal } from "preact/compat";
import { useId, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import { createChartRendererAdapter } from "@tanstack/charts/adapter/renderer";
import { renderChartSvg } from "@tanstack/charts/svg";
import { createSvgChartRenderer } from "@tanstack/charts/svg/renderer";
function Chart(props) {
  const generatedId = useId();
  const idPrefix = props.idPrefix ?? `ts-chart-${generatedId.replaceAll(/[^a-zA-Z0-9_-]/g, "")}`;
  const renderer = useMemo(
    () => createSvgChartRenderer(
      props.renderSvg ?? renderChartSvg
    ),
    [props.renderSvg]
  );
  const [tooltipBodyTarget, setTooltipBodyTarget] = useState(null);
  const options = useMemo(
    () => toHostOptions(props, idPrefix, renderer, setTooltipBodyTarget),
    [props, idPrefix, renderer]
  );
  const adapterRef = useRef(null);
  adapterRef.current ??= createChartRendererAdapter(options);
  const adapter = adapterRef.current;
  const initialMarkupRef = useRef(null);
  initialMarkupRef.current ??= adapter.prerender();
  const containerRef = useRef(null);
  const aspectRatio = resolveAspectRatio(props.aspectRatio);
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    adapter.mount(container);
    return () => adapter.destroy();
  }, []);
  useLayoutEffect(() => {
    adapter.update(options);
  }, [adapter, options]);
  const tooltipPortal = props.renderTooltipBody && tooltipBodyTarget ? createPortal(
    props.renderTooltipBody({
      primaryPoint: tooltipBodyTarget.primaryPoint,
      points: tooltipBodyTarget.points,
      content: tooltipBodyTarget.content,
      defaultBody: /* @__PURE__ */ jsx(DefaultTooltipBody, { content: tooltipBodyTarget.content }),
      pinned: tooltipBodyTarget.pinned,
      dismiss: tooltipBodyTarget.dismiss
    }),
    tooltipBodyTarget.element
  ) : null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: props.className ? `ts-chart-host ${props.className}` : "ts-chart-host",
        style: hostStyle(props, aspectRatio),
        children: /* @__PURE__ */ jsx(
          "div",
          {
            ref: containerRef,
            className: "ts-chart-surface",
            style: { width: "100%", height: "100%" },
            dangerouslySetInnerHTML: { __html: initialMarkupRef.current }
          }
        )
      }
    ),
    tooltipPortal
  ] });
}
function resolveAspectRatio(aspectRatio) {
  return typeof aspectRatio === "number" && Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : void 0;
}
function hostStyle(props, aspectRatio) {
  return Object.assign(
    {
      position: "relative",
      width: props.width === void 0 ? "100%" : props.width,
      height: props.height ?? (aspectRatio === void 0 ? 320 : void 0),
      aspectRatio: props.height === void 0 ? aspectRatio : void 0
    },
    props.style
  );
}
function toHostOptions(props, idPrefix, renderer, onTooltipBodyChange) {
  const {
    className: _className,
    style: _style,
    renderSvg: _renderSvg,
    renderTooltipBody,
    onRender,
    ...options
  } = props;
  const handleRender = onRender ? (context) => {
    const element = context.surface.defaultElement ?? context.surface.element;
    const SvgElement = context.container.ownerDocument.defaultView?.SVGSVGElement;
    if (!SvgElement || !(element instanceof SvgElement)) {
      throw new TypeError("Expected the SVG chart surface.");
    }
    onRender({
      container: context.container,
      scene: context.scene,
      surface: context.surface,
      svg: element,
      interaction: context.interaction
    });
  } : void 0;
  return {
    ...options,
    idPrefix,
    renderer,
    onRender: handleRender,
    onTooltipBodyChange: renderTooltipBody ? onTooltipBodyChange : void 0
  };
}
function DefaultTooltipBody({
  content
}) {
  if (typeof content === "string") return content;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    content.title ? /* @__PURE__ */ jsxs(
      "div",
      {
        className: "ts-chart-tooltip__title",
        style: {
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontWeight: 650,
          marginBottom: content.rows.length ? "0.3rem" : 0
        },
        children: [
          content.color ? /* @__PURE__ */ jsx(TooltipSwatch, { color: content.color }) : null,
          content.title
        ]
      }
    ) : null,
    content.rows.length ? /* @__PURE__ */ jsx("div", { className: "ts-chart-tooltip__rows", "aria-hidden": "true", children: content.rows.map((row, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "ts-chart-tooltip__row",
        "data-active": String(row.active === true),
        style: {
          display: "grid",
          gridTemplateColumns: "0.55rem minmax(0,1fr) auto",
          alignItems: "center",
          columnGap: "0.4rem",
          fontWeight: row.active ? "var(--ts-chart-tooltip-active-row-font-weight, 700)" : void 0,
          background: row.active ? "var(--ts-chart-tooltip-active-row-background, color-mix(in srgb, currentColor 12%, transparent))" : void 0,
          borderRadius: row.active ? "var(--ts-chart-tooltip-active-row-border-radius, .2rem)" : void 0,
          boxShadow: row.active ? "var(--ts-chart-tooltip-active-row-shadow, 0 0 0 2px color-mix(in srgb, currentColor 12%, transparent))" : void 0
        },
        children: [
          row.color ? /* @__PURE__ */ jsx(TooltipSwatch, { color: row.color }) : /* @__PURE__ */ jsx("span", {}),
          /* @__PURE__ */ jsx("span", { children: row.label }),
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap"
              },
              children: row.value
            }
          )
        ]
      },
      `${row.label}\0${index}`
    )) }) : null
  ] });
}
function TooltipSwatch({ color }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: "ts-chart-tooltip__swatch",
      "aria-hidden": "true",
      style: {
        display: "block",
        width: "0.55rem",
        height: "0.55rem",
        borderRadius: "0.15rem",
        boxShadow: "inset 0 0 0 1px rgb(0 0 0/.12)",
        background: color
      }
    }
  );
}
export {
  Chart
};
