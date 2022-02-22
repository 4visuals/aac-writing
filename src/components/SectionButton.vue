<template>
  <div class="section" @click="$emit('itemClicked', item)">
    <h1 :class="theme">{{ idx + 1 }}</h1>
    <div class="desc" :class="theme">
      <!-- <h4>{{ item.title }}</h4> -->
      <h4>{{ item.subTitle }}</h4>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["idx", "item", "theme"],
  setup() {},
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";

@include mobile {
  .section {
    margin-top: 2rem;
  }
}
@include tablet {
  .section {
    margin-top: 3rem;
  }
}
@include desktop {
  .section {
    margin-top: 4rem;
  }
}
.section {
  user-select: none;
  position: relative;
  h1 {
    font-family: "Rowdies", cursive;
    position: absolute;
    left: 24px;
    transform: translateY(-60%);
    z-index: 10;
    font-size: 3rem;
    border-radius: 24px;
    line-height: 1;
    display: block;
    color: #d23d70;
    &.green {
      text-shadow: 2px 2px #d4e250;
      color: #20450a;
    }

    &.pink {
      text-shadow: 2px 2px #f4abc4;
      color: #d23d70;
    }

    &.blue {
      text-shadow: 2px 2px #6c97dc;
      color: #0b0a45;
    }
  }
  .desc {
    padding: 16px 8px 8px 24px;
    border-radius: 16px;
    position: relative;
    margin: 8px 0;
    cursor: pointer;
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
        box-shadow: 4px 4px #f4abc4;
      }
      &.green {
        box-shadow: 4px 4px #d4e250;
      }
      &.blue {
        box-shadow: 4px 4px #6c97dc;
      }
    }
    @include mobile {
      h4 {
        font-size: 1.25rem;
      }
      p {
        font-size: 0.85rem;
      }
    }
    @include tablet {
      h4 {
        font-size: 2.5rem;
      }
      p {
        font-size: 1.5rem;
      }
    }
    @include desktop {
      h4 {
        font-size: 3rem;
      }
      p {
        font-size: 2rem;
      }
    }
    &.green {
      box-shadow: 6px 6px #d4e250;
      background-color: #dde776;
      color: #20450a;
    }

    &.pink {
      box-shadow: 6px 6px #f4abc4;
      background-color: #f9bbd0;
      color: #d23d70;
    }

    &.blue {
      box-shadow: 6px 6px #6c97dc;
      background-color: #7ca2e0;
      color: #0b0a45;
    }
  }
}
</style>
