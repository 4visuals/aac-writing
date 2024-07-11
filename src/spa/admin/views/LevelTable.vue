<template>
  <div class="level-table">
    <h5>{{ levelData.level }}</h5>
    <div class="lvl" v-for="lvl in levelData.levels" :key="lvl.name">
      <div class="name">
        <span>{{ lvl.name }}</span>
      </div>
      <div class="parsed">
        <span
          class="char"
          v-for="char in chars"
          :key="char.idx"
          :class="{ matched: matched(lvl, char.idx) }"
          >{{ char.ch }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "@vue/runtime-core";
export default {
  // props: ["level", "text", "levels"],
  props: ["levelData"],
  setup(props) {
    const chars = ref([]);
    const splitToChar = () => {
      const arr = props.levelData.text.split("").map((ch, idx) => ({
        idx: idx * 3,
        ch,
      }));
      chars.value = arr;
    };
    const matched = (level, index) => {
      const found = level.ranges.filter(
        (range) => range[0] <= index && index < range[1]
      );
      return found.length > 0;
    };

    watch(
      () => props.levelData,
      () => {
        splitToChar();
      },
      {
        immediate: true,
      }
    );
    return { chars, matched };
  },
};
</script>

<style lang="scss" scoped>
.level-table {
  padding: 8px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 1.15rem;
  background-color: white;
  .lvl {
    display: flex;
    .name {
      padding-right: 8px;
    }
    .parsed {
      color: #777777;
      .char {
        padding: 2px;
        &.matched {
          color: #ff1c00;
          background-color: #ffedc3;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
