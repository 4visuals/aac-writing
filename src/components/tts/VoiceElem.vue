<template>
  <div class="voice">
    <Flag :lang="voice.lang" width="40px" />
    <dl class="voice-spec">
      <dt>{{ voice.voiceURI }}</dt>
      <dd>{{ voice.name }}</dd>
    </dl>
  </div>
</template>

<script>
import Flag from "@/components/Flag.vue";
export default {
  components: {
    Flag,
  },
  props: ["voice"],
};
</script>

<style lang="scss" scoped>
.voice {
  display: flex;
  align-items: center;
  dl,
  dd {
    margin: 0;
  }
  dl {
    overflow-x: hidden;
  }
}
</style>
