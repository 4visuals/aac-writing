<template>
  <div class="lcs-config-view">
    <div class="lcs-view">
      <LicenseItem
        @click="active = lcs"
        v-for="lcs in licenses"
        :lcs="lcs"
        :current="current"
        :active="active === lcs"
        :key="lcs.seq"
      >
      </LicenseItem>
    </div>
    <div class="stud-view">
      <h5>등록된 학생</h5>
      <div class="stud-list" v-if="studentInUse">
        <StudentItem :student="studentInUse" />
      </div>
      <div v-else class="reg">
        <p>등록된 학생이 없습니다.</p>
        <h5>학생 등록</h5>
        <DatePicker
          :visible="studentReg.visible"
          @cur-date="setBirthday"
          @toggle="(visible) => (studentReg.visible = !visible)"
        />
        <TextField v-model:value="studentReg.name" placeholder="이름 입력" />
        <TextField
          v-model:value="studentReg.password"
          type="password"
          placeholder="비밀번호"
        />
        <AacButton
          size="xs"
          inline
          theme="blue"
          text="학생 등록"
          @click="registerStudent"
        ></AacButton>
      </div>

      <!-- <h5>학생들</h5>
      <div class="stud-list">
        <StudentItem
          v-for="s in assignables"
          :key="s.eq"
          :student="s"
          @clicked="bindStudent"
        />
      </div> -->
    </div>
  </div>
</template>

<script>
import LicenseItem from "./LicenseItem.vue";
import StudentItem from "./StudentItem.vue";
import DatePicker from "@/components/DatePicker.vue";
import { TextField } from "@/components/form";
// import api from "@/service/api";
import { computed, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  props: ["license"],
  components: {
    LicenseItem,
    StudentItem,
    DatePicker,
    TextField,
  },
  setup(props) {
    const store = useStore();
    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() => store.state.user.membership.licenses);
    const active = ref(props.license);
    const studentInUse = ref(null);
    const assignables = ref(null);
    const current = ref(new Date().getTime());

    const studentReg = ref({
      name: "",
      password: "",
      birthday: "",
      visible: false,
    });

    const updateUse = () => {
      const license = active.value;
      if (!license) {
        return;
      }
      const idx = students.value.findIndex(
        (s) => license && license.studentRef === s.seq
      );
      studentReg.value.visible = false;
      studentInUse.value = students.value[idx];
      assignables.value = students.value.filter(
        (s) =>
          s !== studentInUse.value &&
          !licenses.value.find((lcs) => lcs.studentRef === s.seq)
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
    const registerStudent = () => {
      const { name, birthday, password } = studentReg.value;
      console.log(name, birthday);
      store
        .dispatch("user/createStudent", {
          name,
          birthday,
          password,
          license: active.value,
        })
        .then(() => {
          updateUse();
        });
      // api.student
      //   .register(name, birthday, password, active.value.uuid)
      //   .then((res) => {
      //     console.log(res);
      //     store.dispatch("user/autoLogin");
      //     active.value.studentRef = res.lcs.curStud;
      //     updateUse();
      //   })
      //   .catch((err) => {
      //     alert("학생 추가 실패: " + err.cause);
      //   });
    };
    const setBirthday = (e) => {
      studentReg.value.birthday = `${e.year}-${e.month}-${e.date}`;
      if (e.changed === "month") {
        studentReg.value.visible = false;
      }
    };
    return {
      current,
      active,
      studentInUse,
      licenses,
      assignables,
      studentReg,
      bindStudent,
      setBirthday,
      registerStudent,
    };
  },
};
</script>

<style lang="scss" scoped>
.lcs-config-view {
  display: flex;
  align-items: flex-start;
  .lcs-view {
    flex: 0 0 160px;
    border-right: 1px solid #ccc;
    padding: 16px;
  }
  .stud-view {
    flex: 1 1 auto;
    padding: 16px;

    .stud-list {
      display: flex;
      align-items: center;
      row-gap: 4px;
      column-gap: 4px;
      flex-wrap: wrap;
      margin: 0.6rem 0;
    }
    .reg {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
