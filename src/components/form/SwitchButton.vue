<template>
  <div
    class="switch-button"
    :class="[
      selected ? 'on' : 'off',
      disabled === true || disabled === '' ? 'disabled' : '',
      theme || 'word',
      shadow ? 'shadow' : '',
    ]"
  >
    <label
      ><input type="checkbox" :checked="selected" @change="changed" />
      <div class="slider"></div
    ></label>
    <SpanText size="sm" class="label on">{{ onText }}</SpanText>
    <SpanText size="sm" class="label off">{{ offText }}</SpanText>
  </div>
</template>

<script>
import { SpanText } from "@/components/text";
export default {
  props: ["selected", "onText", "offText", "disabled", "theme", "shadow"],
  emits: ["update:selected"],
  components: {
    SpanText,
  },
  setup(props, { emit }) {
    const changed = (e) => {
      if (props.disabled === "" || props.disabled === true) {
        return;
      }
      emit("update:selected", e.target.checked);
    };
    return {
      changed,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/theme";
@import "~@/assets/resizer";
.switch-button {
  background: rgba(255, 255, 255);
  border-radius: 30px;
  overflow: hidden;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  &.shadow {
    box-shadow: 0 0 8px #0000004d, 0 0 4px #0000002d;
  }
  &.pink {
    @include pink($shadow: false);
  }
  &.orange {
    @include orange($shadow: false);
  }
  &.blue {
    @include blue($shadow: false);
  }
  &.disabled {
    // color: #ababab;
    label {
      cursor: not-allowed;
    }
    filter: grayscale(0.8);
  }
  .label {
    flex: 1 1 auto;
    position: relative;
    pointer-events: none;
    padding: 8px 24px;
    line-height: 24px;
    white-space: nowrap;
    font-weight: 600;
  }
  label {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    input {
      opacity: 0;
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 50%;

      border-radius: 30px;
      transition: transform 0.15s cubic-bezier(0.22, 0.61, 0.36, 1);
    }
  }
  &.word {
    label::before {
      background-color: #45aaf2;
    }
    &.on {
      .label.off {
        color: #4b7bec;
      }
    }
  }
  &.sentence {
    label::before {
      background-color: #21c2cc;
    }
    &.off {
      .label.on {
        color: #21c2cc;
      }
    }
  }
  &.on {
    label::before {
      transform: translateX(0);
    }
    .label.off {
      font-weight: 500;
    }
  }
  &.off {
    label::before {
      transform: translateX(100%);
    }
    .label.on {
      color: #4b7bec;
      font-weight: 500;
    }
  }
  @include mobile {
    .label {
      padding: 6px 12px;
    }
  }
}
</style>
