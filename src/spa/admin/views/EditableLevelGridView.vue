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
        <template v-for="group in sentenceGroups" :key="group.key">
          <tr>
            <td>{{ group.key }}</td>
          </tr>
          <tr
            v-for="sen in group.sentences"
            :key="sen.seq"
            :class="{
              active: activeCell.sen === sen,
              modified: group.isModified(sen),
            }"
          >
            <td class="col-sen" @click="showSentenceAnalysis(sen, $event)">
              <span>{{ group.getText(sen) }}</span
              ><button class="nude" @click.stop="showStenceEditPanel(sen)">
                EDIT
              </button>
            </td>
            <td
              v-for="col in columns"
              :key="col.level"
              :class="`lvl-${col.level}`"
              @click="activateAt(col, sen)"
            >
              {{ group.countByLevel(difficulty, sen, col) }}
            </td>
          </tr>
          <!--eslint-disable-next-line vue/require-v-for-key-->
          <tr class="total">
            <td class="col-sen"></td>
            <td
              v-for="(col, index) in group.colModel.columns"
              :key="col.level"
              :class="`lvl-${col.level}`"
              @click="activateAt(col, sen)"
            >
              {{ group.colsums[index] }}
            </td>
          </tr>
        </template>
        <tr :key="updatedKey">
          <td class="col-sen">TOTAL</td>
          <td
            v-for="(col, index) in columns"
            :key="col.level"
            :class="`lvl-${col.level}`"
          >
            {{ sumOfColumn(index) }}
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

<script setup>
import LevelTable from "./LevelTable.vue";
import { ref, shallowRef } from "@vue/reactivity";
import { defineProps, defineEmits } from "vue";
import { nextTick, onMounted, watch } from "@vue/runtime-core";
import { GET } from "@/service/api/request";
import { SentenceGroupModel } from "../../../entity/level-group-model";

const props = defineProps(["section", "modifications"]);
const emits = defineEmits(["edit"]);
const tbody = ref(null);
const floatingDiv = ref(null);
const difficulty = ref(null);
const activeSen = ref(null);
const columns = [];
const updatedKey = ref("s");
/** @type import('../../../entity/level-group-model').SentenceGroupModel */
const sentenceGroups = shallowRef([]);
for (let i = 0; i < 50; i++) {
  columns.push({ text: (i < 9 ? "0" : "") + (i + 1), level: i + 1 });
}
const activeCell = ref({ sen: null, col: null });

const sumOfColumn = (index) => {
  return sentenceGroups.value.reduce((sum, group) => {
    return sum + group.colsums[index];
  }, 0);
};
const showStenceEditPanel = (sen) => {
  emits("edit", sen);
};
const analyzeSection = (section) => {
  sentenceGroups.value = SentenceGroupModel.group(section);
  /**
   * 진단평가를 레벨 분석에 보여주기 위해서 백엔드에서 지정한 가상의 seq 번호
   * 이 값을 고치지 마쇼!!(100,000으로 고정했음)
   */
  const DIAGNOSIS_SECTION_SEQ = 100000;
  if (section.seq >= DIAGNOSIS_SECTION_SEQ) {
    GET(`/diagnosis/difficulties`).then((res) => {
      difficulty.value = res;
      sentenceGroups.value.forEach((group) => {
        group.captureDifficulty(res);
      });
    });
  } else {
    GET(`/admin/section/${section.seq}/difficulties`).then((res) => {
      difficulty.value = res.df;
    });
  }
};
const applyModification = (modif) => {
  sentenceGroups.value.forEach((group) => {
    group.setModification(modif, difficulty.value);
  });
  const groups = [...sentenceGroups.value];
  setTimeout(() => {
    sentenceGroups.value = groups;
    console.log("updated?");
    updatedKey.value = Math.random().toString(36).substring(2);
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
    floatingEl.style.top = `${e.target.offsetTop + e.target.offsetHeight}px`;
    floatingEl.style.left = `${e.target.offsetWidth + 16}px`;
  });
};
watch(props.modifications, (modif) => {
  applyModification(modif);
});
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
      &.total {
        background-color: rgb(239, 255, 57);
        font-weight: 500;
      }
      &.modified {
        color: rgb(255, 4, 0);
        & td > span {
          font-weight: 600;
        }
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
      button.nude {
        padding: 1px;
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
