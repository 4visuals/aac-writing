<template>
  <div class="student-menu">
    <template v-if="students.length === 0">
      <p class="mgt-8px mgb-8px">
        등록된 학생이 없습니다. 수강증을 클릭해서 학생을 등록해주세요.
      </p>
    </template>
    <template v-else>
      <p>{{ students.length }}명</p>
      <div class="stud-list">
        <StudentItem
          v-for="s in students"
          :key="s.seq"
          :student="s"
          @clicked="showStudentDetailView"
        />
      </div>
    </template>

    <teleport to="body" v-if="modal">
      <Modal @hidden="hideModal" height="80%">
        <component
          :is="modal.comp"
          v-bind="{ ...modal.args }"
          v-on="{ ...modal.events }"
        />
      </Modal>
    </teleport>
  </div>
</template>

<script>
// import QuizStatsView from "@/components/stats/QuizStatsView.vue";
import { StudentDetailView } from "@/components/user";
import { StudentItem } from "@/components/admin";
import { StaticButton } from "@/components/form";
import { shallowRef } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
export default {
  components: {
    StudentItem,
    StaticButton,
  },
  setup() {
    const store = useStore();
    const students = computed(() => store.getters["user/students"]);
    const modal = shallowRef(null);
    const showStudentDetailView = (student) => {
      modal.value = {
        comp: StudentDetailView,
        args: { student },
        events: {},
      };
    };
    const hideModal = () => {
      modal.value = null;
    };
    const createStudent = (student) => {
      console.log(student);
    };
    return {
      modal,
      students,
      showStudentDetailView,
      createStudent,
      hideModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.student-menu {
  flex: 1 1 auto;
  .reg {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    background-color: #dbf6fd;
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px dashed transparent; // #096c86
    color: #096c86;
    width: 100%;
    .icon {
      font-size: inherit;
      font-size: 1.4rem;
      margin-right: 10px;
    }
    &:hover {
      background-color: #c4f0fa;
      color: #045a70;
    }
    &:active {
      background-color: #abd8e2;
      color: #063e4c;
      // transform: translate(1px, 1px);
    }
  }
  .stud-list {
    display: flex;
    flex-wrap: wrap;
    row-gap: 4px;
    column-gap: 4px;
    padding: 8px 0;
  }
  .ctrl-stud {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
