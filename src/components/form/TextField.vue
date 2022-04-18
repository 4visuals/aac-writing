<template>
  <div class="form-elem" :style="style">
    <input
      type="text"
      :value="value"
      @input="changed"
      @keydown.enter.stop="onEnterDown"
      @keyup.enter="onEnterUp"
    />
  </div>
</template>

<script>
export default {
  props: { value: String, style: Object, trim: Boolean },
  emits: ["enter", "update:value"],
  setup(props, { emit }) {
    /*
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
    const getValue = (e) => {
      let { value } = e.target;
      return value && props.trim ? value.trim() : value;
    };
    const changed = (e) => {
      const value = getValue(e);
      emit("update:value", value);
    };
    let enterDetected = false;
    const onEnterDown = (e) => {
      enterDetected = e.isComposing;
    };
    const onEnterUp = (e) => {
      try {
        if (!enterDetected) {
          const value = getValue(e);
          emit("enter", value);
        }
      } finally {
        enterDetected = false;
      }
    };
    return {
      changed,
      onEnterDown,
      onEnterUp,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.form-elem {
  input {
    font-size: inherit;
    width: 100%;
    height: 100%;
  }
  @include mobile {
    input {
      padding: 0.4rem 0.6rem;
      font-size: 1rem;
    }
  }
  @include tablet {
    input {
      padding: 0.4rem 0.6rem;
      font-size: 1.5rem;
    }
  }
  @include desktop {
    input {
      padding: 0.4rem 0.6rem;
      font-size: 1.5rem;
    }
  }
}
</style>
