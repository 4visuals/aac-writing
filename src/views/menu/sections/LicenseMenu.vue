<template>
  <div class="license-menu">
    <p>총 {{ licenses.length }}장</p>
    <LicenseItem
      v-for="lcs in licenses"
      :key="lcs.seq"
      :lcs="lcs"
      :students="students"
      :current="current"
      @click="$emit('clicked', lcs)"
    />
  </div>
</template>

<script>
import { LicenseItem } from "@/components/admin";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  components: { LicenseItem },
  setup() {
    const store = useStore();
    const licenses = computed(() => store.state.user.membership.licenses);
    const students = computed(() => store.getters["user/students"]);
    const current = new Date().getTime();

    return { licenses, students, current };
  },
};
</script>

<style lang="scss" scoped>
.license-menu {
  flex: 1 1 auto;
  > p {
    text-align: right;
  }
}
</style>
