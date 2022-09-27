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

      <StudentRegForm
        class="stud-form"
        @editing="error = null"
        @commit="registerStudent"
        :student="studentInUse"
        :error="error"
        v-if="studentInUse"
      />
      <div v-else class="no-bound-stud">
        <p class="mg8px">수강증에 새로운 학생을 추가할 수 있습니다.</p>
        <div class="mg8px">
          <div class="license">
            <span class="icon material-icons-outlined"> sell </span
            ><span class="code">{{ active.uuid }}</span>
          </div>
        </div>
        <NewStudentForm v-if="newStudForm" @student="registerStudent" />
        <button v-else class="nude blue round" @click="showNewStudForm">
          학생 등록
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import LicenseItem from "./LicenseItem.vue";
import StudentRegForm from "./StudentRegForm.vue";
import NewStudentForm from "./NewStudentForm.vue";
import StudentItem from "./StudentItem.vue";
// import api from "@/service/api";
import { ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import toast from "../../components/toast";
export default {
  props: ["license", "licenses", "students"],
  components: {
    LicenseItem,
    StudentItem,
    NewStudentForm,
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
    const newStudForm = ref(false);

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
      newStudForm.value = false;
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
        .then(() => {
          updateUse();
          const msgCode = editing ? "@USER_EDIT_SUCCESS" : "@NEW_USER_SUCCESS";
          toast.success(msgCode, null, 5);
        })
        .catch((e) => {
          console.log("[error]", e);
          error.value = e.cause;
          toast.error(`@${e.cause}`, `실패`, 15);
        });
    };
    const openStudenEditor = () => {
      console.log("done");
    };
    const showNewStudForm = () => {
      newStudForm.value = true;
    };
    return {
      current,
      active,
      error,
      studentInUse,
      assignables,
      studentReg,
      newStudForm,
      bindStudent,
      registerStudent,
      openStudenEditor,
      showNewStudForm,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.lcs-config-view {
  display: flex;
  align-items: flex-start;
  flex: 1 1 auto;
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
    .license {
      display: inline-flex;
      align-items: center;
      column-gap: 6px;
      background-color: #ececec;
      padding: 8px;
      color: #444;
      border-radius: 4px;
      border: 1px solid #777;
      user-select: none;
      .icon {
        font-size: 14px;
      }
    }
  }
}
</style>
