<template>
  <div class="form-elem" :class="{ inline }">
    <button
      type="button"
      :class="`${themeValue()} ${size} ${
        disabled === '' || disabled === true ? 'disabled' : ''
      }${fill === '' ? 'filled' : ' '} ${rect === '' ? 'no-rounded' : ''} ${
        borderless === '' ? 'borderless' : ''
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
  props: [
    "text",
    "inline",
    "theme",
    "size",
    "disabled",
    "fill",
    "rect",
    "borderless",
    "muted",
  ],
  setup(props, { emit }) {
    // console.log(props);
    const clicked = () => {
      if (props.disabled === "" || props.disabled === true) {
        return;
      }
      if (props.muted !== "") {
        const audio = new Audio(clickSound);
        audio.play();
      }
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
  display: flex;
  &.inline {
    flex: 0 0 auto;
  }
  button {
    background-color: transparent;
    border: none;
    border-radius: 4rem;
    color: inherit;
    outline: 0;
    &.no-rounded {
      border-radius: 0;
    }
    &.borderless {
      border-width: 0 !important;
    }

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
    &.gold {
      @include gold($shadow: true);
    }
    &:active {
      transform: translate(3px, 3px);
    }
    &.filled {
      width: 100%;
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
      font-size: 1.1rem;
      padding: 6px 0.8rem;
      &.sm {
        font-size: 0.85rem;
      }
    }
  }
  @include tablet {
    button {
      font-size: 1.35rem;
      padding: 8px 1rem;
      &.xs {
        font-size: 1rem;
        padding: 0.35rem 0.7rem;
      }
      &.sm {
        font-size: 1.25rem;
      }
    }
  }
  @include desktop {
    button {
      font-size: 1.35rem;
      padding: 8px 0.8rem;
      &.sm {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
