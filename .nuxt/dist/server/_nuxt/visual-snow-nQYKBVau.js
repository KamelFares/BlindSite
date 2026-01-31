import { defineComponent, ref, watch, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
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
  __name: "visual-snow",
  __ssrInlineRender: true,
  setup(__props) {
    const intensity = ref(35);
    watch(intensity, (v) => {
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "vs" }, _attrs))} data-v-c7f12867><header class="vs__header" data-v-c7f12867><h1 class="vs__title" data-v-c7f12867>Visual Snow (neurological)</h1><p class="vs__lead" data-v-c7f12867> Some people experience continuous “static” across their vision, plus halos, afterimages, and light sensitivity. This is not a mental illness, but a neurological visual disturbance. </p><div class="controls" data-v-c7f12867><label class="controls__label" for="intensity" data-v-c7f12867> Intensity: <strong data-v-c7f12867>${ssrInterpolate(intensity.value)}</strong></label><input id="intensity" class="controls__range" type="range" min="0" max="100" step="5"${ssrRenderAttr("value", intensity.value)} data-v-c7f12867></div></header><div class="vs__stage" style="${ssrRenderStyle({ "--noise-opacity": (intensity.value / 100).toString() })}" data-v-c7f12867><div class="vs__noise" aria-hidden="true" data-v-c7f12867></div><div class="vs__content" data-v-c7f12867><h2 class="vs__subtitle" data-v-c7f12867>Try reading this</h2><p data-v-c7f12867> The goal is to communicate how distracting “visual noise” can be. It can make contrast and focus harder—especially on large areas or in low light. </p><p data-v-c7f12867> Tip: Use the slider to increase intensity. Compare how it feels on different pages. </p></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/visual-snow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const visualSnow = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c7f12867"]]);
export {
  visualSnow as default
};
//# sourceMappingURL=visual-snow-nQYKBVau.js.map
