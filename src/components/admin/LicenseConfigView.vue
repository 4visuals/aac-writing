<template>
  <div class="lcs-config-view">
    <div class="lcs-view">
      <LicenseItem
        @click="active = lcs"
        v-for="lcs in licenses"
        :students="students"
        :lcs="lcs"
        :current="current"
        :active="active === lcs"
        :key="lcs.seq"
        size="sm"
      >
      </LicenseItem>
    </div>
    <div class="stud-view">
      <div class="stud-list" v-if="studentInUse">
        <StudentItem :student="studentInUse" @click="openStudenEditor" />
      </div>
      <div v-else class="reg">
        <p>새로운 학생을 추가할 수 있습니다.</p>
        <!-- <StudentRegForm @student="registerStudent" /> -->
      </div>
      <StudentRegForm
        class="stud-form"
        @editing="error = null"
        @commit="registerStudent"
        :student="studentInUse"
        :error="error"
      />
    </div>
  </div>
</template>

<script>
import LicenseItem from "./LicenseItem.vue";
import StudentRegForm from "./StudentRegForm.vue";
import StudentItem from "./StudentItem.vue";
// import api from "@/service/api";
import { ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  props: ["license", "licenses", "students"],
  components: {
    LicenseItem,
    StudentItem,
    // DatePicker,
    // TextField,
    StudentRegForm,
  },
  setup(props) {
    const store = useStore();
    const active = ref(props.license || props.licenses[0]);
    const studentInUse = ref(null);
    const error = ref(null);
    const assignables = ref(null);
    const current = ref(new Date().getTime());

    const studentReg = ref({
      name: "",
      id: "",
      password: "",
      birthday: "",
      visible: false,
    });

    const updateUse = () => {
      const license = active.value;
      if (!license) {
        return;
      }
      const idx = props.students.findIndex(
        (s) => license && license.studentRef === s.seq
      );
      studentReg.value.visible = false;
      studentInUse.value = props.students[idx];
      assignables.value = props.students.filter(
        (s) =>
          s !== studentInUse.value &&
          !props.licenses.find((lcs) => lcs.studentRef === s.seq)
      );
    };
    watch(() => active.value, updateUse, { immediate: true });

    const bindStudent = (student) => {
      if (!active.value) {
        return;
      }
      store
        .dispatch("user/bindStudent", { license: active.value, student })
        .then((res) => {
          active.value.studentRef = res.curStud;
          updateUse();
        });
    };
    const registerStudent = (student) => {
      const { name, userId, birth, pass, editing } = student; // studentReg.value;
      console.log(name, userId, birth, pass, editing);
      const method = editing ? "user/updateStudent" : "user/createStudent";
      const args = editing
        ? { student, props: { name, userId, birth, pass } }
        : { name, userId, birth, pass, license: active.value };
      store
        .dispatch(method, args)
        .then(() => updateUse())
        .catch((e) => {
          console.log("[error]", e);
          error.value = e.cause;
        });
    };

    const openStudenEditor = () => {
      console.log("done");
    };
    return {
      current,
      active,
      error,
      studentInUse,
      assignables,
      studentReg,
      bindStudent,
      registerStudent,
      openStudenEditor,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.lcs-config-view {
  display: flex;
  align-items: flex-start;
  .lcs-view {
    flex: 0 0 160px;
    border-right: 1px solid #ccc;
    padding: 16px;
  }
  @include mobile {
    .lcs-view {
      flex-basis: auto;
    }
  }
  .stud-view {
    flex: 1 1 auto;
    padding: 16px;

    .stud-list {
      display: flex;
      // align-items: center;
      // row-gap: 4px;
      // column-gap: 4px;
      // flex-wrap: wrap;
      margin: 0.6rem 0;
    }
    .stud-form {
      max-width: 400px;
      display: flex;
      row-gap: 8px;
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
