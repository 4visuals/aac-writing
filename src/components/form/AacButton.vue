<template>
  <div class="form-elem" :class="{ inline }">
    <button type="button" :class="theme || 'gray'" @click="play">
      {{ text }}
    </button>
  </div>
</template>

<script>
import clickSound from "@/assets/click.wav";
export default {
  props: ["text", "inline", "theme"],
  setup() {
    // console.log(props);
    const play = () => {
      const audio = new Audio(clickSound);
      audio.play();
    };
    return { play };
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
    padding: 1rem 2rem;
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
  }

  @include mobile {
    button {
      font-size: 3vmin;
    }
  }
  @include tablet {
    button {
      font-size: 3vmin;
    }
  }
  @include desktop {
    button {
      font-size: 3vmin;
    }
  }
}
</style>
