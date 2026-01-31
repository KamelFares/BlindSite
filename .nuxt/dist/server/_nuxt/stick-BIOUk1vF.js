import { defineComponent, ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
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
const gridSize = 11;
const goalCount = 3;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "stick",
  __ssrInlineRender: true,
  setup(__props) {
    const playerX = ref(5);
    const playerY = ref(9);
    const targets = ref([]);
    const found = computed(() => targets.value.filter((t) => t.found).length);
    const moves = ref(0);
    const message = ref("Press Space to ping. Use the sound to find targets.");
    const lastDistance = ref(null);
    ref(null);
    ref(null);
    ref(null);
    computed(() => {
      const remaining = targets.value.filter((t) => !t.found);
      if (remaining.length === 0) return null;
      let best = remaining[0];
      let bestDist = Infinity;
      for (const t of remaining) {
        const d = Math.abs(t.x - playerX.value) + Math.abs(t.y - playerY.value);
        if (d < bestDist) {
          bestDist = d;
          best = t;
        }
      }
      return { target: best, dist: bestDist };
    });
    const isOnTarget = computed(() => {
      return targets.value.some((t) => !t.found && t.x === playerX.value && t.y === playerY.value);
    });
    const lastDistanceLabel = computed(() => {
      if (lastDistance.value === null) return "—";
      if (lastDistance.value === 0) return "here";
      if (lastDistance.value <= 2) return "very close";
      if (lastDistance.value <= 5) return "close";
      if (lastDistance.value <= 9) return "far";
      return "very far";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "stick-page" }, _attrs))} data-v-f7e6e224><header class="stick-page__header" data-v-f7e6e224><h1 class="stick-page__title" data-v-f7e6e224>Cane Simulation (Audio Hunt)</h1><p class="stick-page__lead" data-v-f7e6e224> Find hidden targets using sound only. Your cane sends a “ping” and you must follow the audio cue (volume + stereo pan) to locate the target. </p><p class="stick-page__instructions" data-v-f7e6e224> Use <strong data-v-f7e6e224>arrow keys</strong> to move. Press <strong data-v-f7e6e224>Space</strong> to ping. When you think you’re on the target tile, press <strong data-v-f7e6e224>Enter</strong> to “pick up” the target. </p></header><main class="stick-page__main" data-v-f7e6e224><section class="stick-page__arena" tabindex="0" role="application" aria-label="Audio hunt cane game. Arrow keys to move. Space to ping. Enter to pick up the target." data-v-f7e6e224><div class="hud" aria-live="polite" data-v-f7e6e224><div class="hud__row" data-v-f7e6e224><span data-v-f7e6e224>Targets found: <strong data-v-f7e6e224>${ssrInterpolate(found.value)}</strong> / ${ssrInterpolate(goalCount)}</span><span data-v-f7e6e224>Moves: <strong data-v-f7e6e224>${ssrInterpolate(moves.value)}</strong></span></div><div class="hud__row" data-v-f7e6e224><span data-v-f7e6e224>Last ping distance: <strong data-v-f7e6e224>${ssrInterpolate(lastDistanceLabel.value)}</strong></span>`);
      if (isOnTarget.value) {
        _push(`<span class="hud__hot" data-v-f7e6e224>Target is here</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><p class="stick-page__status" aria-live="polite" data-v-f7e6e224>${ssrInterpolate(message.value)}</p><div class="mini" aria-hidden="true" data-v-f7e6e224><div class="mini__dot" style="${ssrRenderStyle({ left: `${playerX.value / (gridSize - 1) * 100}%`, top: `${playerY.value / (gridSize - 1) * 100}%` })}" data-v-f7e6e224></div></div></section><section class="stick-page__notes" data-v-f7e6e224><h2 data-v-f7e6e224>What this tries to show</h2><p data-v-f7e6e224> In real life, people learn to map space through sound, touch and repetition. This mini-game exaggerates that: you must build a mental map and use audio cues to navigate. </p></section></main></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/stick.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const stick = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f7e6e224"]]);
export {
  stick as default
};
//# sourceMappingURL=stick-BIOUk1vF.js.map
