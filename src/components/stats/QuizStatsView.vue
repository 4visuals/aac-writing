<template>
  <div class="stats-wrapper">
    <DailyStats :stats="stats" />
  </div>
</template>

<script>
import api from "@/service/api";
import DailyStats from "./DailyStats.vue";
import { shallowRef } from "@vue/reactivity";
export default {
  components: {
    DailyStats,
  },
  props: ["student"],
  setup(props) {
    const stats = shallowRef(false);
    api.stats.sections("student", props.student.seq).then((res) => {
      stats.value = res.stats;
    });
    return { stats };
  },
};
</script>

<style></style>
