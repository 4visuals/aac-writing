<template>
  <div class="form-elem" :class="{ inline: inline === '' }">
    <button
      type="button"
      :class="`${themeValue()} ${size} ${outlined ? 'outlined' : ''}`"
      @click="play"
    >
      {{ text }}
    </button>
  </div>
</template>

<script>
import clickSound from "@/assets/click.wav";
export default {
  props: ["text", "inline", "theme", "size", "outlined"],
  setup(props) {
    console.log(props);
    const play = () => {
      const audio = new Audio(clickSound);
      audio.play();
    };
    const themeValue = () => props.theme || "gray";

    return { play, themeValue };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/theme";
.form-elem {
  &.inline {
    flex: 0 0 auto;
  }
  button {
    font-size: inherit;
    background-color: transparent;
    border: none;
    user-select: none;

    &.pink {
      @include pink($shadow: false);
      &.outlined {
        @include pink($shadow: true);
      }
    }
    &.orange {
      @include orange($shadow: false);
      &.outlined {
        @include orange($shadow: true);
      }
    }
    &.blue {
      @include blue($shadow: false);
      &.outlined {
        @include blue($shadow: true);
      }
    }
    &.red {
      @include red($shadow: false);
      &.outlined {
        @include red($shadow: true);
      }
    }
    &:active {
      transform: translate(2px, 2px);
    }
    &.sm {
      font-size: 1rem;
      padding: 0.6rem 1.2rem;
    }
    &.md {
      font-size: 1.25rem;
      padding: 0.6rem 1.2rem;
    }
  }
}
</style>
