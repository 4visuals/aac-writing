<template>
  <div class="tts-list" ref="voicesEl">
    <h3>TTS 수정</h3>
    <audio ref="audioEl"></audio>
    <div class="ratio">
      <span>{{ ratio.current }}</span> / <span>{{ ratio.total }}</span>
    </div>
    <div class="nav-box">
      <div class="tab-nav">
        <button
          @click="setActiveTabAt(0)"
          class="nude tab"
          :class="{ active: tabModel.active === 0 }"
        >
          미분류
        </button>
        <button
          @click="setActiveTabAt(1)"
          class="nude tab"
          :class="{ active: tabModel.active === 1 }"
        >
          완료
        </button>
      </div>
      <div class="page-box">
        <button
          @click="navigateTo(pbox)"
          v-for="pbox in paging.pageBox"
          :key="pbox.offset"
          class="nude page"
          :class="{ active: pbox.active }"
        >
          {{ pbox.pageNum }}
        </button>
      </div>
    </div>

    <TableView fitBy="row" class="voices">
      <template v-slot:fcol>
        <Row>
          <Cell w="w60"></Cell>
          <Cell w="w40">버전</Cell>
          <Cell w="w80">링크</Cell>
          <Cell w="w40">듣기</Cell>
          <Cell w="w200">문장</Cell>
          <Cell w="w160">작업</Cell>
        </Row>
      </template>
      <template v-slot:data>
        <Row
          v-for="voice in voices"
          :key="voice.seq"
          class="row"
          :class="{ active: active === voice }"
          @click="() => setActiveVoice(voice, true)"
        >
          <Cell w="w60"
            ><span class="pk">#{{ voice.seq }}</span></Cell
          >
          <Cell w="w40"
            ><div class="speak">{{ voice.voiceVersion }}</div></Cell
          >
          <Cell w="w80"
            ><div class="speak">
              <button @click.stop="copyLink(voice)" class="copy-link">
                {{ voice.getHash() }}
              </button>
            </div></Cell
          >
          <Cell w="w40"
            ><div class="speak">
              <ActionIcon
                @click="speakOriginalText(voice)"
                fsize="18px"
                icon="volume_up"
              /></div
          ></Cell>
          <Cell w="w200" class="text"
            ><div class="input" :data-alter="voice.alternativeText">
              <input
                type="text"
                :data-pk="voice.seq"
                :value="voice.text"
                @input="(e) => setAlternativeText(e, voice)"
                @keydown="moveByArrowKey"
              /></div
          ></Cell>
          <Cell w="w200" v-if="tabModel.target === 'origins'"
            ><div v-if="voice.spoken" class="actions">
              <button
                v-if="!voice.updated"
                @click.stop="markAsConfirmed(voice)"
                class="action skip"
              >
                확인</button
              ><button
                v-if="voice.updated"
                @click.stop="replaceVoice"
                class="action replace"
              >
                교체
              </button>
            </div></Cell
          >
          <Cell v-else w="w200"
            ><span>{{ voice.confirmDate }}</span></Cell
          >
        </Row>
      </template>
    </TableView>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { TableView, Row, Cell } from "@/components/table";
import { ActionIcon } from "../../../../components/form";
import { tts } from "@/components/tts";
import { useStore } from "vuex";
import toast from "../../../../components/toast";
import { Paging } from "@/service/paging";
const store = useStore();
const tabModel = reactive({
  active: 0,
  target: "origins",
  tabs: [
    { text: "미분류", cmd: "origins" },
    { text: "완료", cmd: "confirmed" },
  ],
});
const paging = reactive(
  new Paging(store.getters["voice-store/count"](tabModel.target), 20)
);
const voices = computed(() =>
  store.getters["voice-store/page"](
    tabModel.target,
    paging.pos,
    paging.pageSize
  )
);
const ratio = computed(() => store.getters["voice-store/ratio"]);
const voicesEl = ref(undefined);
const audioEl = ref(undefined);
const active = ref(undefined);

console.log(paging.pageBox);
const setActiveTabAt = (idx) => {
  tabModel.active = idx;
  tabModel.target = tabModel.tabs[idx].cmd;

  const total = store.getters["voice-store/count"](tabModel.target);
  paging.reset(total);
};
// const tabRef = reactive(tabModel);
const altVoiceRef = ref(undefined);
let timer;
const changeActiveBy = (delta) => {
  const elems = voices.value;
  const idx = elems.findIndex((elem) => elem.seq === active.value.seq);
  const nextIdx = (elems.length + idx + delta) % elems.length;
  // active.value = elems[nextIdx];
  return elems[nextIdx];
};
const arrows = {
  ArrowUp: -1,
  ArrowDown: +1,
};
const markAsConfirmed = (voice) => {
  const idx = voices.value.findIndex((v) => v.seq === voice.seq);
  store.dispatch("voice-store/confirm", voice).then(() => {
    const nextVoice = voices.value[idx];
    setActiveVoice(nextVoice);
  });
};
const replaceVoice = () => {
  const activeVoice = active.value;
  const altVoice = altVoiceRef.value;
  const idx = voices.value.findIndex((v) => v.seq === activeVoice.seq);
  console.log(activeVoice.seq, altVoice.seq);
  store
    .dispatch("voice-store/replaceVoice", {
      active: activeVoice,
      alt: altVoice,
    })
    .then(() => {
      const nextVoice = voices.value[idx];
      setActiveVoice(nextVoice);
    });
};
const setAlternativeText = (e, voiceFile) => {
  /** @type {HTMLInputElement} */
  const inputEl = e.target;
  let alterText = e.target.value.trim();
  voiceFile.setAlternativeText(alterText);
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (voiceFile.updated) {
      inputEl.disabled = true;
      store.dispatch("voice-store/fetchVoice", voiceFile).then((altVoice) => {
        inputEl.disabled = false;
        altVoiceRef.value = altVoice;
        inputEl.focus();
        audioEl.value.src = `https://kdict.kr/lf/voice/${altVoice.filePath}`;
        audioEl.value.play();
      });
    } else {
      speakOriginalText(voiceFile);
    }
  }, 700);
};
const moveByArrowKey = (e) => {
  const { code } = e;
  const delta = arrows[code];
  if (Number.isInteger(delta)) {
    e.preventDefault();
    const nextActive = changeActiveBy(delta);
    setActiveVoice(nextActive, true);
  } else if (code === "Enter") {
    e.preventDefault();
    console.log("[confirm]");
  }
};
const speakOriginalText = (voice) => {
  tts.speak(voice.originText, { closePending: true }).then(() => {
    store.commit("voice-store/markAsSopken", voice);
    voice.spoken = true;
  });
};
const setActiveVoice = (voice, focusing) => {
  if (active.value === voice) {
    return;
  }
  speakOriginalText(voice);
  if (active.value) {
    active.value.rollback();
    altVoiceRef.value = undefined;
  }
  active.value = voice;
  if (focusing) {
    const input = voicesEl.value.querySelector(
      `[data-pk="${active.value.seq}"]`
    );
    input.focus();
  }
};
/**
 *
 * @param {VoiceFile} voice
 */
const copyLink = (voice) => {
  const link = voice.getLink();
  navigator.clipboard.writeText(link);
  toast.info("[복사]" + link, undefined, 1);
};

const navigateTo = (pageBox) => {
  paging.setPage(pageBox.offset);
};
</script>

<style lang="scss" scoped>
.tts-list {
  .nav-box {
    display: flex;
    .tab-nav {
      display: inline-flex;
      border: 1px solid #08449f;
      border-radius: 8px;
      overflow: hidden;
      button {
        font-weight: 400;
        &.active {
          background-color: #08449f;
          color: white;
        }
      }
    }
    .page-box {
      button {
        font-weight: 400;
        &.active {
          text-decoration: underline;
        }
      }
    }
  }
  .voices {
    .row {
      &.active {
        background-color: #e8e8e8;
      }
      .speak {
        display: flex;
        align-items: center;
        height: 100%;
        .copy-link {
          font-family: ui-monospace, "Menlo", Consolas, "Liberation Mono",
            monospace;
          border: 1px solid #aaa;
          color: #656d76;
          padding: 6px 8px;
          font-size: 10px;
          line-height: 1;
          border-radius: 4px;
          background-color: transparent;
          &:hover {
            background-color: rgba(208, 215, 222, 0.32);
          }
        }
      }
      .actions {
        display: flex;
        align-items: center;
        column-gap: 6px;
        button {
          background-color: transparent;
          border: none;
          padding: 4px 6px;
          border-radius: 4px;
          &:disabled {
            cursor: not-allowed;
          }
          &.skip {
            color: #000;
            background-color: rgb(150, 255, 126);
            &:disabled {
              color: #424242;
              background-color: #a3eb9e;
            }
          }
          &.replace {
            color: white;
            background-color: crimson;
            &:disabled {
              background-color: rgb(251, 140, 162);
            }
          }
          &.rollback {
            color: white;
            background-color: rgb(78, 78, 78);
            &:disabled {
              background-color: rgb(251, 140, 162);
            }
          }
        }
      }
    }
  }
  .text {
    position: relative;
    .input {
      display: flex;
      input {
        flex: 1 1 auto;
        padding: 4px;
        border: none;
        background-color: transparent;
      }
    }
  }
}
</style>
