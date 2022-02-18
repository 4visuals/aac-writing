<template>
  <Nav />
  <div>level view</div>
  <div class="rows">
    <div class="row" v-for="row in rows" :key="row">
      <SectionButton
        :item="quiz"
        v-for="quiz in row.quiz"
        :key="quiz.seq"
        @itemClicked="moveTo"
      />
      <SectionButton :item="row.test[0]" @itemClicked="moveTo" />
    </div>
  </div>
</template>

<script>
import Nav from "@/views/Nav.vue";
import SectionButton from "@/components/SectionButton.vue";
import { useStore } from "vuex";
import { computed } from "vue";
import router from "@/router";
export default {
  props: ["cate"],
  components: {
    Nav,
    SectionButton,
  },
  setup() {
    const store = useStore();
    console.log(store.state.course.cates.level);
    const rows = computed(() => store.state.course.cates.level);
    const moveTo = (quiz) => {
      console.log(quiz);
      router.push("/quiz/" + quiz.seq);
    };
    return {
      rows,
      moveTo,
    };
  },
};
</script>

<style lang="scss" scoped>
.rows {
  .row {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
