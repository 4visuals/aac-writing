<template>
  <div class="video">
    <video
      ref="videoEl"
      playsinline
      autoplay
      loop
      :muted="!soundOn"
      :src="videoUrl"
      @click="toggleSound"
    ></video>
    <div class="toggler">
      <AppIcon
        class="icon"
        :icon="soundOn ? 'volume_up' : 'volume_off'"
        fsize="36px"
        @click="toggleSound"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { defineProps } from "vue";
import AppIcon from "../../components/AppIcon.vue";

const props = defineProps({
  videoUrl: { type: String, required: true },
  pause: { type: Boolean, default: false },
});

const videoEl = ref(undefined);
const soundOn = ref(false);
const toggleSound = () => {
  const { value } = soundOn;
  soundOn.value = !value;
};
watch(props.pause, () => {
  console.log(props.pause);
});
</script>

<style lang="scss" scoped>
.video {
  justify-content: center;
  display: flex;
  width: 100%;
  margin: auto;
  position: relative;
  video {
    width: 100%;
    flex: 1 1 auto;
  }
  .toggler {
    position: absolute;
    left: 2px;
    bottom: 2px;
    z-index: 10;
    display: flex;
    .icon {
      cursor: pointer;
    }
  }
}
</style>
