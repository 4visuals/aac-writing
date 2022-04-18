<template>
  <div
    class="brand-name"
    :style="`--bname-bgc: ${theme.bgc}; --bname-fgc: ${theme.color}`"
    @click="showCourseMenu"
  >
    <h5 @click="showCourseMenu">
      <span>{{ text }}</span
      ><ActionIcon icon="expand_more" />
    </h5>
  </div>
  <teleport to="body" v-if="modalVisible">
    <Modal :width="'sm'" @hidden="hideModal">
      <div class="course-view">
        <h3>코스 선택</h3>
        <div class="courses">
          <div class="course" v-for="course in courses" :key="course.name">
            <h3 @click="changeCourse(course)">
              <span class="name">{{ course.text }}</span>
            </h3>
          </div>
        </div>
      </div>
    </Modal>
  </teleport>
</template>

<script>
import { ActionIcon } from "@/components/form";
import { Modal } from "@/components";
import router from "@/router";
// import { ParaText } from "@/components/text";
import { ref } from "vue";
export default {
  components: {
    ActionIcon,
    Modal,
  },
  props: ["text", "theme", "path"],
  setup() {
    ref;
    const modalVisible = ref(false);
    const showCourseMenu = () => {
      modalVisible.value = true;
    };
    const hideModal = () => {
      modalVisible.value = false;
    };
    const courses = [
      {
        name: "level",
        path: "/level",
        text: "단계별 받아쓰기",
      },
      {
        name: "book",
        path: "/book",
        text: "교과서 받아쓰기",
      },
    ];

    const changeCourse = (course) => {
      router.push(course.path);
    };
    return {
      modalVisible,
      showCourseMenu,
      hideModal,
      courses,
      changeCourse,
    };
  },
};
</script>

<style lang="scss" scoped>
.brand-name {
  h5 {
    display: inline-flex;
    align-items: center;
    background-color: var(--bname-bgc);
    padding: 0.8rem 1.2rem;
    border-radius: 2rem;
    box-shadow: 0 0 0 1px var(--bname-fgc);
    color: var(--bname-fgc);
    pointer-events: all;
    span {
      padding-right: 1rem;
    }
  }
}
.course-view {
  padding: 16px;
}
</style>
