<template>
  <div class="header">
    <div class="title">
      <h3 class="text-ellipsis">
        <ActionIcon
          class="icon"
          icon="expand_circle_down"
          @click="$emit('back', 'back')"
        />
        <span class="main text-ellipsis">{{ title() }}</span>
      </h3>
      <SpanText
        v-if="overviewVisible"
        class="overview"
        @click="$emit('overview')"
        ><AppIcon icon="info" fsize="24px" /><span class="label"
          >문제 보기</span
        ></SpanText
      >
      <SpanText class="overview text-ellipsis">{{
        section.chapter.desc
      }}</SpanText>
      <ActionIcon class="icon" icon="cancel" @click="$emit('back', 'close')" />
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
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
    resourceType: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const overviewVisible = reactive(!props.resourceType);

    const title = () => {
      const { level, description } = props.section;
      return `${level}. ${description}`;
    };

    return { overviewVisible, title };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
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
      display: inline-flex;
      align-items: center;
      column-gap: 4px;
      .label {
        white-space: nowrap;
      }
      @include mobile {
        .label {
          display: none;
        }
      }
    }
    .switch {
      flex: 0 0 auto;
    }
    .icon {
      font-size: 32px;
      transform: rotate(90deg);
    }
  }
}
@include mobile {
  .header {
    padding: 8px;
    .title {
      h3 {
        .main {
          padding-left: 8px;
          font-size: 16px;
        }
      }
      .icon {
        font-size: 24px;
      }
    }
  }
}
</style>
