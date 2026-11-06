import { __s as _$__s, bag2 as _$bag2, clone as _$clone, createElement as _$createElement, createPortal, hookSlots as _$hookSlots, memo, positionalChildren as _$positionalChildren, setStyle as _$setStyle, template as _$template, useId, useLayoutEffect, useMemo, useRef, useState } from "octane";
const _t$0 = /* @__PURE__ */ _$template('<span class="ts-chart-tooltip__swatch" aria-hidden="true"></span>');
const _hs$ = /* @__PURE__ */ _$hookSlots(12);
const _h$0 = /* @__PURE__ */ Symbol(_hs$);
const _h$1 = /* @__PURE__ */ Symbol(_hs$ + 1);
const _h$2 = /* @__PURE__ */ Symbol(_hs$ + 2);
const _h$3 = /* @__PURE__ */ Symbol(_hs$ + 3);
const _h$4 = /* @__PURE__ */ Symbol(_hs$ + 4);
const _h$5 = /* @__PURE__ */ Symbol(_hs$ + 5);
const _h$6 = /* @__PURE__ */ Symbol(_hs$ + 6);
const _h$7 = /* @__PURE__ */ Symbol(_hs$ + 7);
const _h$8 = /* @__PURE__ */ Symbol(_hs$ + 8);
const _h$9 = /* @__PURE__ */ Symbol(_hs$ + 9);
const _h$10 = /* @__PURE__ */ Symbol(_hs$ + 10);
const _h$11 = /* @__PURE__ */ Symbol(_hs$ + 11);
const _frag$0 = /* @__PURE__ */ _$__s(function _frag$02(props, __s, __extra) {
  let _b = __s.slots[0];
  if (_b === void 0) {
    let _m1;
    const _root = _$clone(_t$0);
    _m1 = _root;
    _b = _$bag2(__s, _root, void 0, _m1);
  }
  {
    const _v = props.h0;
    if (_b.a !== _v) {
      _$setStyle(_b.b, _v, _b.a);
      _b.a = _v;
    }
  }
});
import { createChartRendererAdapter } from "@tanstack/charts/adapter/renderer";
const ChartSurface = memo(
  function ChartSurface2(props) {
    return _$createElement("div", {
      ref: props.containerRef,
      class: "ts-chart-surface",
      style: { width: "100%", height: "100%" },
      dangerouslySetInnerHTML: { __html: props.markup }
    });
  },
  () => true
);
function RendererChart(props) {
  const containerRef = useRef(null, _h$0);
  const adapterRef = useRef(null, _h$1);
  const onFocusChangeRef = useRef(props.onFocusChange, _h$2);
  onFocusChangeRef.current = props.onFocusChange;
  const onSelectRef = useRef(props.onSelect, _h$3);
  onSelectRef.current = props.onSelect;
  const onFocusGroupChangeRef = useRef(props.onFocusGroupChange, _h$4);
  onFocusGroupChangeRef.current = props.onFocusGroupChange;
  const onRenderRef = useRef(props.onRender, _h$5);
  onRenderRef.current = props.onRender;
  const [tooltipBodyTarget, setTooltipBodyTarget] = useState(null, _h$6);
  const initialWidth = props.initialWidth ?? 640;
  const height = props.height;
  const aspectRatio = typeof props.aspectRatio === "number" && Number.isFinite(props.aspectRatio) && props.aspectRatio > 0 ? props.aspectRatio : void 0;
  const generatedId = useId(_h$7);
  const idPrefix = props.idPrefix ?? `ts-chart-${generatedId.replaceAll(/[^a-zA-Z0-9_-]/g, "")}`;
  const hostOptions = useMemo(
    () => ({
      renderer: props.renderer,
      definition: props.definition,
      ariaLabel: props.ariaLabel,
      ariaDescription: props.ariaDescription,
      height,
      aspectRatio,
      width: props.width,
      initialWidth,
      tabIndex: props.tabIndex,
      idPrefix,
      measureText: props.measureText,
      onFocusChange: (point) => onFocusChangeRef.current?.(point),
      onFocusGroupChange: (points) => onFocusGroupChangeRef.current?.(points),
      onSelect: (point) => onSelectRef.current?.(point),
      onRender: (context) => onRenderRef.current?.(context),
      onTooltipBodyChange: props.renderTooltipBody ? setTooltipBodyTarget : void 0
    }),
    [
      props.definition,
      props.ariaLabel,
      props.ariaDescription,
      props.width,
      height,
      aspectRatio,
      initialWidth,
      props.tabIndex,
      idPrefix,
      props.renderer,
      props.measureText,
      Boolean(props.renderTooltipBody)
    ],
    _h$8
  );
  adapterRef.current ??= createChartRendererAdapter(hostOptions);
  const adapter = adapterRef.current;
  const initialMarkupRef = useRef(null, _h$9);
  initialMarkupRef.current ??= adapter.prerender();
  useLayoutEffect(
    () => {
      const container = containerRef.current;
      if (!container) return;
      adapter.update(hostOptions);
      adapter.mount(container);
      return () => adapter.destroy();
    },
    [],
    _h$10
  );
  useLayoutEffect(
    () => {
      adapter.update(hostOptions);
    },
    [adapter, hostOptions],
    _h$11
  );
  const tooltipPortal = props.renderTooltipBody && tooltipBodyTarget ? createPortal(
    props.renderTooltipBody({
      primaryPoint: tooltipBodyTarget.primaryPoint,
      points: tooltipBodyTarget.points,
      content: tooltipBodyTarget.content,
      pinned: tooltipBodyTarget.pinned,
      dismiss: tooltipBodyTarget.dismiss,
      defaultBody: _$createElement(DefaultTooltipBody, { content: tooltipBodyTarget.content })
    }),
    tooltipBodyTarget.element
  ) : null;
  return _$positionalChildren([
    _$createElement(
      "div",
      {
        class: props.class ? `ts-chart-host ${props.class}` : "ts-chart-host",
        style: {
          position: "relative",
          width: props.width === void 0 ? "100%" : props.width,
          height: height ?? (aspectRatio ? void 0 : 320),
          aspectRatio: height === void 0 ? aspectRatio : void 0,
          ...props.style
        }
      },
      _$createElement(ChartSurface, { markup: initialMarkupRef.current, containerRef })
    ),
    tooltipPortal
  ]);
}
function DefaultTooltipBody({ content }) {
  if (typeof content === "string") return content ?? null;
  return _$positionalChildren([
    content.title ? _$createElement(
      "div",
      {
        class: "ts-chart-tooltip__title",
        style: {
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontWeight: 650,
          marginBottom: content.rows.length ? "0.3rem" : 0
        }
      },
      content.color ? _$createElement(TooltipSwatch, { color: content.color }) : null,
      content.title
    ) : null,
    content.rows.length ? _$createElement("div", { class: "ts-chart-tooltip__rows", "aria-hidden": "true" }, content.rows.map((row, index) => _$createElement(
      "div",
      {
        class: "ts-chart-tooltip__row",
        "data-active": String(row.active === true),
        key: `${row.label}\0${index}`,
        style: {
          display: "grid",
          gridTemplateColumns: "0.55rem minmax(0,1fr) auto",
          alignItems: "center",
          columnGap: "0.4rem",
          fontWeight: row.active ? "var(--ts-chart-tooltip-active-row-font-weight, 700)" : void 0,
          background: row.active ? "var(--ts-chart-tooltip-active-row-background, color-mix(in srgb, currentColor 12%, transparent))" : void 0,
          borderRadius: row.active ? "var(--ts-chart-tooltip-active-row-border-radius, .2rem)" : void 0,
          boxShadow: row.active ? "var(--ts-chart-tooltip-active-row-shadow, 0 0 0 2px color-mix(in srgb, currentColor 12%, transparent))" : void 0
        }
      },
      row.color ? _$createElement(TooltipSwatch, { color: row.color }) : _$createElement("span", {}),
      _$createElement("span", {}, row.label),
      _$createElement(
        "span",
        {
          style: {
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap"
          }
        },
        row.value
      )
    ))) : null
  ]);
}
function TooltipSwatch({ color }) {
  return _$createElement(_frag$0, {
    h0: {
      display: "block",
      width: "0.55rem",
      height: "0.55rem",
      borderRadius: "0.15rem",
      boxShadow: "inset 0 0 0 1px rgb(0 0 0/.12)",
      background: color
    }
  });
}
TooltipSwatch.$$singleRoot = true;
export {
  RendererChart
};
