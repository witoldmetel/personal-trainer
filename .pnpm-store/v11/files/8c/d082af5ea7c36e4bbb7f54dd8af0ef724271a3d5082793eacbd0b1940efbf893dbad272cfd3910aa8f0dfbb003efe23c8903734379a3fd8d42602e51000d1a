import { Portal as e, className as t, createComponent as n, effect as r, insert as i, memo as a, setAttribute as o, setStyleProperty as s, style as c, template as l, use as u } from "solid-js/web";
import { Show as d, createEffect as f, createMemo as p, createSignal as m, createUniqueId as h, onCleanup as g, onMount as _ } from "solid-js";
import { createChartRendererAdapter as v } from "@tanstack/charts/adapter/renderer";
import { renderChartSvg as y } from "@tanstack/charts/svg";
import { createSvgChartRenderer as b } from "@tanstack/charts/svg/renderer";
//#region packages/solid-charts/src/Chart.tsx
var x = /*#__PURE__*/ l("<div style=position:relative><div class=ts-chart-surface style=width:100%;height:100%>"), S = /*#__PURE__*/ l("<div class=ts-chart-tooltip__title style=display:flex;align-items:center;gap:0.4rem;font-weight:650>"), C = /*#__PURE__*/ l("<div class=ts-chart-tooltip__rows aria-hidden=true>"), w = /*#__PURE__*/ l("<div class=ts-chart-tooltip__row style=\"display:grid;grid-template-columns:0.55rem minmax(0,1fr) auto;align-items:center;column-gap:0.4rem\"><span></span><span style=text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap>"), T = /*#__PURE__*/ l("<span>"), E = /*#__PURE__*/ l("<span class=ts-chart-tooltip__swatch aria-hidden=true style=\"display:block;width:0.55rem;height:0.55rem;border-radius:0.15rem;box-shadow:inset 0 0 0 1px rgb(0 0 0/.12)\">");
function D(e) {
	let i = `ts-chart-${h().replaceAll(/[^a-zA-Z0-9_-]/g, "")}`, a = p(() => b(e.renderSvg ?? y)), [o, s] = m(null), l = () => O(e, e.idPrefix ?? i, a(), s), S = v(l()), C = S.prerender(), w;
	f(() => S.update(l())), _(() => S.mount(w)), g(() => S.destroy());
	let T = () => typeof e.aspectRatio == "number" && Number.isFinite(e.aspectRatio) && e.aspectRatio > 0 ? e.aspectRatio : void 0;
	return [(() => {
		var n = x(), i = n.firstChild, a = w;
		return typeof a == "function" ? u(a, i) : w = i, i.innerHTML = C, r((r) => {
			var i = e.class ? `ts-chart-host ${e.class}` : "ts-chart-host", a = {
				width: e.width === void 0 ? "100%" : `${e.width}px`,
				height: e.height === void 0 ? T() === void 0 ? "320px" : void 0 : `${e.height}px`,
				"aspect-ratio": e.height === void 0 ? T()?.toString() : void 0,
				...e.style
			};
			return i !== r.e && t(n, r.e = i), r.t = c(n, a, r.t), r;
		}, {
			e: void 0,
			t: void 0
		}), n;
	})(), n(d, {
		get when() {
			return e.renderTooltipBody;
		},
		keyed: !0,
		children: (e) => n(d, {
			get when() {
				return o();
			},
			children: (t) => n(k, {
				render: e,
				target: t
			})
		})
	})];
}
function O(e, t, n, r) {
	let { class: i, style: a, renderSvg: o, renderTooltipBody: s, onRender: c, ...l } = e, u = c ? (e) => {
		let t = e.surface.defaultElement ?? e.surface.element, n = e.container.ownerDocument.defaultView?.SVGSVGElement;
		if (!n || !(t instanceof n)) throw TypeError("Expected the SVG chart surface.");
		c({
			container: e.container,
			scene: e.scene,
			surface: e.surface,
			svg: t,
			interaction: e.interaction
		});
	} : void 0;
	return {
		...l,
		idPrefix: t,
		renderer: n,
		onRender: u,
		onTooltipBodyChange: s ? r : void 0
	};
}
function k(t) {
	let r = {
		get primaryPoint() {
			return t.target().primaryPoint;
		},
		get points() {
			return t.target().points;
		},
		get content() {
			return t.target().content;
		},
		defaultBody: n(A, { get content() {
			return t.target().content;
		} }),
		get pinned() {
			return t.target().pinned;
		},
		get dismiss() {
			return t.target().dismiss;
		}
	};
	return n(e, {
		get mount() {
			return t.target().element;
		},
		children: t.render(r)
	});
}
function A(e) {
	return () => {
		let t = e.content;
		return typeof t == "string" ? t : n(j, { content: t });
	};
}
function j(e) {
	return [a(() => a(() => !!e.content.title)() ? (() => {
		var t = S();
		return i(t, (() => {
			var t = a(() => !!e.content.color);
			return () => t() ? n(M, { get color() {
				return e.content.color;
			} }) : null;
		})(), null), i(t, () => e.content.title, null), r((n) => s(t, "margin-bottom", e.content.rows.length ? "0.3rem" : 0)), t;
	})() : null), a(() => a(() => !!e.content.rows.length)() ? (() => {
		var t = C();
		return i(t, () => e.content.rows.map((e) => (() => {
			var t = w(), c = t.firstChild, l = c.nextSibling;
			return i(t, (() => {
				var t = a(() => !!e.color);
				return () => t() ? n(M, { get color() {
					return e.color;
				} }) : T();
			})(), c), i(c, () => e.label), i(l, () => e.value), r((n) => {
				var r = String(e.active === !0), i = e.active ? "var(--ts-chart-tooltip-active-row-font-weight, 700)" : void 0, a = e.active ? "var(--ts-chart-tooltip-active-row-background, color-mix(in srgb, currentColor 12%, transparent))" : void 0, c = e.active ? "var(--ts-chart-tooltip-active-row-border-radius, .2rem)" : void 0, l = e.active ? "var(--ts-chart-tooltip-active-row-shadow, 0 0 0 2px color-mix(in srgb, currentColor 12%, transparent))" : void 0;
				return r !== n.e && o(t, "data-active", n.e = r), i !== n.t && s(t, "font-weight", n.t = i), a !== n.a && s(t, "background", n.a = a), c !== n.o && s(t, "border-radius", n.o = c), l !== n.i && s(t, "box-shadow", n.i = l), n;
			}, {
				e: void 0,
				t: void 0,
				a: void 0,
				o: void 0,
				i: void 0
			}), t;
		})())), t;
	})() : null)];
}
function M(e) {
	return (() => {
		var t = E();
		return r((n) => s(t, "background", e.color)), t;
	})();
}
//#endregion
export { D as Chart };
