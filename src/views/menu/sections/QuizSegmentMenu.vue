<template>
  <div class="seg-view">
    <TabView :model="tabModel">
      <div class="tab-body">
        <div class="info">
          <div>
            {{ chapter.desc }}
          </div>
          <div>
            {{ section.level > 0 ? `${section.level}단계` : "도전" }}
            {{ section.description }}
          </div>
        </div>
        <SegmentView
          @active-segment="setSegment"
          :resourceType="resourceTypeRef"
        />
        <div class="btns">
          <div class="group" :class="tabModel.activeTab.clazz">
            <div
              class="cmd"
              :class="{
                disabled: btn.disabled,
                current:
                  resourceTypeRef === currentRssType &&
                  segRef?.current &&
                  btn.mode === currentMode,
              }"
              v-for="btn in buttons"
              :key="btn.cmd"
              @click="startQuiz(btn)"
            >
              <span class="type">{{ tabModel.activeTab.text }}</span>
              <span class="text">{{ btn.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </TabView>
  </div>
</template>

<script>
import { ref, toRaw, watch } from "vue";
import { useStore } from "vuex";
import SegmentView from "@/components/quiz/SegmentView.vue";
import quiz from "@/views/quiz";
import { TabModel, TabView } from "@/components/tab";

export default {
  components: {
    SegmentView,
    TabView,
  },
  setup() {
    const store = useStore();
    const ctx = store.state.quiz.quizContext;
    const { chapter } = ctx.section;
    const currentRssType = ctx.resourceType === "A" ? "S" : ctx.resourceType;
    const currentMode = ctx.mode;
    const segRef = ref(null);
    const resourceTypeRef = ref(ctx.resourceType);

    const buttons = ref([]);

    const isBookResource = ctx.section.origin === "B";
    const wordTab = {
      text: "낱말",
      cmd: "W",
      clazz: "word",
      active: "W" === currentRssType,
      elems: [
        {
          cmd: "READING:SEN:W",
          text: "보고쓰기",
          mode: "READING",
          disabled: false,
        },
        {
          cmd: "LEARNING:SEN:W",
          text: "연습하기",
          mode: "LEARNING",
          disabled: false,
        },
        { cmd: "QUIZ:SEN:W", text: "받아쓰기", mode: "QUIZ", disabled: false },
      ],
    };
    const senTab = {
      text: "문장",
      cmd: "S",
      clazz: "word",
      active: "S" === currentRssType,
      elems: [
        {
          cmd: "READING:EJ:S",
          text: "보고쓰기",
          mode: "READING",
          disabled: false,
        },
        {
          cmd: "LEARNING:EJ:S",
          text: "연습하기",
          mode: "LEARNING",
          disabled: false,
        },
        { cmd: "QUIZ:SEN:S", text: "받아쓰기", mode: "QUIZ", disabled: false },
      ],
    };
    const tabElems = [senTab];
    if (ctx.resourceType !== "A" && ctx.section.level > 0) {
      // 1. 교과서인 경우('A') 모두 문장으로 구성되어 있음
      // 2. 단계별/도전의 경우 낱말이 없음(level이 -1)
      // 도전이 아닌 단계별 학습인 경우에만 낱말탭을 추가함
      tabElems.unshift(wordTab);
    }
    if (ctx.section.level === -1) {
      // 단계별/도전의 경우 [퀴즈]만 있으므로 보고쓰기와 학습을 비활성화시킴
      senTab.elems[0].disabled = true;
      senTab.elems[1].disabled = true;
    }
    const tabModel = TabModel.create(tabElems);
    const setSegment = (seg) => {
      segRef.value = toRaw(seg);
    };
    const startQuiz = (btn) => {
      /*
      answerType: 'EJ' | {comp: 'EJ', pumsa: 'what'}
      */
      if (btn.disabled) {
        return;
      }
      let [quizMode, answerType, quizResource] = btn.cmd.split(":");
      if (isBookResource) {
        answerType = { comp: answerType, pumsa: "what" };
        quizResource = "A";
      }
      quiz
        .prepareQuiz({
          quizMode,
          answerType,
          section: ctx.sectionSeq,
          quizResource,
          license: ctx.license.seq,
          prevPage: ctx.prevPage,
          sentenceFilter: () => segRef.value.getSentences(),
          ranges: [segRef.value.start, segRef.value.end],
        })
        .then(() => {
          // location.reload();
          store.commit("ui/hideMenu");
          store.commit("quiz/hideHint");
          quiz.loadQuiz();
        })
        .catch((e) => {
          alert(`[${e.cause}]이용 가능한 문제가 없습니다`);
        });
    };
    watch(
      tabModel.activeTab,
      (tab) => {
        console.log("[tab]", tab);
        resourceTypeRef.value = tab.cmd;
        buttons.value = tab.elems;
        setSegment(null);
      },
      { immediate: true }
    );
    return {
      section: ctx.section,
      segRef,
      buttons,
      resourceTypeRef,
      chapter,
      currentRssType,
      currentMode,
      tabModel,
      setSegment,
      startQuiz,
    };
  },
};
</script>

<style lang="scss" scoped>
.seg-view {
  margin: 8px 0;
  width: 100%;

  .tab-body {
    margin-top: 0px;
    padding: 8px;
    border: 1px solid #cbe8ff;
    position: relative;
    .info {
      padding: 4px 0px 8px;
    }
  }
  .btns {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    margin-top: 8px;
    .group {
      flex: 1 1;
      display: flex;
      column-gap: 8px;
      .cmd {
        flex: 1 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        border: 1px solid #cac;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 10px;
        &:active {
          transform: translate(1px, 1px);
        }
        &.current {
          background-color: #cac;
          color: white;
        }
        &.disabled {
          background-color: #eee;
          border-color: #ccc;
          color: #777;
          cursor: not-allowed;
        }
        // .type {
        //   position: absolute;
        //   top: 0;
        // }
      }
    }
  }
}
</style>
