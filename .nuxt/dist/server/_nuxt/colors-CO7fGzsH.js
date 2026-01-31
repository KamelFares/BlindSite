import { defineComponent, ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
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
const gridSize = 4;
const totalRounds = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "colors",
  __ssrInlineRender: true,
  setup(__props) {
    const round = ref(1);
    const correct = ref(0);
    const wrong = ref(0);
    const statusMessage = ref("Click the circle that looks different from the others.");
    const tiles = ref([]);
    const randomBetween = (min, max) => Math.random() * (max - min) + min;
    const makeRound = () => {
      const baseHue = Math.floor(randomBetween(0, 360));
      const type = Math.random() < 0.5 ? "red-green" : "blue-purple";
      let baseColor;
      let targetColor;
      if (type === "red-green") {
        baseColor = `hsl(${baseHue}, 70%, 45%)`;
        targetColor = `hsl(${(baseHue + 20) % 360}, 70%, 45%)`;
      } else {
        baseColor = `hsl(${baseHue}, 55%, 45%)`;
        targetColor = `hsl(${(baseHue + 18) % 360}, 55%, 50%)`;
      }
      const totalTiles = gridSize * gridSize;
      const targetIndex = Math.floor(Math.random() * totalTiles);
      const nextTiles = [];
      for (let i = 0; i < totalTiles; i++) {
        nextTiles.push({
          id: i,
          color: i === targetIndex ? targetColor : baseColor,
          isTarget: i === targetIndex
        });
      }
      tiles.value = nextTiles;
      statusMessage.value = "Click the circle that looks different from the others.";
    };
    makeRound();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "colors-page" }, _attrs))} data-v-a0c62928><header class="colors-page__header" data-v-a0c62928><h1 class="colors-page__title" data-v-a0c62928>Color Vision Challenge</h1><p class="colors-page__lead" data-v-a0c62928> This is a simple game inspired by color-blindness tests. In each round, one circle has a slightly different color. Try to find it. </p><p class="colors-page__note" data-v-a0c62928> This is <strong data-v-a0c62928>not</strong> a medical test. Real color-vision diagnosis must be done by an eye-care professional. </p></header><main class="colors-page__main" data-v-a0c62928><section class="colors-page__arena" aria-label="Color vision game" data-v-a0c62928><p class="colors-page__instructions" data-v-a0c62928> Round ${ssrInterpolate(round.value)} / ${ssrInterpolate(totalRounds)} — Click the circle that looks different. </p><div class="colors-grid" data-v-a0c62928><!--[-->`);
      ssrRenderList(tiles.value, (tile) => {
        _push(`<button type="button" class="colors-grid__tile" style="${ssrRenderStyle({ background: tile.color })}" aria-label="Color choice" data-v-a0c62928></button>`);
      });
      _push(`<!--]--></div><div class="colors-page__hud" aria-live="polite" data-v-a0c62928><p data-v-a0c62928><strong data-v-a0c62928>Correct:</strong> ${ssrInterpolate(correct.value)}</p><p data-v-a0c62928><strong data-v-a0c62928>Wrong:</strong> ${ssrInterpolate(wrong.value)}</p><p class="colors-page__status" data-v-a0c62928>${ssrInterpolate(statusMessage.value)}</p></div></section><section class="colors-page__info" data-v-a0c62928><h2 data-v-a0c62928>What does this show?</h2><p data-v-a0c62928> Many color-blind people can see colors, but some shades are hard to tell apart. Red and green, or blue and purple, might look almost the same. When websites use only color to show important information, it can be confusing. </p><p data-v-a0c62928> Good design adds patterns, icons or text labels so that you do not have to rely on color alone. </p></section></main></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/colors.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const colors = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a0c62928"]]);
export {
  colors as default
};
//# sourceMappingURL=colors-CO7fGzsH.js.map
