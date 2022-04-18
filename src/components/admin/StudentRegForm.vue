<template>
  <div class="stud-reg">
    <ModalHeader theme="pink"><h3>학생등록</h3></ModalHeader>
    <div class="form">
      <TextField v-model:value="studName" @enter="registerStudent" />
      <AacButton text="추가" :inline="true" @click="registerStudent" />
    </div>
  </div>
</template>

<script>
import { TextField, AacButton } from "@/components/form";
import { ref } from "@vue/reactivity";
import api from "@/service/api";
import { useStore } from "vuex";

export default {
  components: { TextField, AacButton },
  setup() {
    const store = useStore();
    const studName = ref("");
    const registerStudent = () => {
      api.student
        .register(studName.value, "2020-04-15")
        .then((res) => {
          console.log(res);
          store.dispatch("user/autoLogin");
        })
        .catch((err) => {
          alert("학생 추가 실패: " + err.cause);
        });
    };
    return {
      studName,
      registerStudent,
    };
  },
};
</script>

<style lang="scss" scoped>
.stud-reg {
  .form {
    padding: 16px;
    display: flex;
    align-items: stretch;
  }
}
</style>
