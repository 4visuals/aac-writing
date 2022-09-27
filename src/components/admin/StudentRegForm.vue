<template>
  <div class="stud-reg">
    <div class="form">
      <div class="error" v-if="error">{{ errorText() }}</div>
      <DatePicker
        :visible="form.visible"
        :time="form.student.birth"
        @cur-date="setBirthday"
        @toggle="(visible) => (form.visible = !visible)"
      />
      <h5>학생 이름</h5>
      <TextField
        icon="face"
        v-model:value="form.student.name"
        size="sm"
        placeholder="이름 입력"
      />
      <h5>학생 아이디</h5>
      <TextField
        icon="face"
        v-model:value="form.student.userId"
        size="sm"
        placeholder="아이디 입력"
      />
      <h5>비밀 번호</h5>
      <TextField
        icon="password"
        v-model:value="form.student.pass"
        size="sm"
        type="text"
        placeholder="비밀번호"
      />
      <div class="ctrl mgt-8px">
        <FormButton text="정보 수정" @click="registerStudent"></FormButton>
      </div>
    </div>
  </div>
</template>

<script>
import { TextField } from "@/components/form";
import DatePicker from "@/components/DatePicker.vue";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

const codes = {
  DUP_USER_ID: "사용중인 아이디입니다.",
};

export default {
  components: { TextField, DatePicker },
  props: ["student", "error"],
  setup(props, { emit }) {
    const form = ref({
      student: { ...props.student },
      visible: false,
      editMode: true,
    });
    const registerStudent = () => {
      emit("commit", { ...form.value.student, editing: form.value.editMode });
    };
    const setBirthday = (e) => {
      form.value.student.birth = new Date(e.time);
      if (e.changed === "month") {
        form.value.visible = false;
      }
    };
    const errorText = () => {
      return codes[props.error] || `요청 처리 실패(${props.error})`;
    };
    watch(
      () => props.student,
      (student) => {
        form.value.student = { ...student };
        form.value.editMode = true;
      }
    );
    watch(
      () => [
        form.value.student.name,
        form.value.student.userId,
        form.value.student.password,
      ],
      () => {
        emit("editing");
      }
    );
    return {
      form,
      registerStudent,
      setBirthday,
      errorText,
    };
  },
};
</script>

<style lang="scss" scoped>
.stud-reg {
  .form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    h5 {
      margin: 12px 0 4px;
    }
    .error {
      background-color: chocolate;
      color: white;
      padding: 8px 4px;
    }
  }
}
</style>
