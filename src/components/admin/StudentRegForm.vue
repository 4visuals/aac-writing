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
      <TextField
        icon="face"
        v-model:value="form.student.name"
        size="sm"
        placeholder="이름 입력"
      />
      <TextField
        icon="face"
        v-model:value="form.student.userId"
        size="sm"
        placeholder="아이디 입력"
      />
      <TextField
        icon="password"
        v-model:value="form.student.pass"
        size="sm"
        type="text"
        placeholder="비밀번호"
      />
      <AacButton
        size="xs"
        inline
        theme="pink"
        text="정보 수정"
        @click="registerStudent"
        v-if="form.editMode"
      ></AacButton>
      <AacButton
        size="xs"
        inline
        theme="blue"
        text="학생 등록"
        @click="registerStudent"
        v-else
      ></AacButton>
    </div>
  </div>
</template>

<script>
import { TextField, AacButton } from "@/components/form";
import DatePicker from "@/components/DatePicker.vue";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
// import api from "@/service/api";

const DEFAULT_STUDENT = {
  name: "",
  userId: "",
  password: "",
  birth: undefined,
};

const codes = {
  DUP_RESOURCE: "사용중인 아이디입니다.",
};

export default {
  components: { TextField, AacButton, DatePicker },
  props: ["student", "error"],
  setup(props, { emit }) {
    const form = ref({
      student: { ...props.student },
      visible: false,
      editMode: true,
    });
    if (!props.student) {
      form.value.student = Object.assign({}, DEFAULT_STUDENT, {
        birth: new Date(),
      });
      form.value.editMode = false;
    }
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
        form.value.student =
          student ||
          Object.assign({}, DEFAULT_STUDENT, {
            birth: new Date(),
          });
        form.value.editMode = !!student;
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
    .error {
      background-color: chocolate;
      color: white;
      padding: 8px 4px;
    }
  }
}
</style>
