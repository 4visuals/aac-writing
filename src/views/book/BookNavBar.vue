<template>
  <div class="header">
    <div class="title">
      <h3>
        <ActionIcon
          class="icon"
          icon="expand_circle_down"
          @click="$emit('back', 'back')"
        />
        <span class="main">{{ title() }}</span>
      </h3>
      <SpanText>{{ section.chapter.desc }}</SpanText>
      <ActionIcon class="icon" icon="cancel" @click="$emit('back', 'close')" />
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { ActionIcon } from "../../components/form";
import { SpanText } from "../../components/text";
export default {
  components: {
    ActionIcon,
    SpanText,
  },
  emits: ["overview", "back"],
  props: {
    section: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const quizOnly = false;
    const wordMode = ref(true);
    const title = () => {
      const { level, description } = props.section;
      return `${level}. ${description}`;
    };
    watch(wordMode, (isWord) => {
      emit("quizMode", isWord);
    });
    return { quizOnly, wordMode, title };
  },
};
</script>

<style lang="scss" scoped>
$padding: 16px;
.header {
  padding: 13px $padding;
  background-color: #ffd700;
  color: #865a00;
  .title {
    display: flex;
    column-gap: 16px;
    align-items: center;
    h3 {
      flex: 1 1 auto;
      display: inline-flex;
      align-items: center;
      font-size: 20px;
      .main {
        padding-left: 16px;
        font-weight: 600;
        line-height: 42px;
      }
      .sub {
        margin-left: 16px;
        font-size: 0.7em;
        font-weight: 400;
      }
    }
    .overview {
      cursor: pointer;
    }
    .icon {
      font-size: 32px;
      transform: rotate(90deg);
    }
  }
}
</style>
