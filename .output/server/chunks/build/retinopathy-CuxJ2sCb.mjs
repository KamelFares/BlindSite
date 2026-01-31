import { defineComponent, ref, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "retinopathy",
  __ssrInlineRender: true,
  setup(__props) {
    const severity = ref(5);
    const score = ref(0);
    const mistakes = ref(0);
    const labels = ref([]);
    const target = ref("EXIT");
    const floaters = ref([]);
    const patches = ref([]);
    let nextId = 1;
    const randomBetween = (min, max) => Math.random() * (max - min) + min;
    const rebuildOverlay = () => {
      const s = severity.value;
      const floaterCount = Math.round(s / 10 * 10);
      const patchCount = Math.round(s / 10 * 6);
      floaters.value = Array.from({ length: floaterCount }, () => {
        const id = nextId++;
        return {
          id,
          x: randomBetween(5, 95),
          y: randomBetween(10, 90),
          vx: randomBetween(-0.02, 0.02),
          vy: randomBetween(-0.015, 0.015),
          s: randomBetween(0.8, 1.8)
        };
      });
      patches.value = Array.from({ length: patchCount }, () => {
        const id = nextId++;
        return {
          id,
          x: randomBetween(10, 90),
          y: randomBetween(15, 85),
          r: randomBetween(90, 180) + s * 6
        };
      });
    };
    const stageStyle = computed(() => {
      const s = severity.value;
      const blur = s / 10 * 7;
      const contrast = 1 - s / 10 * 0.25;
      return {
        "--stage-blur": `${blur.toFixed(2)}px`,
        "--stage-contrast": contrast.toFixed(2),
        "--overlay-opacity": (0.05 + s / 10 * 0.22).toFixed(3)
      };
    });
    watch(severity, () => {
      rebuildOverlay();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "retino" }, _attrs))} data-v-a42760a8><header class="retino__header" data-v-a42760a8><h1 class="retino__title" data-v-a42760a8>Diabetic Retinopathy (floaters + patches)</h1><p class="retino__lead" data-v-a42760a8> Diabetic retinopathy can cause blurry areas, dark patches, and floaters. This simulation overlays moving \u201Cfloaters\u201D and patchy blur while you try to read and click the correct label. </p><div class="controls" aria-label="Retinopathy controls" data-v-a42760a8><label class="controls__label" for="severity" data-v-a42760a8> Severity: <strong data-v-a42760a8>${ssrInterpolate(severity.value)}</strong></label><input id="severity" class="controls__range" type="range" min="0" max="10" step="1"${ssrRenderAttr("value", severity.value)} data-v-a42760a8></div></header><main class="retino__main" data-v-a42760a8><section class="game" aria-label="Read the label mini-game" data-v-a42760a8><div class="game__top" aria-live="polite" data-v-a42760a8><p class="game__prompt" data-v-a42760a8> Task: Click the label <strong data-v-a42760a8>\u201C${ssrInterpolate(target.value)}\u201D</strong></p><p class="game__score" data-v-a42760a8> Score: <strong data-v-a42760a8>${ssrInterpolate(score.value)}</strong> | Mistakes: <strong data-v-a42760a8>${ssrInterpolate(mistakes.value)}</strong></p></div><div class="stage" style="${ssrRenderStyle(stageStyle.value)}" data-v-a42760a8><div class="overlay" aria-hidden="true" data-v-a42760a8><!--[-->`);
      ssrRenderList(floaters.value, (f) => {
        _push(`<div class="floater" style="${ssrRenderStyle({
          left: `${f.x}%`,
          top: `${f.y}%`,
          transform: `translate(-50%,-50%) scale(${f.s})`
        })}" data-v-a42760a8></div>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(patches.value, (p) => {
        _push(`<div class="patch" style="${ssrRenderStyle({
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${p.r}px`,
          height: `${p.r}px`,
          transform: "translate(-50%,-50%)"
        })}" data-v-a42760a8></div>`);
      });
      _push(`<!--]--></div><div class="labels" data-v-a42760a8><!--[-->`);
      ssrRenderList(labels.value, (l) => {
        _push(`<button type="button" class="label" data-v-a42760a8>${ssrInterpolate(l)}</button>`);
      });
      _push(`<!--]--></div></div><p class="game__hint" data-v-a42760a8> Tip: Increase severity and notice how \u201Ceasy reading\u201D becomes slow and frustrating. </p></section><section class="info" data-v-a42760a8><h2 data-v-a42760a8>What this can represent</h2><ul data-v-a42760a8><li data-v-a42760a8>Blurred or missing patches</li><li data-v-a42760a8>Floaters that drift across the field of view</li><li data-v-a42760a8>Harder reading / recognizing small text</li></ul></section></main></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/retinopathy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const retinopathy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a42760a8"]]);

export { retinopathy as default };
//# sourceMappingURL=retinopathy-CuxJ2sCb.mjs.map
