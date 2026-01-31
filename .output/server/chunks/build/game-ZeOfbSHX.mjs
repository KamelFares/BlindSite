import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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

const gridSize = 4;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "game",
  __ssrInlineRender: true,
  setup(__props) {
    const attempts = ref(0);
    const score = ref(0);
    const statusMessage = ref("Click any tile to start guessing. Listen to pitch and left/right pan.");
    const targetIndex = ref(0);
    computed(() => targetIndex.value % gridSize);
    computed(() => Math.floor(targetIndex.value / gridSize));
    const cells = computed(() => {
      const list = [];
      let index = 0;
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          list.push({ id: `${x}-${y}`, index, x, y });
          index++;
        }
      }
      return list;
    });
    ref(null);
    const audioReady = ref(false);
    const resetRound = () => {
      const total = gridSize * gridSize;
      targetIndex.value = Math.floor(Math.random() * total);
      statusMessage.value = "New target hidden. Listen carefully and try again.";
    };
    resetRound();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "blind-touch" }, _attrs))} data-v-76221d42><header class="blind-touch__header" data-v-76221d42><h1 class="blind-touch__title" data-v-76221d42>Blind Touch \u2013 Visual Mode</h1><p class="blind-touch__lead" data-v-76221d42> This is a sound-guided grid. One hidden tile is the target. Use your ears and simple hints to find it. </p><p class="blind-touch__instructions" data-v-76221d42> Click tiles to guess. <strong data-v-76221d42>Higher pitch</strong> means you are closer. Sound pans <strong data-v-76221d42>left/right</strong> depending on the tile&#39;s position. </p><button type="button" class="blind-touch__sound-btn" data-v-76221d42>${ssrInterpolate(audioReady.value ? "Sound enabled" : "Enable sound")}</button></header><main class="blind-touch__main" data-v-76221d42><section class="blind-touch__arena" aria-label="Blind Touch style grid. Click tiles and listen to the sound to find the hidden target." data-v-76221d42><div class="grid" data-v-76221d42><!--[-->`);
      ssrRenderList(cells.value, (cell) => {
        _push(`<button type="button" class="grid__tile" data-v-76221d42><span class="grid__tile-label" data-v-76221d42>${ssrInterpolate(cell.index + 1)}</span></button>`);
      });
      _push(`<!--]--></div><div class="blind-touch__hud" aria-live="polite" data-v-76221d42><p data-v-76221d42><strong data-v-76221d42>Score:</strong> ${ssrInterpolate(score.value)}</p><p data-v-76221d42><strong data-v-76221d42>Attempts:</strong> ${ssrInterpolate(attempts.value)}</p><p class="blind-touch__status" data-v-76221d42>${ssrInterpolate(statusMessage.value)}</p></div></section><section class="blind-touch__notes" data-v-76221d42><h2 data-v-76221d42>Idea behind this mode</h2><p data-v-76221d42> With vision, the grid is easy to scan. In a non-visual version, you would only hear the sounds and hints, building a mental picture from audio instead of sight. </p></section></main></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/game.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const game = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-76221d42"]]);

export { game as default };
//# sourceMappingURL=game-ZeOfbSHX.mjs.map
