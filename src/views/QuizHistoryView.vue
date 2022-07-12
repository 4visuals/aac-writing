<template>
  <div class="histories row" v-if="histories.length > 0">
    <div class="col-12">
      <h3>오늘</h3>
    </div>
    <div
      class="col-6 col-sm-6 col-md-4 col-lg-3 section-outer"
      v-for="section in histories"
      :key="section.seq"
    >
      <!-- <div class="quiz-elem" @itemClicked="$emit('itemClicked', section)">
        <ParaText>
          <span class="level">{{ levelText }}</span
          >{{ section.description }}<span></span>
        </ParaText>
      </div> -->
      <SectionButton
        :item="section"
        :idx="section.level"
        @itemClicked="$emit('itemClicked', section)"
        theme="pink"
      />
    </div>
  </div>
</template>

<script>
// import { ParaText } from "@/components/text";
import SectionButton from "@/components/SectionButton.vue";
import { quizDao } from "@/dao";
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
export default {
  components: {
    // ParaText,
    SectionButton,
  },
  props: ["origin"],
  setup(props) {
    const store = useStore();
    const license = computed(() => store.getters["exam/student"]);
    const histories = ref([]);
    console.log(store.state.quizHistory.state);
    quizDao.findBy().then((res) => {
      console.log("[history]", res);
      const sections = store.getters["course/sections"];
      const filtered = res
        .map((row) =>
          sections.find(
            (sec) => sec.origin === props.origin && sec.seq === row.sectionSeq
          )
        )
        .filter((sec) => !!sec);
      const distinct = filtered.reduce((acc, sec) => {
        if (!acc.find((elem) => elem === sec)) {
          acc.push(sec);
        }
        return acc;
      }, []);
      histories.value.push(...distinct);
    });

    return { license, histories };
  },
};
</script>

<style></style>
