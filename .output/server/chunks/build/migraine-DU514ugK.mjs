import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
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
  __name: "migraine",
  __ssrInlineRender: true,
  setup(__props) {
    const intensity = ref(6);
    const seconds = ref(0);
    const hits = ref(0);
    const status = ref("Click the moving dot.");
    const dotX = ref(50);
    const dotY = ref(50);
    const auraAngle = ref(0);
    const arenaStyle = computed(() => {
      const i = intensity.value;
      return {
        "--aura-opacity": (0.06 + i / 10 * 0.26).toFixed(3),
        "--aura-rotate": `${auraAngle.value}deg`,
        "--scotoma-size": `${160 + i * 18}px`
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "migraine" }, _attrs))} data-v-9e527370><header class="migraine__header" data-v-9e527370><h1 class="migraine__title" data-v-9e527370>Migraine Aura (zig-zag / flashing scotoma)</h1><p class="migraine__lead" data-v-9e527370> Some migraine auras include shimmering zig-zag patterns and a blind spot. This simulation overlays a moving aura while you try to keep focus on a target. </p><div class="controls" aria-label="Migraine aura controls" data-v-9e527370><label class="controls__label" for="intensity" data-v-9e527370>Intensity: <strong data-v-9e527370>${ssrInterpolate(intensity.value)}</strong></label><input id="intensity" class="controls__range" type="range" min="0" max="10" step="1"${ssrRenderAttr("value", intensity.value)} data-v-9e527370></div></header><main class="migraine__main" data-v-9e527370><section class="game" aria-label="Keep focus tracking" data-v-9e527370><div class="game__top" aria-live="polite" data-v-9e527370><p data-v-9e527370>Time: <strong data-v-9e527370>${ssrInterpolate(seconds.value)}</strong>s | Hits: <strong data-v-9e527370>${ssrInterpolate(hits.value)}</strong></p><p class="game__status" data-v-9e527370>${ssrInterpolate(status.value)}</p></div><div class="arena" style="${ssrRenderStyle(arenaStyle.value)}" data-v-9e527370><div class="aura" aria-hidden="true" data-v-9e527370></div><div class="scotoma" aria-hidden="true" data-v-9e527370></div><button type="button" class="dot" style="${ssrRenderStyle({ left: `${dotX.value}%`, top: `${dotY.value}%` })}" aria-label="Moving target" data-v-9e527370></button></div></section></main></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/migraine.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const migraine = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9e527370"]]);

export { migraine as default };
//# sourceMappingURL=migraine-DU514ugK.mjs.map
