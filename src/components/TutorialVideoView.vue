<template>
  <div ref="divRef" class="wrapper">
    <iframe
      width="100%"
      :height="height"
      :src="`https://www.youtube.com/embed/` + videoUrl"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";

export default {
  props: {
    videoUrl: {
      type: String,
      required: true,
    },
  },
  setup() {
    const divRef = ref(undefined);
    const ratio = 0.5625; // 너비에 곱해서 높이를 구함
    const height = ref(ratio * 960);
    let observer;
    onMounted(() => {
      observer = new ResizeObserver(() => {
        const h = divRef.value.offsetWidth * ratio;
        console.log(h);
        height.value = h;
      });
      observer.observe(divRef.value);
    });
    onUnmounted(() => {
      observer.disconnect();
    });
    return { height, divRef };
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
}
</style>
