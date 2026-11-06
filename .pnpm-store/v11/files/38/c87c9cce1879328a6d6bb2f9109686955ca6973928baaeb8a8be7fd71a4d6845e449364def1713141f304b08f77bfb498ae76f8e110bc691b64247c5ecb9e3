import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { View } from "react-native";
import {
  createChartCursorHostSession,
  resolveChartFocusStrategy,
  resolveFocusPresentation,
  resolveMarkStateScene
} from "@tanstack/charts/cursor/host";
import { createChartRuntime } from "@tanstack/charts/runtime";
import { viewportInteractionPoints } from "@tanstack/charts/scene";
import {
  adjacentFocusPoint,
  createNativeChartFocusModel,
  samePointIdentity,
  samePointReferences
} from "./interaction.js";
import { resolveNativePaint } from "./paint.js";
import { NativeChartScene } from "./SvgScene.js";
function Chart(props) {
  const {
    definition,
    accessibilityLabel,
    accessibilityHint,
    width,
    height,
    aspectRatio,
    style,
    color = "#111827",
    focusFill = "#ffffff",
    fontFamily,
    fontStyle,
    fontStretch,
    letterSpacing,
    direction,
    locale,
    fontScale,
    idPrefix: idPrefixOption,
    testID,
    measureText,
    resolvePaint = resolveNativePaint,
    onFocusChange,
    onFocusGroupChange,
    onSelect,
    onRender,
    renderTooltip
  } = props;
  const generatedId = React.useId();
  const idPrefix = idPrefixOption ?? `ts-chart-${generatedId.replaceAll(/[^a-zA-Z0-9_-]/g, "")}`;
  const runtime = React.useMemo(
    () => createChartRuntime({
      defaultTheme: typeof color === "string" ? { foreground: color, muted: color, grid: color } : void 0
    }),
    [color]
  );
  const [layout, setLayout] = React.useState(null);
  const resolvedAspectRatio = positiveFinite(aspectRatio);
  const explicitWidth = positiveFinite(width);
  const explicitHeight = positiveFinite(height);
  const sceneSize = resolveSceneSize(
    explicitWidth,
    explicitHeight,
    resolvedAspectRatio,
    layout
  );
  const scene = React.useMemo(
    () => sceneSize ? runtime.render(definition, sceneSize, {
      measureText,
      typography: {
        fontFamily,
        fontStyle,
        fontStretch,
        letterSpacing,
        direction,
        locale,
        fontScale
      }
    }) : null,
    [
      definition,
      direction,
      fontFamily,
      fontScale,
      fontStretch,
      fontStyle,
      letterSpacing,
      locale,
      measureText,
      runtime,
      sceneSize?.height,
      sceneSize?.width
    ]
  );
  const focusModel = React.useMemo(
    () => scene ? createNativeChartFocusModel(scene, definition) : null,
    [definition, scene]
  );
  const interactionPoints = React.useMemo(
    () => scene ? viewportInteractionPoints(scene) : emptyChartPoints,
    [scene]
  );
  const cursorBinding = definition.cursor;
  const cursorMatch = cursorBinding?.mode === "focus" ? cursorBinding.match ?? "xy" : void 0;
  const cursorSession = React.useMemo(
    () => cursorBinding ? createChartCursorHostSession(cursorBinding) : void 0,
    [
      cursorBinding?.controller,
      cursorBinding?.mode,
      cursorBinding?.use,
      cursorMatch
    ]
  );
  const subscribeCursor = React.useCallback(
    (listener) => cursorSession?.subscribe(listener) ?? subscribeEmptyCursor(),
    [cursorSession]
  );
  const getCursorState = React.useCallback(
    () => cursorSession?.getState() ?? getEmptyCursorState(),
    [cursorSession]
  );
  const cursorState = React.useSyncExternalStore(subscribeCursor, getCursorState, getCursorState);
  const cursorPresentation = React.useMemo(
    () => scene && cursorBinding && cursorSession ? cursorSession.resolvePresentation(scene, cursorBinding, cursorState) : null,
    [cursorBinding, cursorSession, cursorState, scene]
  );
  const controlledFocusedPoints = React.useMemo(() => {
    if (!scene || cursorBinding?.mode !== "focus" || !cursorSession) {
      return emptyChartPoints;
    }
    return cursorSession.resolveFocus(
      interactionPoints,
      cursorBinding,
      cursorState,
      resolveChartFocusStrategy(definition.focus)
    );
  }, [
    cursorBinding,
    cursorSession,
    cursorState,
    definition.focus,
    interactionPoints,
    scene
  ]);
  const [localFocusedPoints, setLocalFocusedPoints] = React.useState([]);
  const localFocusedPointsRef = React.useRef(localFocusedPoints);
  const previousCursorBindingRef = React.useRef({
    controller: cursorBinding?.controller,
    mode: cursorBinding?.mode,
    match: cursorMatch,
    use: cursorBinding?.use
  });
  const cursorBindingChanged = previousCursorBindingRef.current.controller !== cursorBinding?.controller || previousCursorBindingRef.current.mode !== cursorBinding?.mode || previousCursorBindingRef.current.match !== cursorMatch || previousCursorBindingRef.current.use !== cursorBinding?.use;
  const focusedPoints = cursorBinding ? cursorBinding.mode === "focus" ? controlledFocusedPoints : emptyChartPoints : cursorBindingChanged ? emptyChartPoints : localFocusedPoints;
  const focusedPointsRef = React.useRef(focusedPoints);
  focusedPointsRef.current = focusedPoints;
  const callbackPointsRef = React.useRef(
    localFocusedPoints
  );
  const onFocusChangeRef = React.useRef(onFocusChange);
  const onFocusGroupChangeRef = React.useRef(onFocusGroupChange);
  const onRenderRef = React.useRef(onRender);
  onFocusChangeRef.current = onFocusChange;
  onFocusGroupChangeRef.current = onFocusGroupChange;
  onRenderRef.current = onRender;
  const [pinnedKey, setPinnedKey] = React.useState(null);
  const [pointer, setPointer] = React.useState(
    null
  );
  const [focusSource, setFocusSource] = React.useState("programmatic");
  const tooltipInput = React.useMemo(
    () => resolveNativeTooltipInput(definition.tooltip),
    [definition.tooltip]
  );
  const TooltipComponent = tooltipInput?.component;
  const tooltipOptions = tooltipInput?.options;
  const sticky = Boolean(tooltipInput) && tooltipOptions?.sticky !== false;
  const freeCursor = cursorBinding?.mode === "free";
  const datumInteractive = Boolean(focusModel?.navigation.length);
  const pointerInteractive = definition.pointer !== false && (datumInteractive || Boolean(scene && freeCursor));
  const keyboardInteractive = definition.keyboard !== false && datumInteractive && !freeCursor;
  const interactionPinned = cursorBinding ? cursorState?.pinned === true : pinnedKey !== null;
  const resolvedFocusSource = cursorBinding ? cursorState?.source ?? focusSource : focusSource;
  const resolvedPointer = cursorBindingChanged || cursorBinding && (cursorState?.source !== "pointer" || !cursorSession?.owns(cursorState)) ? null : pointer;
  const cursorCurrentlyPinned = () => cursorBinding ? cursorSession?.getState()?.pinned === true : pinnedKey !== null;
  const commitLocalFocus = React.useCallback(
    (points) => {
      const current = localFocusedPointsRef.current;
      if (samePointReferences(points, current)) return;
      localFocusedPointsRef.current = points;
      focusedPointsRef.current = points;
      callbackPointsRef.current = points;
      setLocalFocusedPoints(points);
      onFocusChangeRef.current?.(points[0] ?? null);
      onFocusGroupChangeRef.current?.(points);
    },
    []
  );
  React.useEffect(() => () => runtime.destroy(), [runtime]);
  React.useEffect(() => () => cursorSession?.destroy(), [cursorSession]);
  React.useEffect(() => {
    if (scene) onRenderRef.current?.({ scene });
  }, [scene]);
  React.useEffect(() => {
    if (!cursorBindingChanged) return;
    previousCursorBindingRef.current = {
      controller: cursorBinding?.controller,
      mode: cursorBinding?.mode,
      match: cursorMatch,
      use: cursorBinding?.use
    };
    localFocusedPointsRef.current = emptyChartPoints;
    setLocalFocusedPoints(emptyChartPoints);
    setPinnedKey(null);
    setPointer(null);
  }, [
    cursorBinding?.controller,
    cursorBinding?.mode,
    cursorBinding?.use,
    cursorBindingChanged,
    cursorMatch
  ]);
  React.useEffect(() => {
    const previous = callbackPointsRef.current;
    if (sameFocusedPointValues(focusedPoints, previous)) {
      callbackPointsRef.current = focusedPoints;
      return;
    }
    callbackPointsRef.current = focusedPoints;
    onFocusChangeRef.current?.(focusedPoints[0] ?? null);
    onFocusGroupChangeRef.current?.(focusedPoints);
  }, [focusedPoints]);
  React.useEffect(() => {
    if (cursorBinding) return;
    const previous = localFocusedPointsRef.current[0];
    if (!focusModel || !previous) return;
    const restored = focusModel.restore(previous);
    if (restored) {
      const next = focusModel.group(restored);
      const current = localFocusedPointsRef.current;
      if (sameFocusedPointValues(next, current)) {
        if (!samePointReferences(next, current)) {
          localFocusedPointsRef.current = next;
          callbackPointsRef.current = next;
          setLocalFocusedPoints(next);
        }
        return;
      }
      setFocusSource("restored");
      commitLocalFocus(next);
    } else {
      setPinnedKey(null);
      commitLocalFocus([]);
    }
  }, [commitLocalFocus, cursorBinding, focusModel]);
  React.useEffect(() => {
    if (!cursorBinding && !sticky) setPinnedKey(null);
  }, [cursorBinding, sticky]);
  React.useEffect(() => {
    if (cursorBinding && (!cursorState || cursorState.source !== "pointer")) {
      setPointer(null);
    }
  }, [cursorBinding, cursorState]);
  const clearOwnedTransientCursor = React.useCallback(() => {
    if (!cursorBinding || !cursorSession) return false;
    const cleared = cursorSession.clearOwnedTransient();
    if (!cleared) return false;
    focusedPointsRef.current = emptyChartPoints;
    return true;
  }, [cursorBinding, cursorSession]);
  const dismiss = React.useCallback(() => {
    setPinnedKey(null);
    setPointer(null);
    if (cursorBinding) {
      focusedPointsRef.current = emptyChartPoints;
      cursorSession?.clear();
    } else commitLocalFocus([]);
  }, [commitLocalFocus, cursorBinding, cursorSession]);
  const positionAtEvent = React.useCallback(
    (event) => {
      if (!scene) return null;
      const measuredWidth = layout?.width ?? scene.width;
      const measuredHeight = layout?.height ?? scene.height;
      if (measuredWidth <= 0 || measuredHeight <= 0) return null;
      const position = {
        x: event.nativeEvent.locationX / measuredWidth * scene.width,
        y: event.nativeEvent.locationY / measuredHeight * scene.height
      };
      setPointer(position);
      return position;
    },
    [layout?.height, layout?.width, scene]
  );
  const pointsAtEvent = React.useCallback(
    (event) => {
      const position = positionAtEvent(event);
      return position && focusModel ? focusModel.resolve(position.x, position.y) : emptyChartPoints;
    },
    [focusModel, positionAtEvent]
  );
  const publishFocusCursor = (points, source, pinned) => {
    if (!scene || cursorBinding?.mode !== "focus" || !cursorSession) {
      return false;
    }
    const point = points[0];
    if (!point) {
      clearOwnedTransientCursor();
      return true;
    }
    const state = cursorSession.createFocusState(scene, cursorBinding, {
      primary: point,
      group: points,
      source,
      pinned
    });
    focusedPointsRef.current = points;
    cursorSession.publish(state);
    return true;
  };
  const commitInteractionFocus = (points, source, pinned = cursorCurrentlyPinned()) => {
    if (publishFocusCursor(points, source, pinned)) return;
    if (cursorBinding) return;
    setFocusSource(source);
    commitLocalFocus(points);
  };
  const updateFreeCursor = (event, pinned) => {
    if (!scene || cursorBinding?.mode !== "free" || !cursorSession) return false;
    const position = positionAtEvent(event);
    if (!position || !plotContains(scene, position)) {
      setPointer(null);
      clearOwnedTransientCursor();
      return true;
    }
    const state = cursorSession.createFreeState(
      scene,
      cursorBinding,
      position,
      "pointer",
      pinned
    );
    cursorSession.publish(state);
    return true;
  };
  const handleResponderGrant = (event) => {
    if (cursorCurrentlyPinned()) return;
    if (updateFreeCursor(event, false)) return;
    commitInteractionFocus(pointsAtEvent(event), "pointer", false);
  };
  const handleResponderMove = (event) => {
    if (cursorCurrentlyPinned()) return;
    if (updateFreeCursor(event, false)) return;
    commitInteractionFocus(pointsAtEvent(event), "pointer", false);
  };
  const handleResponderRelease = (event) => {
    if (cursorBinding?.mode === "free") {
      if (cursorSession?.getState()?.pinned) {
        if (cursorBinding.pin) dismiss();
      } else {
        updateFreeCursor(event, cursorBinding.pin === true);
      }
      onSelect?.(null);
      return;
    }
    const points = pointsAtEvent(event);
    const point = points[0] ?? null;
    definition.selection?.change(point, "pointer");
    if (cursorBinding?.mode === "focus") {
      const canPin = cursorBinding.pin === true || sticky;
      const currentlyPinned = cursorSession?.getState()?.pinned === true;
      if (currentlyPinned && canPin) dismiss();
      else
        commitInteractionFocus(
          points,
          "pointer",
          currentlyPinned || canPin && point !== null
        );
    } else {
      if (sticky) setPinnedKey(pinnedKey ? null : point?.key ?? null);
      commitInteractionFocus(points, "pointer");
    }
    onSelect?.(point);
  };
  const handleResponderTerminate = () => {
    if (cursorCurrentlyPinned()) return;
    setPointer(null);
    if (cursorBinding) {
      clearOwnedTransientCursor();
    } else commitLocalFocus([]);
  };
  const handleLayout = (event) => {
    const next = event.nativeEvent.layout;
    if (!positiveFinite(next.width) || !positiveFinite(next.height)) return;
    setLayout(
      (current) => current?.width === next.width && current.height === next.height ? current : { width: next.width, height: next.height }
    );
  };
  const navigate = (direction2) => {
    if (!focusModel || freeCursor) return;
    const point = adjacentFocusPoint(
      focusModel,
      focusedPointsRef.current[0] ?? null,
      direction2
    );
    setPointer(null);
    commitInteractionFocus(
      point ? focusModel.group(point) : emptyChartPoints,
      "keyboard"
    );
  };
  const activate = () => {
    const point = focusedPointsRef.current[0] ?? null;
    if (!point) return;
    definition.selection?.change(point, "keyboard");
    if (cursorBinding?.mode === "focus") {
      const canPin = cursorBinding.pin === true || sticky;
      if (canPin) {
        if (cursorSession?.getState()?.pinned) dismiss();
        else publishFocusCursor(focusedPointsRef.current, "keyboard", true);
      }
    } else if (!cursorBinding && sticky) {
      setPinnedKey((current) => current ? null : point.key);
    }
    onSelect?.(point);
  };
  const handleAccessibilityAction = (event) => {
    switch (event.nativeEvent.actionName) {
      case "increment":
        navigate(1);
        break;
      case "decrement":
        navigate(-1);
        break;
      case "activate":
        activate();
        break;
      case "escape":
        dismiss();
        break;
    }
  };
  const handleFocus = () => {
    if (!keyboardInteractive || focusedPointsRef.current.length) return;
    navigate(1);
  };
  const focusedPoint = focusedPoints[0] ?? null;
  const focus = React.useMemo(
    () => focusedPoint ? {
      primary: focusedPoint,
      group: focusedPoints,
      source: resolvedFocusSource,
      pinned: interactionPinned
    } : null,
    [focusedPoint, focusedPoints, interactionPinned, resolvedFocusSource]
  );
  const presentedScene = React.useMemo(
    () => scene ? resolveMarkStateScene(scene, focus, resolvedPointer).scene : null,
    [focus, resolvedPointer, scene]
  );
  const focusPresentation = React.useMemo(
    () => presentedScene ? resolveFocusPresentation(
      presentedScene,
      focus,
      resolvedPointer,
      cursorPresentation
    ) : { under: [], over: [] },
    [cursorPresentation, focus, presentedScene, resolvedPointer]
  );
  return /* @__PURE__ */ jsx(
    View,
    {
      accessible: true,
      accessibilityActions: !keyboardInteractive ? void 0 : [
        { name: "increment" },
        { name: "decrement" },
        { name: "activate" },
        { name: "escape" }
      ],
      accessibilityHint,
      accessibilityLabel,
      accessibilityRole: keyboardInteractive ? "adjustable" : "image",
      accessibilityValue: focusedPoint ? { text: describePoint(focusedPoint) } : void 0,
      focusable: keyboardInteractive,
      onAccessibilityAction: handleAccessibilityAction,
      onBlur: handleResponderTerminate,
      onFocus: handleFocus,
      onLayout: handleLayout,
      onMoveShouldSetResponder: () => false,
      onResponderGrant: handleResponderGrant,
      onResponderMove: handleResponderMove,
      onResponderRelease: handleResponderRelease,
      onResponderTerminate: handleResponderTerminate,
      onResponderTerminationRequest: () => true,
      onStartShouldSetResponder: () => pointerInteractive,
      style: [
        {
          position: "relative",
          overflow: "visible",
          width: explicitWidth ?? "100%",
          height: explicitHeight ?? (resolvedAspectRatio === void 0 ? 320 : void 0),
          aspectRatio: explicitHeight === void 0 ? resolvedAspectRatio : void 0
        },
        style
      ],
      testID,
      children: scene ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          NativeChartScene,
          {
            scene: presentedScene ?? scene,
            color,
            fontFamily,
            fontStyle,
            fontStretch,
            letterSpacing,
            direction,
            fontScale,
            idPrefix,
            resolvePaint,
            focusFill,
            focusPresentation
          }
        ),
        TooltipComponent && focusedPoints.length ? /* @__PURE__ */ jsx(
          TooltipComponent,
          {
            scene,
            width: layout?.width ?? scene.width,
            height: layout?.height ?? scene.height,
            points: focusedPoints,
            pointer: resolvedPointer,
            focusSource: resolvedFocusSource,
            options: tooltipOptions,
            pinned: interactionPinned,
            color,
            resolvePaint,
            dismiss,
            render: renderTooltip
          }
        ) : null
      ] }) : null
    }
  );
}
const emptyChartPoints = [];
function subscribeEmptyCursor() {
  return () => {
  };
}
function getEmptyCursorState() {
  return null;
}
function plotContains(scene, position) {
  return position.x >= scene.chart.x && position.x <= scene.chart.x + scene.chart.width && position.y >= scene.chart.y && position.y <= scene.chart.y + scene.chart.height;
}
function sameFocusedPointValues(left, right) {
  return left.length === right.length && left.every((point, index) => {
    const current = right[index];
    return current !== void 0 && samePointIdentity(point, current) && Object.is(point.group, current.group) && point.groupLabel === current.groupLabel && sameChartValue(point.xValue, current.xValue) && sameChartValue(point.yValue, current.yValue) && sameChartValue(point.x1Value, current.x1Value) && sameChartValue(point.x2Value, current.x2Value) && sameChartValue(point.y1Value, current.y1Value) && sameChartValue(point.y2Value, current.y2Value) && point.xInterval === current.xInterval && point.yInterval === current.yInterval && Object.is(point.x, current.x) && Object.is(point.y, current.y) && point.color === current.color;
  });
}
function sameChartValue(left, right) {
  return left instanceof Date && right instanceof Date ? left.getTime() === right.getTime() : Object.is(left, right);
}
function resolveNativeTooltipInput(input) {
  if (!input) return null;
  const extension = "create" in input ? input : input.use;
  if (!isNativeTooltipExtension(extension)) {
    throw new Error(
      "React Native charts require a tooltip extension from @tanstack/charts/react-native/tooltip."
    );
  }
  if (!("create" in input) && input.portal) {
    throw new Error(
      "React Native charts do not support browser tooltip portal extensions."
    );
  }
  return {
    component: extension.create(),
    options: "create" in input ? void 0 : input
  };
}
function isNativeTooltipExtension(extension) {
  const candidate = extension;
  return candidate.__chartExtensionType === "tooltip" && candidate.__chartTooltipHost === "react-native";
}
function resolveSceneSize(width, height, aspectRatio, layout) {
  const resolvedWidth = width ?? layout?.width;
  if (!resolvedWidth) return null;
  const resolvedHeight = height ?? (aspectRatio === void 0 ? layout?.height ?? (width === void 0 ? void 0 : 320) : resolvedWidth / aspectRatio);
  return resolvedHeight ? { width: resolvedWidth, height: resolvedHeight } : null;
}
function positiveFinite(value) {
  return value !== void 0 && Number.isFinite(value) && value > 0 ? value : void 0;
}
function describePoint(point) {
  return [
    point.groupLabel,
    formatValue(point.xValue),
    formatValue(point.yValue)
  ].filter(Boolean).join(", ");
}
function formatValue(value) {
  return value instanceof Date ? Number.isNaN(+value) ? "Invalid Date" : value.toISOString().replace("T00:00:00.000Z", "") : typeof value === "number" ? value.toLocaleString() : String(value);
}
export {
  Chart
};
