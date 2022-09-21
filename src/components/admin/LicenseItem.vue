<template>
  <div
    class="license normal effect pressed"
    :class="{
      active,
      expired: lcs.expiredAt && lcs.expiredAt - current <= 0,
      sm: size === 'sm',
    }"
  >
    <div class="progress-bar" v-if="vMode === 'normal'">
      <div class="bar" :style="`width:${resolveWidth(lcs)}`"></div>
    </div>
    <div class="assigned">
      <span class="student" v-if="assignee">{{ assignee.name }}</span
      ><span class="student" v-else>없음</span>
      <span class="remaining" v-if="size !== 'sm'">{{ remaining(lcs) }}</span>
    </div>
  </div>
</template>

<script>
import { time } from "@/service/util";
import { ref, watch } from "@vue/runtime-core";
export default {
  props: ["lcs", "students", "current", "active", "mode", "size"],
  setup(props) {
    const UNLIMITED = 24 * 365 * 10;
    const assignee = ref(null);
    const vMode = ref(props.mode || "normal");
    const updateAssignee = () => {
      assignee.value = props.students.find(
        (s) => s.seq === props.lcs.studentRef
      );
    };
    const remaining = (lcs) => {
      const exp = lcs.expiredAt;
      if (lcs.durationInHours === UNLIMITED) {
        return "무제한";
      }
      if (exp) {
        if (exp - props.current > 0) {
          return time.diff(props.current, exp);
        } else {
          return "만료됨";
        }
      } else {
        return "무제한";
      }
    };
    const resolveWidth = (lcs) => {
      const totalMillis = lcs.durationInHours * 60 * 60 * 1000;
      if (
        totalMillis === 0 ||
        Number.isNaN(lcs.activatedAt) ||
        lcs.durationInHours === UNLIMITED
      ) {
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
    watch(
      () => props.students,
      () => {
        updateAssignee();
      }
    );
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
  position: relative;
  color: #4d3d06;

  .ticket {
    font-size: 16px;
    padding: 4px 8px;
  }
  .progress-bar {
    height: 100%;
    position: absolute;
    top: 0px;
    width: 100%;
    left: 0;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    .bar {
      background-color: #ffe546;
      flex: 1 1 auto;
      border-radius: 4px;
    }
  }
  .assigned {
    padding: 4px 8px;
    user-select: none;
    position: relative;
    display: flex;
    .remaining {
      flex: 0 0;
      white-space: nowrap;
    }
    .student {
      flex: 1 1 auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &.normal {
    background-color: #fff9ac;

    border: 1px solid transparent;
    .progress-bar {
      // background-color: #b2d3dd;
      .bar {
        background-color: #ffe546;
      }
    }
    &.expired {
      .progress-bar {
        // background-color: #b2d3dd;
        .bar {
          background-color: #e2e2e2;
        }
      }
      .assigned {
        color: #999;
      }
    }
  }
  &.active {
    border-color: #4d3d06; // #096c86;
  }
}
</style>
