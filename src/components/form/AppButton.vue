<template>
  <div
    class="app-btn"
    :class="[size, fluid ? 'fluid' : '']"
    :style="`--border-width: ${borderWidth}; --border-color: ${borderColor}; --bg-color: ${backgroundColor}`"
  >
    <button
      type="button"
      class="nude"
      :class="{
        invert,
        disabled,
        transparent,
        fill,
        rect,
        word: theme === 'word',
        sen: theme === 'sentence',
        blue: theme === 'blue',
        yellow: theme === 'yellow',
        purple: theme === 'purple',
        brown: theme === 'brown',
        red: theme === 'red',
        green: theme === 'green',
        dark: theme === 'dark',
        indigo: theme === 'indigo',
        'mono-blue': theme === 'mono-blue',
      }"
      @click.stop="clicked"
    >
      <span
        class="inner"
        :class="{
          nowrap,
          sm: size === 'sm',
          md: size === 'md',
          lg: size === 'lg',
        }"
        >{{ text }}</span
      >
    </button>
  </div>
</template>

<script>
export default {
  emits: ["click"],
  props: {
    text: {
      type: String,
      default: "BUTTON",
    },
    theme: {
      type: String,
      default: "blue",
    },
    fill: { type: Boolean, default: false },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "md",
      validator(val) {
        return ["sm", "md", "nav", "chapter", "plain", "setting"].includes(val);
      },
    },
    fluid: {
      type: Boolean,
      default: false,
    },
    rect: {
      type: Boolean,
      default: false,
    },
    /**
     * 배경색과 선색을 교환함
     */
    invert: {
      type: Boolean,
      default: false,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    borderWidth: {
      type: String,
      default: "2px",
    },
    borderColor: {
      type: String,
      default: "",
    },
    backgroundColor: {
      type: String,
      default: "",
    },
    textColor: {
      type: String,
      default: "",
    },
    nowrap: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    // console.log(props);
    const clicked = () => {
      if (props.disabled) {
        return;
      }
      emit("click");
    };
    const themeValue = () => props.theme;

    return { clicked, themeValue };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
@import "~@/assets/theme";
.app-btn {
  display: inline-flex;
  flex: 0 0 auto;
  span {
    font-weight: 600;
    letter-spacing: 0.15px;
    &.nowrap {
      white-space: nowrap;
    }
  }
  &.nav {
    width: 128px;
    button {
      height: 38px;
    }
  }
  &.fluid {
    display: flex;
    width: 100% !important;
  }
  &.setting,
  &.chapter {
    width: 118px;
    button {
      height: 34px;
      span.inner {
        font-size: 14px;
      }
    }
    @include mobile {
      width: 90px;
      button {
        span.inner {
          font-weight: 400;
          font-size: 12px;
        }
      }
    }
  }
  &.plain {
    button {
      padding: 8px 16px;
    }
  }
  &.section {
    width: 100%;
  }
  &.md {
    width: 150px;
  }
  &.sm {
    button {
      span {
        padding: 6px 16px;
      }
    }
  }
  &.student-login {
    button {
      height: 48px;
    }
  }
  button {
    background-color: var(--bg-color, white);
    border-radius: 4rem;
    border-width: var(--border-width);
    border-color: var(--border-color);
    color: inherit;
    outline: 0;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    &.rect {
      border-radius: 0;
    }

    &.no-rounded {
      border-radius: 0;
    }
    &.borderless {
      border-width: 0 !important;
    }

    &.transparent {
      background-color: transparent !important;
    }

    &.blue,
    &.word {
      border-color: var(--border-color, #4b7bec);
      color: #4b7bec;
      &.fill {
        background-color: #4b7bec;
        color: white;
      }
      &.invert {
        color: white;
        background-color: #4b7bec;
      }
    }
    &.mono-blue {
      border-color: var(--border-color, #2ab6c0);
      color: #2ab6c0;
      &.fill {
        background-color: #2ab6c0;
        color: white;
      }
      &.invert {
        background-color: #2ab6c0;
        color: white;
      }
    }
    &.sen {
      border-color: var(--border-color, #21c2cc);
      color: #21c2cc;
      &.fill {
        background-color: #21c2cc;
        color: white;
      }
      &.invert {
        color: white;
        background-color: #21c2cc;
      }
    }
    &.yellow {
      color: var(--text-color, #ffd110);
      &.fill {
        background-color: #ffd110;
        color: #865900;
      }
      &.invert {
        color: white;
        background-color: #ffd110;
      }
    }
    &.indigo {
      color: var(--text-color, #2356a0);
      &.fill {
        background-color: #2356a0;
        color: white;
      }
      &.invert {
        color: white;
        background-color: #2356a0;
      }
    }
    &.brown {
      color: #865900;
      &.fill {
        background-color: #865900;
        color: white;
      }
      &.invert {
        color: white;
        background-color: #865900;
      }
    }
    &.red {
      color: #d03c19;
      &.fill {
        background-color: #d03c19;
        color: white;
      }
      &.invert {
        color: white;
        background-color: #d03c19;
      }
    }
    &.green {
      color: #1db270;
      &:active {
        background-color: #fff;
      }
      &.fill {
        background-color: #fff;
        &.invert {
          color: white;
          background-color: #1db270;
        }
      }
    }
    &.purple {
      color: #7b4799;
      &.fill {
        background-color: #7b4799;
        color: white;
      }
      &.invert {
        color: white;
        background-color: #7b4799;
      }
    }
    &.dark {
      color: #32393d;
      &.fill {
        background-color: #32393d;
        border-color: #32393d;
        color: white;
      }
      &.invert {
        color: white;
        background-color: #32393d;
      }
    }
    &:active {
      transform: translate(1px, 1px);
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
    .inner {
      font-size: 16px;
      line-height: 24px;
      &.sm {
        font-size: 14px;
      }
      &.lg {
        font-size: 18px;
      }
    }
  }
  @include tablet {
    .inner {
      font-size: 18px;
      line-height: 24px;
      &.sm {
        font-size: 14px;
      }
      &.lg {
        font-size: 18px;
      }
    }
  }
  @include desktop {
    .inner {
      font-size: 18px;
      line-height: 24px;
      &.sm {
        font-size: 14px;
      }
      &.lg {
        font-size: 18px;
      }
    }
  }
}
</style>
