<template>
  <div class="container-fluid">
    <div class="sentence-list row">
      <div
        class="cell col-6 col-sm-6 col-md-3 col-lg-2"
        v-for="(group, idx) in groups"
        :key="group.key"
      >
        <SpanText
          class="item"
          :class="{ visited: hasHistory(group) }"
          @click="$emit('choosen', group)"
        >
          {{ idx === 0 ? "전체" : `${group.start + 1} ~ ${group.end}` }}
        </SpanText>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { SpanText } from "@/components/text";
import { watch } from "@vue/runtime-core";
export default {
  props: ["histories", "sentences"],
  components: {
    SpanText,
  },
  setup(props) {
    const groups = ref([]);
    const size = 10;
    const updateGroups = () => {
      groups.value = [];
      groups.value.push({
        start: 0,
        end: props.sentences.length,
        sentences: props.sentences,
        text: "전체",
      });
      const groupSize =
        props.sentences.length / size +
        (props.sentences.length % size > 0 ? 1 : 0);
      for (let k = 0; k < groupSize; k++) {
        const s = size * k;
        const e = Math.min(props.sentences.length, s + size);
        groups.value.push({
          key: k,
          start: s,
          end: e,
          sentences: props.sentences.slice(s, e),
        });
      }
    };
    const hasHistory = (group) => {
      const { start, end } = group;
      return props.histories.find(
        (h) => h.ranges[0] === start && h.ranges[1] === end
      );
    };

    updateGroups();

    watch(props.sentences, () => {
      updateGroups();
    });
    return {
      groups,
      hasHistory,
    };
  },
};
</script>

<style lang="scss" scoped>
.sentence-list {
  // display: flex;
  // flex-wrap: wrap;
  // column-gap: 8px;
  margin-top: 16px;
  .cell {
    display: flex;
    margin-bottom: 8px;
    .item {
      flex: 1 1 auto;
      display: inline-flex;
      justify-content: center;
      border-radius: 8px;
      padding: 8px 16px;
      background-color: #ffeb3b;
      color: #865900;
      user-select: none;
      cursor: pointer;
      &.visited {
        background-color: #feb62c;
        color: #251900;
      }
    }
  }
}
</style>
