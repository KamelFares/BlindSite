import { u as useI18n, b as useLocalePath, a as __nuxt_component_0, _ as _export_sfc } from "../server.mjs";
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderAttr, ssrRenderClass, ssrRenderComponent } from "vue/server-renderer";
import { useRouter } from "vue-router";
import "F:/BeBlind/BlindSite/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "F:/BeBlind/BlindSite/node_modules/hookable/dist/index.mjs";
import "F:/BeBlind/BlindSite/node_modules/unctx/dist/index.mjs";
import "F:/BeBlind/BlindSite/node_modules/h3/dist/index.mjs";
import "F:/BeBlind/BlindSite/node_modules/defu/dist/defu.mjs";
import "F:/BeBlind/BlindSite/node_modules/klona/dist/index.mjs";
import "F:/BeBlind/BlindSite/node_modules/cookie-es/dist/index.mjs";
import "F:/BeBlind/BlindSite/node_modules/destr/dist/index.mjs";
import "F:/BeBlind/BlindSite/node_modules/ohash/dist/index.mjs";
import "@vue/devtools-api";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    useRouter();
    const sectionDefs = [
      { id: "what", key: "what" },
      { id: "different", key: "different" },
      { id: "navigate", key: "navigate" },
      { id: "tech", key: "tech" },
      { id: "design", key: "design" },
      { id: "cataract", key: "cataract", route: "/cataract" },
      { id: "macular", key: "macular", route: "/macular" },
      { id: "color", key: "color", route: "/colors" },
      // New simulations (not yet in the i18n home sections list)
      { id: "retinopathy", key: "retinopathy" },
      { id: "tunnel", key: "tunnel" },
      { id: "migraine", key: "migraine" }
    ];
    const sections = computed(
      () => sectionDefs.map((d) => {
        if ("route" in d && d.route) {
          return {
            id: d.id,
            title: t(`home.sections.${d.key}.title`),
            text: t(`home.sections.${d.key}.text`),
            route: d.route,
            cta: t(`home.sections.${d.key}.cta`)
          };
        }
        if (d.key === "retinopathy") {
          return {
            id: d.id,
            title: t("nav.retinopathy"),
            text: "Patchy blur + drifting floaters. Try to click the correct label.",
            route: "/retinopathy",
            cta: "Open simulation"
          };
        }
        if (d.key === "tunnel") {
          return {
            id: d.id,
            title: t("nav.tunnel"),
            text: "Restricted peripheral vision. Scan to find the target dot.",
            route: "/tunnel",
            cta: "Open simulation"
          };
        }
        if (d.key === "migraine") {
          return {
            id: d.id,
            title: t("nav.migraine"),
            text: "Shimmering aura + central scotoma overlay. Try to click the moving target.",
            route: "/migraine",
            cta: "Open simulation"
          };
        }
        return {
          id: d.id,
          title: d.id,
          text: ""
        };
      })
    );
    const offsets = ref([]);
    const generateOffsets = (count) => {
      offsets.value = Array.from({ length: count }, () => {
        const sign = Math.random() < 0.5 ? -1 : 1;
        const px = Math.round((120 + Math.random() * 220) * sign);
        return px;
      });
    };
    watch(
      () => [locale.value, sections.value.length],
      ([, len]) => {
        if (offsets.value.length !== len) generateOffsets(len);
      }
    );
    const styleFor = (index2) => ({
      "--offset-x": `${offsets.value[index2] ?? 0}px`
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-244df6a2><header class="hero" aria-label="Blindness education introduction" data-v-244df6a2><h1 class="hero__title reveal" data-v-244df6a2>${ssrInterpolate(unref(t)("home.title"))}</h1><p class="hero__subtitle reveal" data-v-244df6a2>${ssrInterpolate(unref(t)("home.subtitle1"))}</p><p class="hero__subtitle reveal" data-v-244df6a2>${ssrInterpolate(unref(t)("home.subtitle2"))}</p></header><main class="flow" aria-label="Educational sections" data-v-244df6a2><!--[-->`);
      ssrRenderList(sections.value, (s, index2) => {
        _push(`<section style="${ssrRenderStyle(styleFor(index2))}"${ssrRenderAttr("id", s.id)} class="${ssrRenderClass([{ "block--link": !!s.route }, "block"])}" tabindex="0"${ssrRenderAttr("role", s.route ? "link" : "region")}${ssrRenderAttr("aria-label", s.route ? `${s.title}. Open simulation.` : s.title)} data-v-244df6a2><div class="cue" aria-hidden="true" data-v-244df6a2><span class="cue__dot" data-v-244df6a2></span><span class="cue__beam" data-v-244df6a2></span></div><div class="content" data-v-244df6a2><h2 class="content__title reveal" data-v-244df6a2>${ssrInterpolate(s.title)}</h2><p class="content__text reveal" data-v-244df6a2>${ssrInterpolate(s.text)}</p>`);
        if (s.route) {
          _push(`<div class="content__cta" data-v-244df6a2>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            class: "cta",
            to: unref(localePath)(s.route)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(s.cta ?? "Open")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(s.cta ?? "Open"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></section>`);
      });
      _push(`<!--]--></main><footer class="donate" aria-label="Donation links" data-v-244df6a2><h2 class="donate__title reveal" data-v-244df6a2>${ssrInterpolate(unref(t)("home.donateTitle"))}</h2><p class="donate__note reveal" data-v-244df6a2>${ssrInterpolate(unref(t)("home.donateNote"))}</p><ul class="donate__list" aria-label="Donation links" data-v-244df6a2><li class="donate__item" data-v-244df6a2><a class="donate__link"${ssrRenderAttr("href", unref(t)("home.donations.dbsv.url"))} target="_blank" rel="noopener noreferrer" data-v-244df6a2><span class="donate__name" data-v-244df6a2>${ssrInterpolate(unref(t)("home.donations.dbsv.name"))}</span><span class="donate__desc" data-v-244df6a2>${ssrInterpolate(unref(t)("home.donations.dbsv.desc"))}</span></a></li><li class="donate__item" data-v-244df6a2><a class="donate__link"${ssrRenderAttr("href", unref(t)("home.donations.proretina.url"))} target="_blank" rel="noopener noreferrer" data-v-244df6a2><span class="donate__name" data-v-244df6a2>${ssrInterpolate(unref(t)("home.donations.proretina.name"))}</span><span class="donate__desc" data-v-244df6a2>${ssrInterpolate(unref(t)("home.donations.proretina.desc"))}</span></a></li><li class="donate__item" data-v-244df6a2><a class="donate__link"${ssrRenderAttr("href", unref(t)("home.donations.aktionMensch.url"))} target="_blank" rel="noopener noreferrer" data-v-244df6a2><span class="donate__name" data-v-244df6a2>${ssrInterpolate(unref(t)("home.donations.aktionMensch.name"))}</span><span class="donate__desc" data-v-244df6a2>${ssrInterpolate(unref(t)("home.donations.aktionMensch.desc"))}</span></a></li><li class="donate__item" data-v-244df6a2><a class="donate__link"${ssrRenderAttr("href", unref(t)("home.donations.cbm.url"))} target="_blank" rel="noopener noreferrer" data-v-244df6a2><span class="donate__name" data-v-244df6a2>${ssrInterpolate(unref(t)("home.donations.cbm.name"))}</span><span class="donate__desc" data-v-244df6a2>${ssrInterpolate(unref(t)("home.donations.cbm.desc"))}</span></a></li></ul></footer></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-244df6a2"]]);
export {
  index as default
};
//# sourceMappingURL=index-Zlgal6QW.js.map
