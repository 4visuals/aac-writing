<template>
  <div class="dropdown-wrapper">
    <div class="inner">
      <input
        type="text"
        :placeholder="placeholder"
        v-model="textField"
        @click="setVisible(true)"
        @input="typed"
        @keydown.down.stop="navigate"
      />
      <AppIcon class="clear" icon="close" @click="clearForm" />
    </div>
    <div
      class="elem-container"
      ref="ddBox"
      v-if="containerVisible"
      tabindex="0"
      @keydown.down="$emit('move', 1)"
      @keydown.up="$emit('move', -1)"
      @keydown.enter="$emit('commit', { setText: onSelected })"
    >
      <slot
        v-for="elem in items"
        :key="elem.seq"
        :item="elem"
        :setText="onSelected"
      />
      <div class="empty" v-if="items && items.length === 0">없음</div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  props: { items: { type: Array }, placeholder: { type: String, default: "" } },
  setup(props, { emit }) {
    const containerVisible = ref(false);
    const textField = ref("");
    const ddBox = ref("");

    const close = () => {
      containerVisible.value = false;
      document.removeEventListener("click", close, false);
    };
    const setVisible = (visible) => {
      if (containerVisible.value) {
        return;
      }
      containerVisible.value = visible;
      // prevent current click to call 'click'
      setTimeout(() => {
        document.addEventListener("click", close, false);
      }, 0);
    };
    const typed = (e) => {
      emit("typing", e.target.value);
      setVisible(true);
    };
    const onSelected = (text, clear) => {
      // console.log("[on selected]", item);
      textField.value = text;
      if (clear) {
        close();
      }
    };
    const clearForm = () => {
      close();
      textField.value = "";
      emit("clear");
    };
    const navigate = (e) => {
      if (!props.items || props.items.length === 0) {
        return;
      }
      if (e.key === "ArrowDown") {
        e.target.blur();
        ddBox.value.focus();
        emit("navigate");
      }
    };
    return {
      textField,
      ddBox,
      containerVisible,
      typed,
      setVisible,
      onSelected,
      clearForm,
      navigate,
    };
  },
};
</script>

<style lang="scss" scoped>
.dropdown-wrapper {
  position: relative;
  max-width: 250px;
  .inner {
    display: flex;
    align-items: center;
    position: relative;
    > input {
      width: 100%;
      padding: 6px 32px 6px 12px;
      border: 1px solid transparent;
      background-color: #ddf8ff;
      border-radius: 8px;
      letter-spacing: 2px;
      font-size: 1rem;
      width: 100%;
      outline: none;
      color: #3477cf;
      &::placeholder {
        font-size: 1rem;
      }
    }
    > .clear {
      display: flex;
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      color: #3477cf;
      cursor: pointer;
    }
  }
  .elem-container {
    border: 1px solid #dcdcdc;
    padding: 0px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    position: absolute;
    background-color: white;
    width: 100%;
    top: 100%;
    left: 0;
    box-shadow: 0px 1px 1px #0000004d;
    z-index: 50;
  }
}
</style>
