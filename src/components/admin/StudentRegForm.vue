<template>
  <div class="stud-reg">
    <ModalHeader theme="pink"><h3>학생등록</h3></ModalHeader>
    <DatePicker :time="new Date().getTime()" @cur-date="onBirthdaySelected" />
    <div class="form">
      <ParaText>{{ birthday.year }}년 {{ birthday.month }}월</ParaText>
      <TextField v-model:value="studName" @enter="registerStudent" />
      <AacButton text="추가" :inline="true" @click="registerStudent" />
    </div>
  </div>
</template>

<script>
import { TextField, AacButton } from "@/components/form";
import { ParaText } from "@/components/text";
import DatePicker from "@/components/DatePicker.vue";
import { ref } from "@vue/reactivity";
import api from "@/service/api";
import { useStore } from "vuex";
import { time } from "@/service/util";

export default {
  components: { TextField, AacButton, DatePicker, ParaText },
  setup() {
    const store = useStore();
    const studName = ref("");
    const birthday = ref(time.toYMD2(new Date().getTime()));
    const registerStudent = () => {
      const birth = `${birthday.value.year}-${birthday.value.month}-${birthday.value.date}`;
      api.student
        .register(studName.value, birth)
        .then((res) => {
          console.log(res);
          store.dispatch("user/autoLogin");
        })
        .catch((err) => {
          alert("학생 추가 실패: " + err.cause);
        });
    };
    const onBirthdaySelected = (e) => {
      birthday.value = e;
    };
    return {
      studName,
      birthday,
      registerStudent,
      onBirthdaySelected,
    };
  },
};
</script>

<style lang="scss" scoped>
.stud-reg {
  .form {
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
