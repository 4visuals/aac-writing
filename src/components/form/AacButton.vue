<template>
  <div class="form-elem" :class="{ inline }">
    <button type="button" :class="theme || 'gray'">{{ text }}</button>
  </div>
</template>

<script>
export default {
  props: ["text", "inline", "theme"],
  setup(props) {
    console.log(props);
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.form-elem {
  &.inline {
    flex: 0 0 auto;
  }
  button {
    font-size: inherit;
    background-color: transparent;
    border: none;
    border-radius: 4rem;
    padding: 1rem 2rem;
    &.pink {
      background-color: #ff53a9;
      color: white;
    }
    &.blue {
      background-color: #3d4afa;
      color: white;
    }
  }

  @include mobile {
    button {
      font-size: 1rem;
    }
  }
  @include tablet {
    button {
      font-size: 4rem;
    }
  }
  @include desktop {
    button {
      font-size: 4rem;
    }
  }
}
</style>
