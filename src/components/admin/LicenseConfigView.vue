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
      <p v-else>등록된 학생이 없습니다.</p>
      <h5>학생들</h5>
      <div class="stud-list">
        <StudentItem
          v-for="s in assignables"
          :key="s.eq"
          :student="s"
          @clicked="bindStudent"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LicenseItem from "./LicenseItem.vue";
import StudentItem from "./StudentItem.vue";
import { computed, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  props: ["license"],
  components: {
    LicenseItem,
    StudentItem,
  },
  setup(props) {
    const store = useStore();
    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() => store.state.user.membership.licenses);
    const active = ref(props.license);
    const studentInUse = ref(null);
    const assignables = ref(null);
    const current = ref(new Date().getTime());

    const updateUse = () => {
      const license = active.value;
      if (!license) {
        return;
      }
      const idx = students.value.findIndex(
        (s) => license && license.studentRef === s.seq
      );
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
    return {
      current,
      active,
      studentInUse,
      licenses,
      assignables,
      bindStudent,
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
  }
}
</style>
