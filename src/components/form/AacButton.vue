<template>
  <div
    class="form-elem"
    :class="{ inline }"
    @click="() => console.log('[STOP]')"
  >
    <button
      type="button"
      :class="`${themeValue()} ${size} ${
        disabled === '' || disabled === true ? 'disabled' : ''
      }`"
      @click.stop="clicked"
    >
      {{ text }}
    </button>
  </div>
</template>

<script>
import clickSound from "@/assets/click.wav";
export default {
  props: ["text", "inline", "theme", "size", "disabled"],
  setup(props, { emit }) {
    // console.log(props);
    const clicked = () => {
      if (props.disabled === "" || props.disabled === true) {
        return;
      }
      const audio = new Audio(clickSound);
      audio.play();
      emit("click");
    };
    const themeValue = () => props.theme || "gray";

    return { clicked, themeValue };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
@import "~@/assets/theme";
.form-elem {
  &.inline {
    flex: 0 0 auto;
  }
  button {
    font-size: inherit;
    background-color: transparent;
    border: none;
    border-radius: 4rem;

    &.pink {
      @include pink($shadow: true);
    }
    &.orange {
      @include orange($shadow: true);
    }
    &.blue {
      @include blue($shadow: true);
    }
    &.red {
      @include red($shadow: true);
    }
    &:active {
      transform: translate(3px, 3px);
    }
    &.disabled {
      background-color: #d9d9d966;
      color: #a3a3a3bd;
      border-color: #a3a3a3bd;
      &:hover {
        cursor: not-allowed;
      }
      &:active {
        background-color: #d9d9d966;
        transform: translate(0, 0);
        cursor: not-allowed;
      }
    }
  }

  @include mobile {
    button {
      font-size: 3.2vmin;
      padding: 0.6rem 1.2rem;
      &.sm {
        font-size: 2.4vmin;
      }
    }
  }
  @include tablet {
    button {
      font-size: 2.6vmin;
      padding: 0.6rem 1.2rem;
      &.sm {
        font-size: 2.4vmin;
      }
    }
  }
  @include desktop {
    button {
      font-size: 2.6vmin;
      padding: 0.6rem 1.2rem;
      &.sm {
        font-size: 2.4vmin;
      }
    }
  }
}
</style>
