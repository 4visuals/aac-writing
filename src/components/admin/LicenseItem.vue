<template>
  <div class="license normal effect pressed" :class="{ active }">
    <div class="remaining" v-if="vMode === 'normal'">
      <span class="ticket material-icons-outlined">schedule </span
      ><span>{{ remaining(lcs) }}</span>
    </div>
    <div class="progress-bar" v-if="vMode === 'normal'">
      <div class="bar" :style="`width:${resolveWidth(lcs)}`"></div>
    </div>
    <div class="assigned">
      <span v-if="assignee">{{ assignee.name }}</span
      ><span v-else>학생 없음</span>
    </div>
  </div>
</template>

<script>
import { time } from "@/service/util";
import { useStore } from "vuex";
import { computed, ref, watch } from "@vue/runtime-core";
export default {
  props: ["lcs", "current", "active", "mode"],
  setup(props) {
    const store = useStore();
    const students = computed(() => store.getters["user/students"]);
    const assignee = ref(null);
    const vMode = ref(props.mode || "normal");
    const updateAssignee = () => {
      assignee.value = students.value.find(
        (s) => s.seq === props.lcs.studentRef
      );
    };
    const remaining = (lcs) => {
      const exp = lcs.expiredAt;
      if (exp) {
        return time.diff(props.current, exp);
      } else {
        return "무제한";
      }
    };
    const resolveWidth = (lcs) => {
      const totalMillis = lcs.durationInHours * 60 * 60 * 1000;
      if (totalMillis === 0 || Number.isNaN(lcs.activatedAt)) {
        // 무제한 이용권(가입시 발급된 라이선스, totalMillis: 0)
        // 또는
        // 아직 사용 안했음(not activated)
        return "100%";
      } else {
        const remaining = lcs.expiredAt - props.current;
        return `${(100 * remaining) / totalMillis}%`;
      }
    };
    watch(() => props.lcs.studentRef, updateAssignee, { immediate: true });

    return { vMode, assignee, remaining, resolveWidth };
  },
};
</script>

<style lang="scss" scoped>
.license {
  margin: 4px 0;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  .remaining {
    display: flex;
    align-items: center;
    user-select: none;
  }
  .ticket {
    font-size: 16px;
    padding: 4px 8px;
  }
  .progress-bar {
    height: 3px;
    margin: 2px 8px 2px 32px;
    border-radius: 2px;
    .bar {
      height: 3px;
      width: 100%;
      border-radius: 2px;
    }
  }
  .assigned {
    text-align: right;
    padding: 4px 8px;
    user-select: none;
  }
  &.normal {
    background-color: #dbf6fd;
    color: #096c86;
    border: 1px solid #dbf6fd;
    .progress-bar {
      background-color: #b2d3dd;
      .bar {
        background-color: #096c86;
      }
    }
  }
  &.active {
    border-color: #096c86;
  }
}
</style>
