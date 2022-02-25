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
      background-color: var(--aac-color-pink-900);
      color: white;
      box-shadow: 4px 4px var(--aac-color-pink-700);
      &:active {
        background-color: var(--aac-color-pink-700);
      }
    }
    &.blue {
      background-color: var(--aac-color-blue-900);
      color: white;
      box-shadow: 4px 4px var(--aac-color-blue-700);
      &:active {
        background-color: var(--aac-color-blue-700);
      }
    }
    &:active {
      transform: translate(3px, 3px);
    }
  }

  @include mobile {
    button {
      font-size: 1rem;
    }
  }
  @include tablet {
    button {
      font-size: 3rem;
    }
  }
  @include desktop {
    button {
      font-size: 4rem;
    }
  }
}
</style>
