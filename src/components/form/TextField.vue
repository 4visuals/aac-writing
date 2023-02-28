<template>
  <div
    class="form-elem"
    :class="{
      size: size,
      'error-state': field && field.error,
      'success-state': field && field.success,
    }"
    :style="style"
  >
    <span class="left icon material-icons-outlined" v-if="icon">{{
      icon
    }}</span>
    <input
      :class="{
        'left-icon': icon,
        'right-icon':
          pendingVisible && (field._changed || field.success || field.error),
      }"
      :type="typeRef || 'text'"
      :value="value"
      :placeholder="placeholder"
      :disabled="true"
      @input="debounce"
      @keydown.enter.stop="onEnterDown"
      @keyup.enter="onEnterUp"
      @focus="onFocus"
      @blur="onBlur"
    />
    <span
      v-if="pendingVisible && field && field._changed"
      class="right rotate icon material-icons-outlined"
      >loop</span
    >
    <span
      v-if="field && field.error"
      class="right icon material-icons-outlined"
      :class="{ on: previewRef }"
      @click="togglePreview"
      >warning</span
    >
    <span
      v-if="field && field.success"
      class="right icon material-icons-outlined"
      :class="{ on: previewRef }"
      @click="togglePreview"
      >{{ type === "password" ? "visibility" : "done_all" }}</span
    >
  </div>
</template>

<script>
import { computed, ref } from "vue";

const DEFAULT_OPTION = {
  updated: "blur",
  delay: 1750,
  pendingVisible: true,
  disabled: false,
};
class FieldModel {
  constructor(fieldName, value, option) {
    this.name = fieldName;
    this.value = value || "";
    this.option = option || Object.assign({}, DEFAULT_OPTION);
    this.focus = false;
    this.error = null;
    this.success = null;
    this.validator = null;
    this.disabled = option.disabled || false;
    const current = new Date().getTime();
    this.time = {
      confirmed: current,
      updated: current,
    };
    this._changed = false;
  }
  setError(e) {
    this.error = e;
    this._changed = false;
    this.success = null;
  }
  markAsActive() {
    this.focus = true;
  }
  markAsBlur() {
    this.focus = false;
  }
  markAsUpdated() {
    this.time.updated = new Date().getTime();
    this._changed = true;
  }
  isChanged() {
    const { confirmed, updated } = this.time;
    return confirmed !== updated;
  }
  markAsValidated() {
    this.time.confirmed = this.time.updated;
    this._changed = false;
    this.error = null;
    this.success = true;
  }
  setValue(value) {
    this.value = value;
    this.markAsUpdated();
    this.error = null;
    this.success = null;
  }
  isValid() {
    return this.success;
  }
  reset() {
    this.value = "";
    this.focus = false;
    this.error = null;
    this.success = null;
  }
}

export default {
  props: {
    type: String,
    icon: String,
    value: { type: String, default: "" },
    style: Object,
    trim: Boolean,
    placeholder: String,
    size: String,
    field: { type: FieldModel, default: null },
  },
  emits: ["enter", "update:value", "focus", "updated"],
  setup(props, { emit }) {
    const pendingVisible = computed(
      () => props.field && props.field.option.pendingVisible
    );
    const typeRef = ref(props.type);
    const previewRef = ref(false);
    /**
     * enterDetected
     * 맥OS 크롬에서'만' 한글입력 중 enter를 누르면 아래와 같이 이벤트가 네 번 발생함
     *
     * 1) keydown: {isComposing: true } + keyup: {isComposing: false}
     * 2) keydown: {isComposing: false} + keyup: {isComposing: false}
     *
     * 한글 입력 상태를 유지하며 isComposing상태를 유지하는 이벤트(down, up)가 빌생한 후,
     * 입력 상태를 해제한 후 다시 이벤트가 발생함
     *
     * keyup 에서 enter를 처리하면 두 번 @enter이벤트를 emit 하게된다.
     * 바로 직전의 keydown이 composing상태였으면 뒤에 이어지는 keyup을 무시함
     *
     */
    let enterDetected = false;
    const onEnterDown = (e) => {
      // 뒤에 이어질 keyup에서 composing 상태를 바라봐야 함
      enterDetected = e.isComposing;
    };
    const onEnterUp = (e) => {
      try {
        // 한글 입력 상태라면(enterDetected) 무시함
        // 한글 입력 상태가 해제된 후 이어지는 keydown+keyup에서 처리함
        if (!enterDetected) {
          const value = getValue(e);
          emit("enter", value);
        }
      } finally {
        enterDetected = false;
      }
    };

    const getValue = (e) => {
      let { value } = e.target;
      return value && props.trim ? value.trim() : value;
    };

    let timer = 0;
    const debounce = (e) => {
      clearTimeout(timer);
      const { field } = props;
      if (field) {
        if (field.option.updated === "input") {
          const delay = field.option.delay || 500;
          timer = setTimeout(() => {
            changed(e);
            onBlur(e);
          }, delay);
        }
      } else {
        changed(e);
      }
    };
    const changed = (e) => {
      const value = getValue(e);
      emit("update:value", value);
      const { field } = props;
      if (field) {
        field.setValue(value);
      }
    };

    const onFocus = (e) => {
      const { field } = props;
      if (field) {
        field.markAsActive();
      }
      emit("focus", { value: getValue(e), field });
    };
    const onBlur = (e) => {
      const value = getValue(e);
      const { field } = props;
      if (field) {
        field.value = value;
        field.markAsBlur();
      }
      emit("updated", { value, field });
    };
    const hideValue = () => {
      typeRef.value = props.type;
      previewRef.value = false;
    };
    const togglePreview = () => {
      if (props.type === "password") {
        if (previewRef.value) {
          hideValue();
        } else {
          typeRef.value = "text";
          previewRef.value = true;
        }
      }
    };
    return {
      pendingVisible,
      typeRef,
      previewRef,
      changed,
      debounce,
      onEnterDown,
      onEnterUp,
      onFocus,
      onBlur,
      togglePreview,
    };
  },
  toModel: (fieldName, initialValue, option) =>
    new FieldModel(fieldName, initialValue, option),
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.form-elem {
  position: relative;
  display: flex;
  font-size: 1.35rem;
  input {
    font-size: inherit;
    width: 100%;
    height: 100%;
    border: 0;
    outline: 0;
    background-color: #f2f2f2;
  }
  .icon {
    position: absolute;
    color: #acacac;
    top: 50%;
    font-size: 20px;

    transform: translateY(-50%);
    user-select: none;
    &.left {
      left: 10px;
    }
    &.right {
      width: 32px;
      height: 32px;
      right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.rotate {
      animation: ccw 3s linear infinite;
    }
  }
  .preview {
    position: absolute;
    right: 48px;
    top: 0;
    bottom: 0;
    padding: 0 8px;
  }
  &.error-state {
    input {
      background-color: rgb(255, 218, 195);
      color: rgb(81, 8, 23);
    }
    .icon {
      color: rgb(81, 8, 23);
      &.right.on {
        background-color: #e7a16e;
      }
    }
  }
  &.success-state {
    input {
      background-color: #f2ffd0;
      color: #104c01;
    }
    .icon {
      color: #104c01;
      &.right.on {
        background-color: #b1d25c;
      }
    }
  }

  @include mobile {
    input {
      padding: 12px;
      font-size: 1.35rem;
      &.left-icon {
        padding-left: 36px;
      }
      &.right-icon {
        padding-right: 36px;
      }
    }
    .icon {
      font-size: 20px;
    }
  }
  @include tablet {
    input {
      padding: 15px;
      font-size: 1.35rem;
      &.left-icon {
        padding-left: 40px;
      }
      &.right-icon {
        padding-right: 40px;
      }
    }
    &.sm {
      input {
        padding: 12px;
        font-size: 1.2rem;
        &.left-icon {
          padding-left: 36px;
        }
        &.right-icon {
          padding-right: 36px;
        }
      }
      .icon {
        font-size: 20px;
      }
    }
  }
  @include desktop {
    input {
      padding: 15px;
      font-size: 1.35rem;
      &.left-icon {
        padding-left: 40px;
      }
      &.left-icon {
        padding-right: 40px;
      }
    }
  }
}
@keyframes ccw {
  0% {
    transform: translateY(-50%) rotate(0deg);
  }
  50% {
    transform: translateY(-50%) rotate(-180deg);
  }
  100% {
    transform: translateY(-50%) rotate(-360deg);
  }
}
</style>
