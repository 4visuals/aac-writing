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
  .license {
    margin: 4px 0;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    .remaining {
      display: flex;
      align-items: center;
      user-select: none;
    }
    .ticket {
      font-size: 16px;
      padding: 4px 8px;
    }
    .progress-bar {
      height: 3px;
      margin: 2px 8px 2px 32px;
      border-radius: 2px;
      .bar {
        height: 3px;
        width: 100%;
        border-radius: 2px;
      }
    }
    .assigned {
      text-align: right;
      padding: 4px 8px;
      user-select: none;
    }
    &.normal {
      background-color: #dbf6fd;
      color: #096c86;
      .progress-bar {
        background-color: #b2d3dd;
        .bar {
          background-color: #096c86;
        }
      }
    }
  }
}
</style>
