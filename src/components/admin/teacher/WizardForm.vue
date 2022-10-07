<template>
  <div :class="`inputForm ${inputForm.status || ''}`">
    <h3 v-if="inputForm.title && inputForm.status !== 'confirmed'">
      {{ inputForm.title }}
    </h3>
    <div
      class="desc mg8"
      v-if="inputForm.status === 'active' && inputForm.desc"
    >
      {{ inputForm.desc }}
    </div>
    <div class="body mg8" v-if="inputForm.status === 'active'">
      <input
        :type="inputForm.type || 'text'"
        ref="inputEl"
        @input="valueTyped"
      />
    </div>
    <div class="body mg8" v-else-if="inputForm.status === 'confirmed'">
      <div class="value">{{ inputForm.value }}</div>
      <a href="#" class="no-style" @click.prevent="$emit('active', inputForm)"
        >편집</a
      >
    </div>
    <div class="error mg8" v-if="inputForm.error">{{ inputForm.error }}</div>
    <div class="ctrl" v-if="inputForm.status === 'active'">
      <button class="nude round blue" @click="commit">
        <span class="left icon material-icons-outlined">
          keyboard_arrow_down </span
        ><span class="text">다음</span>
      </button>
    </div>
  </div>
</template>

<script>
import { nextTick, onMounted, ref, watch } from "vue";

export default {
  props: ["inputForm"],
  setup(props, { emit }) {
    const inputEl = ref(null);
    const commit = () => {
      const { inputForm } = props;
      emit("commit", { inputForm });
    };
    const valueTyped = (e) => {
      const { inputForm } = props;
      let { value } = e.target;
      if (inputForm.filter) {
        value = inputForm.filter(value, inputForm);
      }
      inputEl.value.value = value;
      emit("value", {
        inputForm,
        value,
        setValue: (v) => setValue(inputForm, v),
      });
    };
    const setFocus = () => {
      nextTick().then(() => {
        inputEl.value.focus();
      });
    };
    const setValue = (inputForm, value) => {
      inputEl.value.value = value;
      inputForm.value = value;
    };
    watch(
      () => props.inputForm.value,
      (value) => {
        inputEl.value.value = value;
      }
    );
    watch(
      () => props.inputForm.status,
      (cur) => {
        if (cur === "active") {
          setFocus();
        }
      }
    );
    onMounted(() => {
      if (inputEl.value) {
        inputEl.value.value = props.inputForm.value;
        setFocus();
      }
    });
    return { inputEl, commit, valueTyped };
  },
};
</script>

<style lang="scss" scoped>
.inputForm {
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
  }
  .body {
    display: flex;
  }
  .error {
    padding: 4px 8px;
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
</style>
