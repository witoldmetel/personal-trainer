import {
  Fragment,
  Teleport,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  shallowRef,
  useId
} from "vue";
import { resolveChartAdapterLayout } from "@tanstack/charts/adapter";
import { createChartRendererAdapter } from "@tanstack/charts/adapter/renderer";
import { renderChartSvg } from "@tanstack/charts/svg";
import { createSvgChartRenderer } from "@tanstack/charts/svg/renderer";
const ChartImplementation = defineComponent({
  name: "TanStackChart",
  inheritAttrs: false,
  props: {
    definition: { required: true },
    ariaLabel: { type: String, required: true },
    ariaDescription: String,
    height: Number,
    aspectRatio: Number,
    width: Number,
    initialWidth: Number,
    tabIndex: Number,
    idPrefix: String,
    className: String,
    renderSvg: Function,
    measureText: Function,
    onFocusChange: Function,
    onFocusGroupChange: Function,
    onSelect: Function,
    onRender: Function
  },
  setup(componentProps, { attrs, slots }) {
    const currentProps = () => ({
      ...componentProps,
      class: attrs.class,
      style: attrs.style
    });
    const props = currentProps();
    const generatedId = useId();
    const generatedPrefix = `ts-chart-${generatedId.replaceAll(/[^a-zA-Z0-9_-]/g, "")}`;
    const currentIdPrefix = () => currentProps().idPrefix ?? generatedPrefix;
    const tooltipBodyTarget = shallowRef(null);
    const defaultTooltipBody = () => renderDefaultTooltipBody(tooltipBodyTarget.value?.content ?? "");
    const handleTooltipBodyChange = (target) => {
      tooltipBodyTarget.value = target;
    };
    let activeRenderSvg = props.renderSvg ?? renderChartSvg;
    let renderer = createSvgChartRenderer(activeRenderSvg);
    const resolveRenderer = (renderSvg) => {
      if (renderSvg !== activeRenderSvg) {
        activeRenderSvg = renderSvg;
        renderer = createSvgChartRenderer(renderSvg);
      }
      return renderer;
    };
    const adapter = createChartRendererAdapter(
      toHostOptions(
        props,
        currentIdPrefix(),
        resolveRenderer,
        slots.tooltipBody ? handleTooltipBodyChange : void 0
      )
    );
    const initialMarkup = adapter.prerender();
    const container = ref();
    onMounted(() => {
      if (!container.value) return;
      adapter.update(
        toHostOptions(
          currentProps(),
          currentIdPrefix(),
          resolveRenderer,
          slots.tooltipBody ? handleTooltipBodyChange : void 0
        )
      );
      adapter.mount(container.value);
    });
    onUpdated(
      () => adapter.update(
        toHostOptions(
          currentProps(),
          currentIdPrefix(),
          resolveRenderer,
          slots.tooltipBody ? handleTooltipBodyChange : void 0
        )
      )
    );
    onBeforeUnmount(() => adapter.destroy());
    return () => {
      const props2 = currentProps();
      const layout = resolveChartAdapterLayout(props2);
      const target = tooltipBodyTarget.value;
      return [
        h(
          "div",
          {
            class: ["ts-chart-host", props2.class],
            style: [
              {
                position: "relative",
                width: props2.width === void 0 ? "100%" : props2.width,
                height: props2.height ?? (layout.aspectRatio === void 0 ? 320 : void 0),
                aspectRatio: props2.height === void 0 ? layout.aspectRatio : void 0
              },
              props2.style
            ]
          },
          [
            h("div", {
              ref: container,
              class: "ts-chart-surface",
              style: { width: "100%", height: "100%" },
              innerHTML: initialMarkup
            })
          ]
        ),
        target && slots.tooltipBody ? h(
          Teleport,
          { to: target.element },
          slots.tooltipBody({
            primaryPoint: target.primaryPoint,
            points: target.points,
            content: target.content,
            pinned: target.pinned,
            dismiss: target.dismiss,
            defaultBody: defaultTooltipBody
          })
        ) : null
      ];
    };
  }
});
const Chart = ChartImplementation;
function toHostOptions(props, idPrefix, resolveRenderer, onTooltipBodyChange) {
  const {
    class: _class,
    style: _style,
    renderSvg,
    onRender,
    ...options
  } = props;
  return {
    ...options,
    idPrefix,
    renderer: resolveRenderer(renderSvg ?? renderChartSvg),
    onRender: adaptOnRender(onRender),
    onTooltipBodyChange
  };
}
function adaptOnRender(onRender) {
  if (!onRender) return void 0;
  return (context) => {
    const svg = context.surface.defaultElement ?? context.surface.element;
    const SvgElement = context.container.ownerDocument.defaultView?.SVGSVGElement;
    if (!SvgElement || !(svg instanceof SvgElement)) {
      throw new TypeError("Expected the SVG chart surface.");
    }
    onRender({
      container: context.container,
      scene: context.scene,
      surface: context.surface,
      svg,
      interaction: context.interaction
    });
  };
}
function renderDefaultTooltipBody(content) {
  if (typeof content === "string") {
    return h(Fragment, null, [content]);
  }
  return h(Fragment, null, [
    content.title ? h(
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
      [
        content.color ? renderTooltipSwatch(content.color) : null,
        content.title
      ]
    ) : null,
    content.rows.length ? h(
      "div",
      { class: "ts-chart-tooltip__rows", "aria-hidden": "true" },
      content.rows.map(
        (row) => h(
          "div",
          {
            class: "ts-chart-tooltip__row",
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
            }
          },
          [
            row.color ? renderTooltipSwatch(row.color) : h("span"),
            h("span", row.label),
            h(
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
          ]
        )
      )
    ) : null
  ]);
}
function renderTooltipSwatch(color) {
  return h("span", {
    class: "ts-chart-tooltip__swatch",
    "aria-hidden": "true",
    style: {
      display: "block",
      width: "0.55rem",
      height: "0.55rem",
      borderRadius: "0.15rem",
      boxShadow: "inset 0 0 0 1px rgb(0 0 0/.12)",
      background: color
    }
  });
}
export {
  Chart
};
