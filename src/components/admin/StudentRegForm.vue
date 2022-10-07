<template>
  <div class="stud-reg">
    <p>학생 정보를 수정할 수 있습니다.</p>
    <div class="form">
      <TextFieldView
        v-for="form in formRef"
        :readOnly="!editable"
        :key="form.wid"
        :formModel="form"
        @value="handleForm"
      />
    </div>
  </div>
</template>

<script>
import { TextFieldView, InputForm, validators } from "@/components/form";
// import DatePicker from "@/components/DatePicker.vue";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import toast from "../toast";

export default {
  components: { TextFieldView },
  props: {
    student: { type: Object },
    error: { type: Object },
    editable: { type: Boolean, default: true },
  },
  setup(props) {
    const store = useStore();
    const forms = InputForm.fromUser(props.student);
    const formRef = ref(forms);
    const setBirthday = (e) => {
      formRef.value.student.birth = new Date(e.time);
      if (e.changed === "month") {
        formRef.value.visible = false;
      }
    };
    const updateForm = (student) => {
      const forms = InputForm.fromUser(student);
      formRef.value = forms;
    };
    const handleForm = ({ inputForm, value, commit }) => {
      console.log(inputForm, value);
      const { student } = props;
      const validator = validators.user[inputForm.wid];
      if (validator) {
        validator(value)
          .then(() =>
            store.dispatch("user/updateStudentProp", {
              student,
              prop: inputForm.wid,
              value,
            })
          )
          .then(() => {
            commit(value);
            toast.success("수정 완료", null, 2);
          })
          .catch((err) => {
            inputForm.error = err.cause ? "@" + err.cause : err;
            commit(null);
          });
      }
    };
    watch(
      () => props.student,
      (student) => {
        updateForm(student);
      }
    );
    return {
      formRef,
      handleForm,
      setBirthday,
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
