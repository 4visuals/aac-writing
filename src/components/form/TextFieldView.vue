<template>
  <div :class="`text-form ${formModel.status || ''}`">
    <slot v-if="formModel.title" name="title"
      ><h3>
        {{ formModel.title }}
      </h3></slot
    >

    <div class="desc mg8" v-if="formModel.desc">
      {{ formModel.desc }}
    </div>
    <div class="body mg8">
      <input
        :class="{ pending: editing || valueVisible, error: formModel.error }"
        :type="valueVisible ? 'text' : formModel.type || 'text'"
        :placeholder="formModel.placeholder || ''"
        ref="inputEl"
        :disabled="readOnly"
        @input="valueTyped"
        @blur="rollback"
      />
      <span v-if="editing" class="editing icon material-icons-outlined"
        >refresh</span
      ><span
        v-else-if="formModel.type === 'password'"
        class="view icon material-icons-outlined"
        :class="{ active: valueVisible }"
        @click="toggleVisible"
        >visibility</span
      >
    </div>
    <div class="error mg8" v-if="formModel.error">
      {{ formModel.getErrorMessage() }}
    </div>
  </div>
</template>

<script>
import { nextTick, onMounted, ref, watch } from "vue";

export default {
  props: {
    formModel: { type: Object },
    readOnly: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const debounceTime = 1000;
    const inputEl = ref(null);
    const valueVisible = ref(false);
    let timer = null;
    const editing = ref(false);
    const fireEvent = (inputForm, value) => {
      editing.value = true;
      emit("value", {
        inputForm,
        value,
        commit: (v) => commit(inputForm, v),
      });
    };
    const valueTyped = (e) => {
      const { formModel } = props;
      let { value } = e.target;
      if (formModel.filter) {
        value = formModel.filter(value);
      }
      inputEl.value.value = value;
      clearTimeout(timer);
      formModel.reset();
      timer = setTimeout(fireEvent, debounceTime, formModel, value);
    };
    const setFocus = () => {
      nextTick().then(() => {
        inputEl.value.focus();
      });
    };
    const commit = (formModel, value) => {
      if (value) {
        inputEl.value.value = value;
        formModel.value = value;
      }
      editing.value = false;
    };
    const toggleVisible = () => {
      valueVisible.value = !valueVisible.value;
    };
    const rollback = () => {
      const { formModel: form } = props;
      if (form.error) {
        form.reset();
        inputEl.value.value = form.value;
      }
    };
    watch(
      () => props.formModel.value,
      (value) => {
        inputEl.value.value = value;
      }
    );
    watch(
      () => props.formModel.status,
      (cur) => {
        if (cur === "active") {
          setFocus();
        }
      }
    );
    onMounted(() => {
      if (inputEl.value) {
        inputEl.value.value = props.formModel.value;
        setFocus();
      }
    });
    return {
      inputEl,
      editing,
      valueVisible,
      valueTyped,
      toggleVisible,
      rollback,
    };
  },
};
</script>

<style lang="scss" scoped>
.text-form {
  .mg8 {
    margin-bottom: 8px;
  }
  h3 {
    font-size: 1.25rem;
  }
  input {
    padding: 6px 12px;
    border: 1px solid transparent;
    background-color: #ddf8ff;
    border-radius: 8px;
    letter-spacing: 2px;
    font-size: 1.5rem;
    width: 100%;
    outline: none;
    color: #5ba2ff;
    &:focus {
      border-color: #5ba2ff;
      color: #105bbc;
    }
    &.pending {
      padding-right: 36px;
    }
    &.error {
      color: #d5330d;
      background-color: #ffcdb9;
      &:focus {
        border-color: #d5330d;
      }
    }
    &:disabled {
      color: #999;
      background-color: #e4e8ea;
      cursor: not-allowed;
    }
  }
  .body {
    display: flex;
    align-items: center;
    position: relative;
    > .icon {
      user-select: none;
      font-size: 16px;
      position: absolute;
      padding: 4px;
      top: 50%;
      right: 8px;
      transform: translate(0%, -50%);
      color: #4b92ee;
      &.editing {
        animation: ani-rotate 2s linear infinite;
      }
      &.view {
        cursor: pointer;
      }
      &.active {
        background-color: #719dd7;
        color: #144483;
        border-radius: 4px;
      }
    }
  }
  .error {
    color: #d5330d;
  }
  .ctrl {
    text-align: right;
  }
  a.no-style {
    margin: 0 8px;
  }
  button {
    display: inline-flex;
    align-items: center;
    .icon {
      font-size: 18px;
    }
    &:hover {
      background-color: #105bbc;
      color: white;
    }
    &.sm {
      font-size: 12px;
      .icon {
        font-size: 18px;
      }
    }
    .text {
      padding: 0;
    }
  }
  &.pending {
    h3 {
      font-weight: 400;
      font-size: 1rem;
    }
  }
}
@keyframes ani-rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
