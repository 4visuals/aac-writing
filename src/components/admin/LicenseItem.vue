<template>
  <div
    :data-lcs="lcs.uuid"
    class="license normal effect pressed"
    :class="{
      active,
      expired: lcs.isExpired(),
      sm: size === 'sm',
      xs: size === 'xs',
    }"
  >
    <div class="assigned">
      <SpanText size="sm" class="student" v-if="assignee">{{
        assignee.name
      }}</SpanText
      ><SpanText size="sm" class="student" v-else>없음</SpanText>
      <SpanText size="sm" class="remaining" v-if="size !== 'sm'">{{
        remaining(lcs)
      }}</SpanText>
    </div>
    <div class="newlcs" v-if="lcs.isNew">NEW</div>
  </div>
</template>

<script>
import { ref, watch } from "@vue/runtime-core";
import { SpanText } from "@/components/text";
export default {
  props: ["lcs", "students", "active", "mode", "size"],
  components: { SpanText },
  setup(props) {
    const assignee = ref(null);
    const vMode = ref(props.mode || "normal");
    const updateAssignee = () => {
      assignee.value = props.students.find(
        (s) => s.seq === props.lcs.studentRef
      );
    };
    const remaining = () => {
      return "";
    };

    watch(() => props.lcs.studentRef, updateAssignee, { immediate: true });
    watch(
      () => props.students,
      () => {
        updateAssignee();
      }
    );
    return { vMode, assignee, remaining };
  },
};
</script>

<style lang="scss" scoped>
.license {
  margin: 4px 0;
  border-radius: 16px;
  border: 1px solid transparent;
  cursor: pointer;
  position: relative;
  color: #4d3d06;

  &.xs {
    .assigned {
      padding: 4px 8px;
      .sm.student {
        font-size: 12px;
      }
    }
  }

  .ticket {
    font-size: 16px;
    padding: 4px 8px;
  }
  .assigned {
    padding: 8px 12px;
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
    background-color: #ffe546;
    border: 1px solid transparent;
  }
  &.expired {
    background-color: #ffd7d7;
    color: #8b1027;
    border-color: transparent;
    &.active {
      border-color: #8b1027;
    }
  }
  .newlcs {
    color: #fff9ac;
    background-color: crimson;
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translateY(-50%);
    font-size: 9px;
    border-radius: 4px;
    padding: 1px 3px;
  }
  &.active {
    border-color: #4d3d06; // #096c86;
  }
}
</style>
