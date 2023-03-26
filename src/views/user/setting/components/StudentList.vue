<template>
  <div class="students">
    <h5>이용권에 연결할 학생을 선택해주세요</h5>
    <div class="list">
      <div
        v-for="stud in students"
        :key="stud.seq"
        @click="setActive(stud)"
        class="each"
        :class="{ active: activeStudent === stud }"
      >
        <span class="name">{{ stud.name }}</span>
        <button
          v-if="activeStudent === stud"
          @click="$emit('student', stud)"
          class="nude blue"
        >
          연결
        </button>
      </div>
      <div class="reg-stud">
        <p>
          새로운 학생을 추가하려면
          <a href="#" @click.prevent="goTo('/setting/student')">학생 추가</a>를
          눌러주세요.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import modal from "@/components/modal";
import { ref } from "vue";

export default {
  emits: ["student"],
  setup() {
    const store = useStore();
    const router = useRouter();
    const students = store.getters["user/unregisterdStudents"];
    const activeStudent = ref(null);
    const setActive = (student) => {
      activeStudent.value = student;
    };
    const goTo = (uri) => {
      store.commit("setting/setActive", "student");
      modal.closeModal();
      router.replace(uri);
    };
    return { activeStudent, setActive, goTo, students };
  },
};
</script>

<style lang="scss" scoped>
.students {
  font-size: 1.2rem;
  h5 {
    padding: 16px 16px 4px;
  }
  .list {
    padding: 4px 0;
    cursor: pointer;
    .each {
      display: flex;
      align-items: center;
      padding: 0px 16px;
      height: 40px;
      &.active,
      &:hover {
        background-color: #a4dcff;
      }
      .name {
        flex: 1 1 auto;
      }
    }
    .reg-stud {
      padding: 16px;
      border-top: 1px solid #cdcdcd;
    }
  }
}
</style>
