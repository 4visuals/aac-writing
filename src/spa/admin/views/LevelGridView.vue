<template>
  <div class="level-grid-view">
    <table ref="tbody">
      <thead>
        <th></th>
        <th v-for="col in columns" :key="col.level" :class="`lvl-${col.level}`">
          {{ col.text }}
        </th>
      </thead>
      <tbody>
        <tr
          v-for="sen in section.sentences"
          :key="sen.seq"
          :class="{ active: activeCell.sen === sen }"
        >
          <td class="col-sen" @click="showSentenceAnalysis(sen, $event)">
            {{ sen.sentence }}
          </td>
          <td
            v-for="col in columns"
            :key="col.level"
            :class="`lvl-${col.level}`"
            @click="activateAt(col, sen)"
          >
            {{ countByLevel(sen, col.text) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="floating" ref="floatingDiv" v-if="activeSen">
      <LevelTable :levelData="activeSen" />
      <button @click="activeSen = null">CLOSE</button>
    </div>
  </div>
</template>

<script>
import LevelTable from "./LevelTable.vue";
import { ref } from "@vue/reactivity";
import { nextTick, onMounted, watch } from "@vue/runtime-core";
import { GET } from "@/service/api/request";
export default {
  components: {
    LevelTable,
  },
  props: ["section"],
  setup(props) {
    const tbody = ref(null);
    const floatingDiv = ref(null);
    const difficulty = ref(null);
    const activeSen = ref(null);
    const columns = [];
    for (let i = 0; i < 50; i++) {
      columns.push({ text: (i < 9 ? "0" : "") + (i + 1), level: i + 1 });
    }
    const activeCell = ref({ sen: null, col: null });
    const countByLevel = (sen, levelText) => {
      if (!difficulty.value) {
        return "";
      }
      const levels = difficulty.value[sen.seq];
      if (!levels) {
        return "";
      }
      const prop = "L" + levelText;
      const ranges = levels[prop];
      return ranges && ranges.length > 0 ? ranges.length : "";
    };
    const analyzeSection = (section) => {
      GET(`/admin/section/${section.seq}/difficulties`).then((res) => {
        difficulty.value = res.df;
      });
    };
    const activateAt = (col, sen) => {
      if (activeCell.value.col) {
        const cols = tbody.value.querySelectorAll(
          `.lvl-${activeCell.value.col.level}`
        );
        cols.forEach((el) => el.classList.remove("active"));
      }
      activeCell.value = {
        sen,
        col,
      };
      const cols = tbody.value.querySelectorAll(`.lvl-${col.level}`);
      cols.forEach((el) => el.classList.add("active"));
    };
    const showSentenceAnalysis = (sen, e) => {
      const levels = difficulty.value[sen.seq];
      const arr = Object.keys(levels).map((prop) => ({
        name: prop,
        ranges: levels[prop],
      }));
      arr.sort((a, b) => a.name.localeCompare(b.name));
      activeSen.value = {
        level: props.section.level,
        text: sen.sentence,
        levels: arr,
      };
      activeCell.value.sen = sen;
      nextTick().then(() => {
        console.log(e.target);
        const floatingEl = floatingDiv.value;
        floatingEl.style.top = `${
          e.target.offsetTop + e.target.offsetHeight
        }px`;
        floatingEl.style.left = `${e.target.offsetWidth + 16}px`;
      });
    };
    watch(
      () => props.section,
      (section) => {
        activeCell.value = { sen: null, col: null };
        activeSen.value = null;
        analyzeSection(section);
      },
      {
        immediate: false,
      }
    );
    onMounted(() => {
      analyzeSection(props.section);
    });
    return {
      activeCell,
      floatingDiv,
      activeSen,
      columns,
      tbody,
      difficulty,
      countByLevel,
      activateAt,
      showSentenceAnalysis,
    };
  },
};
</script>

<style lang="scss" scoped>
.level-grid-view {
  position: relative;
  table {
    position: relative;
    thead {
      position: sticky;
      top: 0;
      background-color: white;
      box-shadow: 0 1px 1px #0000004d;
    }
    tr {
      border-bottom: 1px solid #ccc;
      &.active {
        background-color: #d5d5d5aa;
      }
    }
    th,
    td {
      font-weight: 400;
      padding: 2px;
      cursor: pointer;
      user-select: none;
      &.col-sen {
        white-space: nowrap;
      }
      &.active {
        background-color: #d5d5d5aa;
      }
    }
    td {
      text-align: right;
    }
  }
  .floating {
    position: absolute;
  }
}
</style>
