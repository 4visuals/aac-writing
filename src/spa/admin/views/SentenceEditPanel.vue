<template>
  <section>
    <input type="text" v-model="txt" /><button class="nude" @click="analyize">
      PREVIEW
    </button>
  </section>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import adminApi from "../service/admin-api";
const props = defineProps(["sentence"]);
const emits = defineEmits(["analysis"]);
const txt = ref(props.sentence.sentence);
const analyize = () => {
  console.log(txt.value);
  const { value } = txt;
  adminApi.level.analyze(value).then((res) => {
    emits("analysis", { sentence: props.sentence, value, dfMap: res });
  });
};
watch(
  () => props.sentence,
  (sen) => {
    console.log("[see]", sen);
    txt.value = sen.sentence;
  }
);
</script>

<style lang="scss" scoped>
section {
  display: flex;
  input {
    padding: 4px;
    font-size: 16px;
    flex: 0 0 400px;
    width: 600px;
  }
}
</style>
