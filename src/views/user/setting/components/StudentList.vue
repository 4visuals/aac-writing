<template>
  <div class="students">
    <h5>이용권에 연결할 학생을 선택해주세요</h5>
    <div class="list">
      <div
        v-for="stud in students"
        :key="stud.seq"
        @click="$emit('student', stud)"
        class="each"
      >
        {{ stud.name }}
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

export default {
  emits: ["student"],
  setup() {
    const store = useStore();
    const router = useRouter();
    const students = store.getters["user/unregisterdStudents"];
    const goTo = (uri) => {
      store.commit("setting/setActive", "student");
      modal.closeModal();
      router.replace(uri);
    };
    return { goTo, students };
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
      padding: 8px 16px;
      &:hover {
        background-color: #a4dcff;
      }
    }
    .reg-stud {
      padding: 16px;
      border-top: 1px solid #cdcdcd;
    }
    .nude {
      padding: 4px 0;
      font-weight: 400;
      color: var(--aac-color-blue-900);
      text-decoration: underline;
      text-underline-offset: 4px;
    }
  }
}
</style>
