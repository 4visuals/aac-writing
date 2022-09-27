<template>
  <div :class="`wizard ${wizard.status || ''}`">
    <h3 v-if="wizard.title && wizard.status !== 'confirmed'">
      {{ wizard.title }}
    </h3>
    <div class="desc mg8" v-if="wizard.status === 'active' && wizard.desc">
      {{ wizard.desc }}
    </div>
    <div class="body mg8" v-if="wizard.status === 'active'">
      <input :type="wizard.type || 'text'" ref="inputEl" @input="valueTyped" />
    </div>
    <div class="body mg8" v-else-if="wizard.status === 'confirmed'">
      <div class="value">{{ wizard.value }}</div>
      <a href="#" class="no-style" @click.prevent="$emit('active', wizard)"
        >편집</a
      >
    </div>
    <div class="error mg8" v-if="wizard.error">{{ wizard.error }}</div>
    <div class="ctrl" v-if="wizard.status === 'active'">
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
  props: ["wizard"],
  setup(props, { emit }) {
    const inputEl = ref(null);
    const commit = () => {
      const { wizard } = props;
      emit("commit", { wizard });
    };
    const valueTyped = (e) => {
      const { wizard } = props;
      let { value } = e.target;
      if (wizard.filter) {
        value = wizard.filter(value);
      }
      inputEl.value.value = value;
      emit("value", { wizard, value, setValue: (v) => setValue(wizard, v) });
    };
    const setFocus = () => {
      nextTick().then(() => {
        inputEl.value.focus();
      });
    };
    const setValue = (wizard, value) => {
      inputEl.value.value = value;
      wizard.value = value;
    };
    watch(
      () => props.wizard.value,
      (value) => {
        inputEl.value.value = value;
      }
    );
    watch(
      () => props.wizard.status,
      (cur) => {
        if (cur === "active") {
          setFocus();
        }
      }
    );
    onMounted(() => {
      if (inputEl.value) {
        inputEl.value.value = props.wizard.value;
        setFocus();
      }
    });
    return { inputEl, commit, valueTyped };
  },
};
</script>

<style lang="scss" scoped>
.wizard {
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
