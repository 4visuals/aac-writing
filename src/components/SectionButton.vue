<template>
  <div class="section" :class="{ compact: compact === '', visited }">
    <!-- <div class="reward">
      <div class="crown">
        <img src="@/assets/reward/crown_section_word.png" />
      </div>
      <div class="crown">
        <img src="@/assets/reward/crown_section_sen.png" />
      </div>
    </div> -->
    <AppButton
      class="sec-btn"
      size="sm"
      :theme="theme"
      :nowrap="false"
      :text="title()"
      @click="$emit('itemClicked', item)"
    ></AppButton>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
import { AppButton } from "./form";

export default {
  components: {
    AppButton,
  },
  props: ["idx", "item", "theme", "compact", "desc", "history"],
  setup(props) {
    const store = useStore();
    const visited = computed(() =>
      store.getters["quizHistory/hasHistory"](props.item)
    );

    const title = () => {
      const { item } = props;
      const num = item.level === -1 ? "도전" : item.level;
      const desc =
        item.level === -1 ? item.description.substring(2) : item.description;
      return `${num}. ${desc}`;
    };

    return {
      visited,
      title,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";

@include mobile {
  .section {
    h1 {
      font-size: 1.8rem;
    }
  }
}
@include tablet {
  .section {
    h1 {
      font-size: 2.2rem;
    }
  }
}
@include desktop {
  .section {
    h1 {
      font-size: 2.2rem;
    }
  }
}
.section {
  user-select: none;
  position: relative;
  flex: 1;
  display: flex;
  .sec-btn {
    flex: 1 1 auto;
  }
  .reward {
    position: absolute;
    right: 16px;
    z-index: 5;
    display: flex;
    column-gap: 8px;
    transform: translateY(-60%);
    .crown {
      width: 24px;
      height: 24px;
      img {
        width: 100%;
        height: auto;
        filter: drop-shadow(1px 1px 1px #0000004a);
      }
    }
  }
  .desc {
    padding: 16px 8px 8px 24px;
    border-radius: 16px;
    position: relative;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
    column-gap: 16px;
    &::after {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      width: 8px;
      height: 24px;
      border-radius: 8px;
      background-color: #ffffff4d;
    }
    &:active {
      top: 2px;
      left: 2px;
      &.pink {
        box-shadow: 2px 2px var(--aac-color-pink-500);
      }
      &.yellow {
        box-shadow: 2px 2px var(--aac-color-yellow-400);
      }
      &.green {
        box-shadow: 2px 2px #d4e250;
      }
      &.blue {
        box-shadow: 2px 2px #6c97dc;
      }
    }
    @include mobile {
      h4 {
        font-size: 1.25rem;
      }
    }
    @include tablet {
      h4 {
        font-size: 2.5rem;
      }
    }
    @include desktop {
      h4 {
        font-size: 3rem;
      }
    }
    &.green {
      box-shadow: 4px 4px var(--aac-color-green-700);
      background-color: var(--aac-color-green-400);
      color: var(--aac-color-green-900);
    }

    &.pink {
      box-shadow: 4px 4px var(--aac-color-pink-500);
      background-color: var(--aac-color-pink-400);
      color: var(--aac-color-pink-900);
    }
    &.yellow {
      box-shadow: 4px 4px var(--aac-color-yellow-700);
      background-color: var(--aac-color-yellow-400);
      color: var(--aac-color-yellow-900);
    }

    &.blue {
      box-shadow: 4px 4px #6c97dc;
      background-color: #7ca2e0;
      color: #0b0a45;
    }
  }
  &.compact {
    margin: 0;
    display: inline-flex;
    white-space: nowrap;
    > h1 {
      left: 14px;
      top: 50%;
      font-size: 1.5rem;
      transform: translateY(-50%);
    }
    .desc {
      padding: 8px 16px 8px 36px;
      box-shadow: none;
      &:after {
        display: none;
      }
      &:active {
        top: 0px;
        left: 0px;
        box-shadow: none;
      }
      .sub {
        position: relative;
        &::before {
          content: "";
          display: block;
          height: 4px;
          width: 4px;
          border-radius: 2px;
          position: absolute;
          top: 50%;
          left: -10px;
          transform: translateY(-50%);
        }
        &.green {
          &::before {
            background-color: #20450a;
          }
        }

        &.pink {
          &::before {
            background-color: #d23d70;
          }
        }
        &.yellow {
          &::before {
            background-color: var(--aac-color-yellow-900);
          }
        }
      }
    }
  }
}
</style>
