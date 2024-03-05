import util from "../../../../service/util";
import adminApi from "../../service/admin-api";

export default {
  namespaced: true,
  state: {
    /** @type {VoiceFile[]} */
    voices: [],
    /** @type {VoiceFile[]} */
    origins: [],
    /** @type {VoiceFile[]} */
    confirmed: [],
    /** @type {VoiceFile[]} */
    alternatives: [],
    /**@type {Set<number>} */
    spokenSet: new Set(),
  },
  getters: {
    count: (state) => (target) => {
      const targets = state[target];
      return targets.length;
    },
    total: (state) => state.voices.length,
    ratio: (state) => {
      const { origins, confirmed } = state;
      return {
        current: confirmed.length,
        total: origins.length + confirmed.length,
      };
    },
    voiceOf: (state) => (voice) => {
      const { voices } = state;
      if (voice.altVoiceRef) {
        return voices.find((v) => v.seq === voice.seq);
      } else return voice;
    },
    page:
      (state) =>
      (target, offset = 0, count = 20) => {
        const targets = state[target];
        if (!targets) {
          throw new Error("[no such target] " + target);
        }
        const endIndex = Math.min(targets.length, offset + count);
        return targets.slice(offset, endIndex);
      },
    unclassified:
      (state, getters) =>
      (pageIndex = 0) => {
        return getters.page("origins", pageIndex);
      },
    confirmed:
      (state, getters) =>
      (pageIndex = 0) => {
        return getters.page("confirmed", pageIndex);
      },
  },
  mutations: {
    /**
     * @param {any} state
     * @param {import('@/entity/voice').VoiceFile} voice
     */
    markAsSopken(state, voice) {
      state.spokenSet.add(voice.seq);
    },
    /**
     * @param {any} state
     * @param {{active: VoiceFile, alt: VoiceFile}} param
     */
    markAsConfirmed(state, { active, alt }) {
      const { origins, confirmed } = state;
      if (alt) {
        active.setAlternateVoice(alt);
      }
      const idx = origins.findIndex((v) => v.seq === active.seq);
      origins.splice(idx, 1);
      confirmed.unshift(active);
    },
    initVoices(state, voices) {
      state.voices = voices;
      const map = util.arr.groupByMap(voices, (voice) => {
        const { origin, altVoiceRef, confirmDate } = voice;
        if (altVoiceRef || (origin === "ncp" && confirmDate)) {
          return "confirmed";
        } else {
          return origin;
        }
      });
      const origins = map.get("ncp") || [];
      const confirmed = map.get("confirmed") || [];
      const alternatives = map.get("local") || [];
      confirmed.forEach((voice) => {
        const { altVoiceRef } = voice;
        if (altVoiceRef) {
          voice.altVoice = alternatives.find((v) => v.seq === altVoiceRef);
        }
      });
      state.origins = origins.reverse();
      state.confirmed = confirmed;
      state.alternatives = alternatives;
    },
  },
  actions: {
    loadVoices: (ctx) => {
      adminApi.voice.all().then((paging) => {
        ctx.commit("initVoices", paging.elems);
      });
    },
    fetchVoice: (
      ctx,
      /**@type {import('@/entity/voice').VoiceFile} */ voice
    ) => {
      return adminApi.voice.alternateVoice(voice.seq, voice.alternativeText);
    },
    replaceVoice: (ctx, { active, alt }) => {
      return adminApi.voice.replaceVoice(active.seq, alt.seq).then((voice) => {
        active.confirmDate = voice.confirmDate;
        ctx.commit("markAsConfirmed", { active, alt });
      });
    },
    confirm: (ctx, active) => {
      return adminApi.voice.confirm(active.seq).then((voice) => {
        active.confirmDate = voice.confirmDate;
        ctx.commit("markAsConfirmed", { active, alt: undefined });
      });
    },
  },
};
