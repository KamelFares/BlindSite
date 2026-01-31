import { defineComponent, ref, computed, watch, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderStyle, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
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
  __name: "macular",
  __ssrInlineRender: true,
  setup(__props) {
    const spotSize = ref(160);
    const score = ref(0);
    const misses = ref(0);
    const targetShape = ref("▲");
    const items = ref([]);
    const difficulty = ref("normal");
    const timeLeft = ref(25);
    let timer = null;
    const difficultyLabel = computed(() => {
      if (difficulty.value === "easy") return "Easy";
      if (difficulty.value === "hard") return "Hard";
      return "Normal";
    });
    const config = computed(() => {
      switch (difficulty.value) {
        case "easy":
          return { count: 12, size: 56, padding: 18, start: 30, penalty: 1 };
        case "hard":
          return { count: 22, size: 38, padding: 16, start: 18, penalty: 2 };
        default:
          return { count: 16, size: 48, padding: 18, start: 25, penalty: 1 };
      }
    });
    const stageStyle = computed(() => ({
      "--spot-size": `${spotSize.value}px`,
      "--item-size": `${config.value.size}px`
    }));
    const resetTimer = () => {
      timeLeft.value = config.value.start;
      if (timer) (void 0).clearInterval(timer);
      timer = (void 0).setInterval(() => {
        timeLeft.value -= 1;
        if (timeLeft.value <= 0) {
          misses.value += config.value.penalty;
          resetTimer();
        }
      }, 1e3);
    };
    watch(difficulty, () => {
      if (difficulty.value === "hard") spotSize.value = Math.max(spotSize.value, 190);
      resetTimer();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "macular" }, _attrs))} data-v-7e3ea085><header class="macular__header" data-v-7e3ea085><h1 class="macular__title" data-v-7e3ea085>Macular Degeneration Simulation</h1><p class="macular__lead" data-v-7e3ea085> Macular degeneration can affect central vision. People may see a blur or dark spot in the center while peripheral vision remains. </p><div class="controls" data-v-7e3ea085><label class="controls__label" for="difficulty" data-v-7e3ea085> Difficulty: <strong data-v-7e3ea085>${ssrInterpolate(difficultyLabel.value)}</strong></label><select id="difficulty" class="controls__select" data-v-7e3ea085><option value="easy" data-v-7e3ea085${ssrIncludeBooleanAttr(Array.isArray(difficulty.value) ? ssrLooseContain(difficulty.value, "easy") : ssrLooseEqual(difficulty.value, "easy")) ? " selected" : ""}>Easy</option><option value="normal" data-v-7e3ea085${ssrIncludeBooleanAttr(Array.isArray(difficulty.value) ? ssrLooseContain(difficulty.value, "normal") : ssrLooseEqual(difficulty.value, "normal")) ? " selected" : ""}>Normal</option><option value="hard" data-v-7e3ea085${ssrIncludeBooleanAttr(Array.isArray(difficulty.value) ? ssrLooseContain(difficulty.value, "hard") : ssrLooseEqual(difficulty.value, "hard")) ? " selected" : ""}>Hard</option></select><label class="controls__label" for="size" data-v-7e3ea085> Central spot size: <strong data-v-7e3ea085>${ssrInterpolate(spotSize.value)}</strong></label><input id="size" class="controls__range" type="range" min="80" max="260" step="10"${ssrRenderAttr("value", spotSize.value)} data-v-7e3ea085></div></header><main class="macular__main" data-v-7e3ea085><section class="game" aria-label="Peripheral vision game" data-v-7e3ea085><div class="game__top" aria-live="polite" data-v-7e3ea085><p class="game__prompt" data-v-7e3ea085> Task: Click the target shape <strong data-v-7e3ea085>${ssrInterpolate(targetShape.value)}</strong>. </p><p class="game__score" data-v-7e3ea085> Score: <strong data-v-7e3ea085>${ssrInterpolate(score.value)}</strong> | Misses: <strong data-v-7e3ea085>${ssrInterpolate(misses.value)}</strong> | Time: <strong data-v-7e3ea085>${ssrInterpolate(timeLeft.value)}</strong>s </p></div><div class="stage" style="${ssrRenderStyle(stageStyle.value)}" data-v-7e3ea085><div class="spot" aria-hidden="true" data-v-7e3ea085></div><!--[-->`);
      ssrRenderList(items.value, (item) => {
        _push(`<button type="button" class="${ssrRenderClass([{ "item--target": item.shape === targetShape.value }, "item"])}" style="${ssrRenderStyle({ left: `${item.x}px`, top: `${item.y}px` })}"${ssrRenderAttr("aria-label", `Shape ${item.shape}`)} data-v-7e3ea085><span aria-hidden="true" data-v-7e3ea085>${ssrInterpolate(item.shape)}</span></button>`);
      });
      _push(`<!--]--></div><p class="game__hint" data-v-7e3ea085> Hint: The center is blocked. Use the edges of the screen to spot the shapes and move your eyes around. </p></section><section class="info" data-v-7e3ea085><h2 data-v-7e3ea085>Why this is hard</h2><p data-v-7e3ea085> When central vision is affected, details in the middle can disappear. Reading, face recognition, and small targets can become difficult. People often learn to use a “preferred retinal location” by looking slightly away from what they want to see. </p></section></main></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/macular.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const macular = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7e3ea085"]]);
export {
  macular as default
};
//# sourceMappingURL=macular-ggjofdGA.js.map
