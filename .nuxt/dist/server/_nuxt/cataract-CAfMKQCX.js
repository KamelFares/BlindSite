import { defineComponent, ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import "F:/BeBlind/BlindSite/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "F:/BeBlind/BlindSite/node_modules/hookable/dist/index.mjs";
import "F:/BeBlind/BlindSite/node_modules/unctx/dist/index.mjs";
import "F:/BeBlind/BlindSite/node_modules/h3/dist/index.mjs";
import "vue-router";
import "F:/BeBlind/BlindSite/node_modules/defu/dist/defu.mjs";
import "F:/BeBlind/BlindSite/node_modules/klona/dist/index.mjs";
import "F:/BeBlind/BlindSite/node_modules/cookie-es/dist/index.mjs";
import "F:/BeBlind/BlindSite/node_modules/destr/dist/index.mjs";
import "F:/BeBlind/BlindSite/node_modules/ohash/dist/index.mjs";
import "@vue/devtools-api";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cataract",
  __ssrInlineRender: true,
  setup(__props) {
    const severity = ref(4);
    const signs = ref([
      { id: "a", label: "EXIT", sub: "Doorway", tone: "green" },
      { id: "b", label: "INFO", sub: "Help desk", tone: "blue" },
      { id: "c", label: "STOP", sub: "Do not enter", tone: "amber" },
      { id: "d", label: "WC", sub: "Restroom", tone: "gray" },
      { id: "e", label: "SHOP", sub: "Market", tone: "blue" },
      { id: "f", label: "LIFT", sub: "Elevator", tone: "gray" }
    ]);
    const score = ref(0);
    const mistakes = ref(0);
    const targetLabel = ref("EXIT");
    const pickNewTarget = () => {
      const labels = signs.value.map((s) => s.label);
      targetLabel.value = labels[Math.floor(Math.random() * labels.length)];
    };
    const sceneFilterStyle = computed(() => {
      const s = severity.value;
      const blurPx = s / 10 * 7;
      const contrast = 1 - s / 10 * 0.35;
      const saturate = 1 - s / 10 * 0.25;
      const brightness = 1 + s / 10 * 0.08;
      return {
        filter: `blur(${blurPx.toFixed(2)}px) contrast(${contrast.toFixed(2)}) saturate(${saturate.toFixed(2)}) brightness(${brightness.toFixed(2)})`
      };
    });
    const glareStyle = computed(() => {
      const s = severity.value;
      const opacity = 0.05 + s / 10 * 0.22;
      return {
        opacity: opacity.toFixed(3)
      };
    });
    pickNewTarget();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "cataract-page" }, _attrs))} data-v-b2d59601><header class="cataract-page__header" data-v-b2d59601><h1 class="cataract-page__title" data-v-b2d59601>Cataract Simulation (Blur + Glare)</h1><p class="cataract-page__lead" data-v-b2d59601> Cataracts can cause blurred vision, reduced contrast, and strong glare around lights. This page simulates that effect. </p><div class="controls" aria-label="Cataract controls" data-v-b2d59601><label class="controls__label" for="severity" data-v-b2d59601> Severity: <strong data-v-b2d59601>${ssrInterpolate(severity.value)}</strong></label><input id="severity" class="controls__range" type="range" min="0" max="10" step="1"${ssrRenderAttr("value", severity.value)} data-v-b2d59601></div><p class="cataract-page__note" data-v-b2d59601> This is an empathy demo, not a medical tool. </p></header><main class="cataract-page__main" data-v-b2d59601><section class="game" aria-label="Find the sign game" data-v-b2d59601><div class="game__top" aria-live="polite" data-v-b2d59601><p class="game__prompt" data-v-b2d59601> Task: <strong data-v-b2d59601>Click the “${ssrInterpolate(targetLabel.value)}”</strong> sign. </p><p class="game__score" data-v-b2d59601> Score: <strong data-v-b2d59601>${ssrInterpolate(score.value)}</strong> | Mistakes: <strong data-v-b2d59601>${ssrInterpolate(mistakes.value)}</strong></p></div><div class="scene" style="${ssrRenderStyle(sceneFilterStyle.value)}" data-v-b2d59601><div class="scene__glare" style="${ssrRenderStyle(glareStyle.value)}" aria-hidden="true" data-v-b2d59601></div><div class="signs" aria-label="Signs" data-v-b2d59601><!--[-->`);
      ssrRenderList(signs.value, (s) => {
        _push(`<button type="button" class="${ssrRenderClass([`sign--${s.tone}`, "sign"])}" data-v-b2d59601><span class="sign__label" data-v-b2d59601>${ssrInterpolate(s.label)}</span><span class="sign__sub" data-v-b2d59601>${ssrInterpolate(s.sub)}</span></button>`);
      });
      _push(`<!--]--></div><div class="lights" aria-hidden="true" data-v-b2d59601><div class="light light--a" data-v-b2d59601></div><div class="light light--b" data-v-b2d59601></div></div></div><p class="game__hint" data-v-b2d59601> Tip: Increase severity to feel how glare + blur makes even simple reading harder. </p></section><section class="info" data-v-b2d59601><h2 data-v-b2d59601>What cataracts can feel like</h2><ul data-v-b2d59601><li data-v-b2d59601>Blurred or cloudy vision</li><li data-v-b2d59601>Halos and glare from bright lights</li><li data-v-b2d59601>Reduced contrast (everything looks “washed out”)</li><li data-v-b2d59601>Harder reading, especially at night</li></ul></section></main></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cataract.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cataract = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b2d59601"]]);
export {
  cataract as default
};
//# sourceMappingURL=cataract-CAfMKQCX.js.map
