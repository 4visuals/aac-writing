<template>
  <div class="seg-view">
    <TabView :model="tabModel">
      <div class="tab-body">
        <div class="info">
          {{ section.level > 0 ? `${section.level}단계` : "도전" }}
          {{ section.description }}
        </div>
        <SegmentView
          @active-segment="setSegment"
          :resourceType="resourceTypeRef"
        />
        <div class="btns">
          <div class="group" :class="tabModel.activeTab.clazz">
            <div
              class="cmd"
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
    const segRef = ref(null);
    const resourceTypeRef = ref(ctx.resourceType);
    const buttons = ref([]);

    const isBookResource = ctx.section.origin === "B";
    const tabModel = TabModel.create([
      {
        text: "낱말",
        cmd: "W",
        clazz: "word",
        elems: [
          { cmd: "READING:SEN:W", text: "보고쓰기" },
          { cmd: "LEARNING:SEN:W", text: "학습" },
          { cmd: "QUIZ:SEN:W", text: "퀴즈" },
        ],
      },
      {
        text: "문장",
        cmd: "S",
        clazz: "word",
        elems: [
          { cmd: "READING:EJ:S", text: "보고쓰기" },
          { cmd: "LEARNING:EJ:S", text: "학습" },
          { cmd: "QUIZ:SEN:S", text: "퀴즈" },
        ],
      },
    ]);
    const setSegment = (seg) => {
      segRef.value = toRaw(seg);
    };
    const startQuiz = (btn) => {
      /*
      answerType: 'EJ' | {comp: 'EJ', pumsa: 'what'}
      */
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
    margin: 8px 0;
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
        &:active {
          transform: translate(1px, 1px);
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
