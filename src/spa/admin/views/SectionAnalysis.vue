<template>
  <div class="analysis">
    <h5>
      <span>[{{ section.level }}]</span>{{ section.description }}
    </h5>
    <div class="sentences">
      <LevelGridView :section="section" />
    </div>
  </div>
</template>

<script>
import LevelGridView from "./LevelGridView.vue";
import { GET } from "@/service/api/request";
import { ref } from "@vue/reactivity";

export default {
  props: ["section"],
  components: {
    LevelGridView,
  },
  setup() {
    console.log();
    const analysis = ref(new Map());
    const difficulty = ref({});

    const analyze = (sen) => {
      GET(`/admin/sentence/${sen.seq}/levels`).then((res) => {
        console.log(res);
        const { levels, sentence } = res;
        analysis.value.set(sen.seq, { levels, detail: sentence });
      });
    };
    return { difficulty, analysis, analyze };
  },
};
</script>

<style lang="scss" scoped>
.analysis {
  padding-left: 16px;
  position: sticky;
  top: 8px;
  .sentences {
    .sentence {
      cursor: pointer;
    }
  }
}
</style>
