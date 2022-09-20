<template>
  <div class="segments">
    <div
      class="seg"
      v-for="seg in segments"
      :key="seg.index"
      :class="{
        current: seg.current,
        active: activeSegment && activeSegment.index === seg.index,
      }"
      :style="{
        'background-color': seg.mainColor,
        outlineColor: seg.subColor,
      }"
      @click="setActiveSegment(seg)"
    >
      <span class="dot">{{ seg.label }}</span>
      <span v-if="seg.current" class="mark material-icons-outlined"
        >star_outline</span
      >
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  emits: ["active-segment"],
  props: ["resourceType", "toggling"],
  setup(props, { emit }) {
    const store = useStore();
    const ctx = store.state.quiz.quizContext;
    const activeSegment = ref(null);
    const segments = ref([]);
    // console.log(props.resourceType);
    const setActiveSegment = (segment) => {
      if (activeSegment.value === segment) {
        if (props.toggling) {
          activeSegment.value = null;
        }
      } else {
        activeSegment.value = segment;
      }
      emit("active-segment", activeSegment.value);
    };
    const updateSegments = () => {
      segments.value = ctx.getSegments(props.resourceType);
      activeSegment.value = null;
      const [start, end] = ctx.ranges;
      const activeSeg = segments.value.find(
        (seg) => seg.offset === start && seg.size === end - start
      );
      setActiveSegment(activeSeg);
    };
    watch(() => props.resourceType, updateSegments, { immediate: true });
    return {
      activeSegment,
      segments,
      setActiveSegment,
    };
  },
};
</script>

<style lang="scss" scoped>
.segments {
  display: flex;
  column-gap: 4px;
  row-gap: 4px;
  flex-wrap: wrap;

  .seg {
    border-radius: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
    .mark {
      font-size: 14px;
      margin-right: 4px;
      margin-left: -6px;
      color: white;
    }
    &.active {
      outline: 4px solid transparent;
    }
    &:hover {
      transform: translate(-1px, -1px);
    }
    &:active {
      transform: translate(0px, 0px);
    }
    .dot {
      padding: 4px 8px;
      color: #fff;
      font-size: 10px;
      font-weight: bold;
    }
  }
}
</style>
