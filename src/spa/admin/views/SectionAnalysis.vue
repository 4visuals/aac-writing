<template>
  <div class="analysis">
    <h5>
      <span>[{{ section.level }}]</span>{{ section.description }}
    </h5>
    <SentenceEditPanel
      v-if="editingSentence"
      :sentence="editingSentence"
      @analysis="applyAnalysis"
    />
    <div class="sentences">
      <EditableLevelGridView
        v-if="section.seq >= 100000"
        :section="section"
        @edit="showEditPanel"
        :modifications="modifications"
      />
      <LevelGridView v-else :section="section" />
    </div>
  </div>
</template>

<script setup>
import LevelGridView from "./LevelGridView.vue";
import EditableLevelGridView from "./EditableLevelGridView.vue";
import { defineProps, ref, shallowReactive } from "vue";
import SentenceEditPanel from "./SentenceEditPanel.vue";
defineProps(["section"]);

const editingSentence = ref(undefined);
const modifications = shallowReactive([]);
const showEditPanel = (sen) => {
  editingSentence.value = sen;
};
const applyAnalysis = (e) => {
  const idx = modifications.findIndex(
    (elem) => elem.sentence.seq === e.sentence.seq
  );
  if (idx >= 0) {
    modifications[idx] = e;
  } else {
    modifications.push(e);
  }
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
