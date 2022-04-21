<template>
  <div class="book row">
    <h3 class="title">
      <ActionIcon icon="arrow_back_ios" @click="$emit('back')" />
      <span>{{ book.desc }}</span>
    </h3>
    <transition-group name="fade" appear>
      <div
        class="col-6 col-sm-4 col-md-3 col-lg-3 section-outer"
        v-for="(section, idx) in book.sections"
        :key="section.seq"
      >
        <SectionButton
          :item="section"
          :idx="idx + 1"
          theme="yellow"
          @itemClicked="(section) => $emit('sectionClicked', section)"
        />
      </div>
    </transition-group>
  </div>
</template>

<script>
/**
 * props:
 * - book : section에 해댱함
 */
import SectionButton from "@/components/SectionButton.vue";
import { ActionIcon } from "@/components/form";
import quiz from "@/views/quiz";
import router from "@/router";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
export default {
  components: {
    SectionButton,
    ActionIcon,
  },
  props: ["book"],
  setup() {
    const store = useStore();
    const activeLicense = computed(() => store.getters["exam/activeLicense"]);
    const startBookQuiz = (section) => {
      const quizMode = "LEARNING";
      const answerType = { comp: "EJ", pumsa: "what" };
      const sectionSeq = section.seq;
      /*
       * 교과서 받아쓰기에서는 단어와 문장을 따로 구분하지 않음
       */
      const quizResource = "A";
      quiz.prepareQuiz({
        quizMode,
        answerType,
        section: sectionSeq,
        quizResource,
        license: activeLicense.value.seq,
        prevPage: "BookShelfView",
      });
      router.push(`/quiz/${sectionSeq}`);
    };
    return {
      startBookQuiz,
    };
  },
};
</script>

<style lang="scss" scoped>
.book {
  .title {
    display: flex;
    column-gap: 1rem;
  }
  .section-outer {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
}
.fade-enter-from {
  opacity: 0.4;
  transform: scale(0.9);
}
.fade-enter-active {
  transition: all 0.25s ease-out;
}
</style>
