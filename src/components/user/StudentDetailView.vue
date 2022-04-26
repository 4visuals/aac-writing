<template>
  <div class="stud-wrapper">
    <h3>{{ student.name }}</h3>
    <TabView :model="tabModel" />
  </div>
</template>

<script>
import StudentProfile from "./StudentProfile.vue";
import QuizStatsView from "@/components/stats/QuizStatsView.vue";
import { TabModel, TabView } from "@/components/tab";
export default {
  props: ["student"],
  components: {
    TabView,
  },
  setup(props) {
    const tabModel = TabModel.create([
      {
        text: "학생",
        cmd: "profile",
        body: { comp: StudentProfile, args: { student: props.student } },
      },
      {
        text: "통계",
        cmd: "stats",
        body: { comp: QuizStatsView, args: { student: props.student } },
      },
    ]);
    console.log(props.student);
    return { tabModel };
  },
};
</script>

<style lang="scss" scoped>
.stud-wrapper {
  padding: 16px;
  > h3 {
    margin-bottom: 8px;
  }
}
</style>
