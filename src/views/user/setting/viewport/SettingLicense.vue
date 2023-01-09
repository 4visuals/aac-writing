<template>
  <div>수강증 관리</div>
  <LicenseItemUI
    v-for="lcs in licenses"
    :key="lcs.uuid"
    :license="lcs"
    :current="now"
    :student="bindStudent(lcs)"
  />
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import LicenseItemUI from "../ui/LicenseItemUI.vue";
export default {
  components: {
    LicenseItemUI,
  },
  setup() {
    const store = useStore();
    const licenses = computed(() => store.state.user.membership.licenses);
    const students = computed(() => store.getters["user/students"]);
    const now = ref(new Date());
    const bindStudent = (lcs) => {
      return students.value.find((stud) => stud.seq === lcs.studentRef);
    };
    return { now, licenses, bindStudent };
  },
};
</script>

<style lang="scss" scoped></style>
