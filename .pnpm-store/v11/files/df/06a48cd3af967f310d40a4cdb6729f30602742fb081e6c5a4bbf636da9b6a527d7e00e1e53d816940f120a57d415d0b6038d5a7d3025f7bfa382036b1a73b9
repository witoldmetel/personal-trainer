import { LitElement, html, nothing, render as renderLit } from "lit";
import { ref } from "lit/directives/ref.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { resolveChartAdapterLayout } from "@tanstack/charts/adapter";
import { createChartRendererAdapter } from "@tanstack/charts/adapter/renderer";
import { renderChartSvg } from "@tanstack/charts/svg";
import { createSvgChartRenderer } from "@tanstack/charts/svg/renderer";
let nextChartId = 0;
class Chart extends LitElement {
  static properties = {
    options: { attribute: false }
  };
  adapter;
  activeRenderSvg;
  renderer;
  tooltipBodyTarget;
  idPrefix = `ts-chart-lit-${++nextChartId}`;
  initialMarkup = "";
  mounted = false;
  createRenderRoot() {
    return this;
  }
  willUpdate(changed) {
    if (!changed.has("options") || !this.options) return;
    const options = toHostOptions(
      this.options,
      this.options.idPrefix ?? this.idPrefix,
      this.resolveRenderer(this.options.renderSvg ?? renderChartSvg),
      this.options.renderTooltipBody ? this.handleTooltipBodyChange : void 0
    );
    if (!this.adapter) {
      this.adapter = createChartRendererAdapter(options);
      this.initialMarkup = this.adapter.prerender();
    } else {
      this.adapter.update(options);
    }
  }
  firstUpdated() {
    this.mountAdapter();
  }
  updated(changed) {
    if (changed.has("options") && this.tooltipBodyTarget) {
      this.renderTooltipBody(this.tooltipBodyTarget);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated && !this.mounted) {
      void this.updateComplete.then(() => this.mountAdapter());
    }
  }
  disconnectedCallback() {
    this.mounted = false;
    this.adapter?.destroy();
    this.clearTooltipBody();
    super.disconnectedCallback();
  }
  render() {
    if (!this.options) return void 0;
    const layout = resolveChartAdapterLayout(this.options);
    const outerStyle = [
      "display:block",
      "position:relative",
      `width:${this.options.width === void 0 ? "100%" : `${this.options.width}px`}`,
      this.options.height !== void 0 ? `height:${this.options.height}px` : layout.aspectRatio === void 0 ? "height:320px" : `aspect-ratio:${layout.aspectRatio}`,
      this.options.style
    ].filter(Boolean).join(";");
    return html`
      <div
        class=${this.options.class ? `ts-chart-host ${this.options.class}` : "ts-chart-host"}
        style=${outerStyle}
      >
        <div
          class="ts-chart-surface"
          style="width:100%;height:100%"
          data-chart-surface
        >
          ${unsafeHTML(this.initialMarkup)}
        </div>
      </div>
    `;
  }
  resolveRenderer(renderSvg) {
    if (!this.renderer || renderSvg !== this.activeRenderSvg) {
      this.activeRenderSvg = renderSvg;
      this.renderer = createSvgChartRenderer(renderSvg);
    }
    return this.renderer;
  }
  handleTooltipBodyChange = (target) => {
    if (!target) {
      this.clearTooltipBody();
      return;
    }
    if (this.tooltipBodyTarget && this.tooltipBodyTarget.element !== target.element) {
      renderLit(nothing, this.tooltipBodyTarget.element);
    }
    this.tooltipBodyTarget = target;
    this.renderTooltipBody(target);
  };
  renderTooltipBody(target) {
    const renderTooltipBody = this.options.renderTooltipBody;
    if (!renderTooltipBody) {
      renderLit(nothing, target.element);
      return;
    }
    renderLit(
      renderTooltipBody({
        primaryPoint: target.primaryPoint,
        points: target.points,
        content: target.content,
        defaultBody: renderDefaultTooltipBody(target.content),
        pinned: target.pinned,
        dismiss: target.dismiss
      }),
      target.element
    );
  }
  clearTooltipBody() {
    if (!this.tooltipBodyTarget) return;
    renderLit(nothing, this.tooltipBodyTarget.element);
    this.tooltipBodyTarget = void 0;
  }
  mountAdapter() {
    if (this.mounted) return;
    const container = this.querySelector("[data-chart-surface]");
    if (!container || !this.adapter) return;
    this.adapter.mount(container);
    this.mounted = true;
  }
}
function defineChartElement(tagName = "tanstack-chart") {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, Chart);
  }
}
function toHostOptions(props, idPrefix, renderer, onTooltipBodyChange) {
  const {
    class: _class,
    style: _style,
    renderSvg: _renderSvg,
    renderTooltipBody: _renderTooltipBody,
    onRender,
    ...options
  } = props;
  return {
    ...options,
    idPrefix,
    renderer,
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
  if (typeof content === "string") return html`${content}`;
  const title = content.title ? html`<div
        class="ts-chart-tooltip__title"
        style=${`display:flex;align-items:center;gap:0.4rem;font-weight:650;margin-bottom:${content.rows.length ? "0.3rem" : "0"}`}
      >
        ${content.color ? renderTooltipSwatch(content.color) : nothing}${content.title}
      </div>` : nothing;
  const rows = content.rows.length ? html`<div class="ts-chart-tooltip__rows" aria-hidden="true">
        ${content.rows.map(
    (row) => html`<div
              class="ts-chart-tooltip__row"
              data-active=${String(row.active === true)}
              style="display:grid;grid-template-columns:0.55rem minmax(0,1fr) auto;align-items:center;column-gap:0.4rem;${row.active ? "font-weight:var(--ts-chart-tooltip-active-row-font-weight, 700);background:var(--ts-chart-tooltip-active-row-background, color-mix(in srgb, currentColor 12%, transparent));border-radius:var(--ts-chart-tooltip-active-row-border-radius, .2rem);box-shadow:var(--ts-chart-tooltip-active-row-shadow, 0 0 0 2px color-mix(in srgb, currentColor 12%, transparent))" : ""}"
            >
              ${row.color ? renderTooltipSwatch(row.color) : html`<span></span>`}<span>${row.label}</span
              ><span
                style="text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap"
                >${row.value}</span
              >
            </div>`
  )}
      </div>` : nothing;
  return html`${title}${rows}`;
}
function renderTooltipSwatch(color) {
  return html`<span
    ${ref((element) => {
    if (element) element.style.background = color;
  })}
    class="ts-chart-tooltip__swatch"
    aria-hidden="true"
    style="display:block;width:0.55rem;height:0.55rem;border-radius:0.15rem;box-shadow:inset 0 0 0 1px rgb(0 0 0/.12)"
  ></span>`;
}
export {
  Chart,
  defineChartElement
};
