import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc, c as useLightCursor } from './server.mjs';
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
  __name: "tunnel",
  __ssrInlineRender: true,
  setup(__props) {
    const { cssVars } = useLightCursor();
    const radius = ref(170);
    const score = ref(0);
    const misses = ref(0);
    const status = ref("Find the glowing dot. Click it.");
    const targetX = ref(50);
    const targetY = ref(50);
    const maskStyle = computed(() => ({
      ...cssVars.value,
      "--radius": `${radius.value}px`
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "tunnel" }, _attrs))} data-v-af5bcf25><header class="tunnel__header" data-v-af5bcf25><h1 class="tunnel__title" data-v-af5bcf25>Tunnel Vision (glaucoma / retinitis pigmentosa)</h1><p class="tunnel__lead" data-v-af5bcf25> Peripheral vision can fade, leaving a narrow \u201Ctunnel\u201D. Try to find and click the highlighted target while your view is restricted. </p><div class="controls" aria-label="Tunnel vision controls" data-v-af5bcf25><label class="controls__label" for="radius" data-v-af5bcf25> Tunnel size: <strong data-v-af5bcf25>${ssrInterpolate(radius.value)}</strong></label><input id="radius" class="controls__range" type="range" min="70" max="260" step="10"${ssrRenderAttr("value", radius.value)} data-v-af5bcf25></div><p class="tunnel__note" data-v-af5bcf25> Tip: Use your mouse to \u201Cscan\u201D. In real life people scan with head/eye movements to compensate. </p></header><main class="tunnel__main" data-v-af5bcf25><section class="game" aria-label="Find the glowing dot" data-v-af5bcf25><div class="game__top" aria-live="polite" data-v-af5bcf25><p data-v-af5bcf25>Score: <strong data-v-af5bcf25>${ssrInterpolate(score.value)}</strong> | Misses: <strong data-v-af5bcf25>${ssrInterpolate(misses.value)}</strong></p><p class="game__status" data-v-af5bcf25>${ssrInterpolate(status.value)}</p></div><div class="arena" style="${ssrRenderStyle(maskStyle.value)}" data-v-af5bcf25><div class="mask" aria-hidden="true" data-v-af5bcf25></div><button type="button" class="target" style="${ssrRenderStyle({ left: `${targetX.value}%`, top: `${targetY.value}%` })}" aria-label="Target" data-v-af5bcf25></button><div class="noise" aria-hidden="true" data-v-af5bcf25></div></div></section></main></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tunnel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const tunnel = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-af5bcf25"]]);

export { tunnel as default };
//# sourceMappingURL=tunnel-DsFKu_tL.mjs.map
