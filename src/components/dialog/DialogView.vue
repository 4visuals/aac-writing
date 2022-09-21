<template>
  <div class="dialog">
    <h3 v-if="title">{{ title }}</h3>
    <div class="body">
      <ParaText>{{ message }}</ParaText>
    </div>
    <div class="footer" v-if="actions">
      <AacButton
        v-for="(action, idx) in actions"
        :key="action.cmd"
        :inline="true"
        :text="action.text"
        :theme="themes[idx]"
        @click="$emit('commit', action.cmd)"
      />
    </div>
  </div>
</template>

<script>
import ParaText from "@/components/text/ParaText.vue";
import { AacButton } from "@/components/form";
export default {
  components: { AacButton, ParaText },
  props: ["title", "message", "actions"],
  setup() {
    const themes = ["blue", "red"];
    return { themes };
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
    padding: 16px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    column-gap: 16px;
    padding: 8px 16px;
  }
}
</style>
