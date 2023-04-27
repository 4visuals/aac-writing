<template>
  <div class="pavicon" :style="`background-image: url(${path})`"></div>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.pavicon {
  background-position: left center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
