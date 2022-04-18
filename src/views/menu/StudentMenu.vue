<template>
  <div class="student-menu">
    <template v-if="students.length === 0">
      <p class="mgt-8px mgb-8px">등록된 학생이 없습니다.</p>
      <button class="nude reg effect pressed" @click="showStudentRegForm">
        <span class="icon material-icons-outlined"> person_add </span
        ><span>학생 등록</span>
      </button>
    </template>
    <template v-else>
      <p>{{ students.length }}명</p>
      <div class="stud-list">
        <StudentItem v-for="s in students" :key="s.seq" :student="s" />
      </div>
      <div class="ctrl-stud">
        <StaticButton
          text="추가"
          size="sm"
          theme="blue"
          inline
          @click="showStudentRegForm"
        ></StaticButton>
      </div>
    </template>

    <teleport to="body" v-if="modalVisible">
      <Modal ref="modal" @hidden="hideModal">
        <StudentRegForm @student="createStudent" />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import { StudentRegForm, StudentItem } from "@/components/admin";
import { StaticButton } from "@/components/form";
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
export default {
  components: {
    StudentRegForm,
    StudentItem,
    StaticButton,
  },
  setup() {
    const store = useStore();
    const students = computed(() => store.getters["user/students"]);
    const modalVisible = ref(false);
    const showStudentRegForm = () => {
      modalVisible.value = true;
    };
    const hideModal = () => (modalVisible.value = false);
    const createStudent = (student) => {
      console.log(student);
    };
    return {
      modalVisible,
      students,
      showStudentRegForm,
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
