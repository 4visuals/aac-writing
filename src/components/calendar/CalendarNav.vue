<template>
  <div class="cal-head">
    <ActionIcon
      class="move circle"
      icon="chevron_left"
      @click="$emit('shift', { by: -1, type: 'month' })"
    />
    <h5>{{ ym.year }}년 {{ ym.monthText }}월</h5>
    <ActionIcon
      class="move circle"
      icon="chevron_right"
      @click="$emit('shift', { by: 1, type: 'month' })"
    />
    <button class="nude move text" @click="$emit('shift', { type: 'today' })">
      오늘
    </button>
  </div>
</template>

<script>
import { ActionIcon } from "../../components/form";
import { Day, fromDate } from ".";
import { ref, watch } from "vue";
export default {
  components: {
    ActionIcon,
  },
  emits: ["shift"],
  props: { current: Day },
  setup(props) {
    const ym = ref(fromDate(props.current));

    watch(
      () => props.current,
      () => (ym.value = fromDate(props.current))
    );
    return {
      ym,
    };
  },
};
</script>

<style lang="scss" scoped>
$btn-color: #00000040;
.cal-head {
  display: flex;
  column-gap: 16px;
  padding: 0 16px;
  align-items: center;
  color: inherit;
  h5 {
    font-weight: 600;
  }
  .move {
    font-size: 2.2rem;
    height: 36px;
    border-radius: 40rem;
    box-shadow: #00000040 0px 0.0225em 0.0225em,
      rgb(0 0 0 / 25%) 0px 0.025em 0.2em, rgb(255 255 255 / 10%) 0px 0px 0px 1px;
    &.circle {
      width: 36px;
    }
    &.text {
      font-size: 1rem;
      padding: 4px 12px;
      color: inherit;
    }
  }
}
</style>
