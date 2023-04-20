<template>
  <div class="license-menu">
    <LicenseItem :lcs="activeLicense" :students="students" :current="current" />
    <ul>
      <li>
        <ParaText :small="true"
          >구매일: {{ activeLicense.toTimeText("createdAt") }}</ParaText
        >
      </li>
      <li>
        <ParaText :small="true"
          >민료일: {{ activeLicense.toTimeText("expiredAt") }}</ParaText
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { LicenseItem } from "@/components/admin";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { ParaText } from "@/components/text";
export default {
  components: { LicenseItem, ParaText },
  setup() {
    const store = useStore();
    const licenses = computed(() => store.state.user.membership.licenses);
    const students = computed(() => store.getters["user/students"]);
    const activeLicense = store.getters["exam/activeLicense"];

    const current = new Date().getTime();

    return { activeLicense, licenses, students, current };
  },
};
</script>

<style lang="scss" scoped>
.license-menu {
  flex: 1 1 auto;
  > p {
    text-align: right;
  }
  ul {
    list-style: none;
    padding-left: 12px;
    margin-top: 16px;
    li {
      margin-bottom: 4px;
    }
  }
}
</style>
