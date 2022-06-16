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

export default {
  components: {
    SectionButton,
    ActionIcon,
  },
  props: ["book"],
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
