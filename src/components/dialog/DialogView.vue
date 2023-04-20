<template>
  <div class="dialog">
    <h3 v-if="title">{{ title }}</h3>
    <div class="body" :class="[align || '']">
      <ParaText v-for="(para, index) in paras" :key="index">{{
        para
      }}</ParaText>
    </div>
    <div class="footer" :class="[align || '']" v-if="actions">
      <AppButton
        v-for="(action, idx) in actions"
        :key="action.cmd"
        :inline="true"
        :text="action.text"
        :fill="true"
        :theme="themes[idx]"
        size="plain"
        @click="doAction(action)"
        class="btn"
      />
    </div>
  </div>
</template>

<script>
import ParaText from "@/components/text/ParaText.vue";
// import { AacButton } from "@/components/form";
import { AppButton } from "../form";
export default {
  components: { ParaText, AppButton },
  props: ["title", "message", "actions", "align"],
  setup(props, { emit }) {
    const themes = ["blue", "red"];

    const paras = (props.message || "").split("\n");
    const doAction = (action) => {
      const { cmd, trigger } = action;
      if (cmd) {
        emit("commit", cmd);
      }
      if (trigger && typeof trigger === "function") {
        action.trigger();
      }
    };
    return { themes, doAction, paras };
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  display: flex;
  flex-direction: column;
  h3 {
    padding: 16px;
  }
  .body {
    padding: 24px 16px;
    &.center {
      text-align: center;
    }
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    column-gap: 16px;
    padding: 8px 16px;
    &.center {
      > .btn {
        flex: 1 1 50%;
      }
    }
  }
}
</style>
