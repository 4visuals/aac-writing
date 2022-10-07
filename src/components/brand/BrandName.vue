<template>
  <div
    class="brand-name"
    :style="`--bname-bgc: ${theme.bgc}; --bname-fgc: ${theme.color}`"
  >
    <h5 @click="toggleCourseMenu">
      <span>{{ text }}</span
      ><ActionIcon icon="expand_more" />
    </h5>
    <div class="course-view" v-if="modalVisible">
      <h5
        :class="`course ${course.name}`"
        v-for="course in courses.filter((c) => c.name !== path)"
        :key="course.name"
        @click="changeCourse(course)"
      >
        <span>{{ course.text }}</span
        ><ActionIcon icon="navigate_next" />
      </h5>
    </div>
  </div>
</template>

<script>
import { ActionIcon } from "@/components/form";
import router from "@/router";
// import { ParaText } from "@/components/text";
import { ref } from "vue";
export default {
  components: {
    ActionIcon,
    // Modal,
  },
  props: ["text", "theme", "path"],
  setup() {
    const modalVisible = ref(false);
    const toggleCourseMenu = () => {
      modalVisible.value = !modalVisible.value;
    };
    const hideModal = () => {
      modalVisible.value = false;
    };
    const courses = [
      {
        name: "level",
        path: "/level",
        text: "단계별 받아쓰기",
        theme: { color: "#d23d70", bgc: "#ffe1ea" },
      },
      {
        name: "book",
        path: "/book",
        text: "교과서 받아쓰기",
        theme: { color: "#865900", bgc: "#ffec88" },
      },
    ];

    const changeCourse = (course) => {
      router.replace(course.path);
    };
    return {
      modalVisible,
      toggleCourseMenu,
      hideModal,
      courses,
      changeCourse,
    };
  },
};
</script>

<style lang="scss" scoped>
.brand-name {
  position: relative;
  h5 {
    display: inline-flex;
    align-items: center;
    background-color: var(--bname-bgc);
    padding: 0.8rem 1.2rem;
    border-radius: 2rem;
    box-shadow: 0 0 0 1px var(--bname-fgc);
    color: var(--bname-fgc);
    pointer-events: all;
    cursor: pointer;
    span {
      padding-right: 1rem;
    }
  }
  .course-view {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 8px);
    pointer-events: all;
    display: flex;
    flex-direction: column;
    pointer-events: all;
    .course {
      &.level {
        color: #d23d70;
        background-color: #ffe1ea;
        box-shadow: 0 0 0 1px #d23d70;
      }
      &.book {
        color: #865900;
        background-color: #ffec88;
        box-shadow: 0 0 0 1px #865900;
      }
    }
  }
}
</style>
