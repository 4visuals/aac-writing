<template>
  <article
    :class="`${width} ${theme}`"
    @mouseover="subOn = true"
    @mouseleave="subOn = false"
  >
    <div class="box">
      <h3>{{ article.title }}</h3>
      <transition name="sub" mode="out-in">
        <div v-if="subOn" class="subtitle">{{ article.detail }}</div>
      </transition>
    </div>
    <transition name="sub" mode="out-in">
      <a
        v-if="subOn"
        :key="subOn"
        href="#"
        class="view btn"
        @click.prevent="$emit('detail', article)"
        >살펴보기</a
      >
    </transition>
  </article>
</template>

<script>
import { ref } from "vue";

export default {
  props: ["width", "theme", "article"],
  setup() {
    const subOn = ref(false);
    return { subOn };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$trasition: all 1s ease;
$bgcolor: #fffdf4;
$anim-dur: 0.5s;
$anim-fn: cubic-bezier(0, 0.6, 0.5, 1);
@mixin circles($specs) {
  $output: ();
  @each $spec in $specs {
    $dir: nth($spec, 1); // 'circle at $dir'
    $color: nth($spec, 2);
    $size: nth($spec, 3); // 'like x% y%'

    $grad: ();
    $grad: append($grad, $color 0%, comma);
    $grad: append($grad, $color $size, comma);
    $grad: append($grad, transparent $size, comma);
    $grad: append($grad, transparent 100%, comma);
    $output: join($output, radial-gradient(circle at $dir, $grad), comma);
  }
  background-image: $output;
}
article {
  display: flex;
  align-items: center;
  height: 30rem;
  position: relative;
  overflow: hidden;
  &.w40 {
    width: 40%;
  }
  &.w60 {
    width: 60%;
  }
  &.w50 {
    width: 50%;
  }
  &::before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.85;
    transition: $trasition;
  }
  // &::after {
  //   position: absolute;
  //   content: "";
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   opacity: 0;
  //   background-image: url("/img/character/ch000.svg");
  //   background-size: 20rem;
  //   background-repeat: no-repeat;
  //   background-position: center;
  //   z-index: -1;
  //   transition: $trasition;
  // }
  &:hover {
    // z-index: 10;
    &::before {
      opacity: 1;
      transform: scale(1.25);
      // background-color: white;
    }
    &:after {
      opacity: 1;
    }
    .box {
      // color: $fontcolor;
      text-shadow: none;
      margin-bottom: 8rem;
      color: #242424;
    }
  }

  .box {
    flex: 1 1 auto;
    margin: 3rem 4rem;
    position: relative;
    z-index: 5;
    font-weight: 600;
    font-size: 32px;
    color: #ffffffaa;
    text-shadow: 2px 2px 4px #0000004d;
    transition: color $anim-fn $anim-dur, text-shadow $anim-fn $anim-dur,
      box-shadow $anim-fn $anim-dur, margin-bottom $anim-fn $anim-dur;
    h3 {
      font-size: 1.2em;
      font-weight: 900;
    }
    .subtitle {
      position: absolute;
      top: 100%;
      left: 0;
      font-size: 0.7em;
      margin-top: 12px;
    }
  }
  .view {
    position: absolute;
    right: 2rem;
    bottom: 2rem;
  }
}

@include mobile {
  article {
    height: 100%;
  }
}
.bluesky {
  &::before {
    background-color: #14b8ff;
    @include circles(
      (30% 50%, #0000000a, 68%) (32% 60%, #0000000a, 21%)
        (12% 80%, #0000000a, 12%)
    );
  }
}
.bora {
  &::before {
    background-color: #995eff;
    @include circles(
      (0% 20%, #0000000a, 68%) (12% 70%, #0000000a, 30%)
        (0% 30%, #0000000a, 15%)
    );
  }
}
.pink {
  &::before {
    background-color: #f67bff;
    @include circles(
      (10% 20%, #0000000a, 8%) (32% 70%, #0000000a, 30%)
        (0% 30%, #0000000a, 15%)
    );
  }
}
.orange {
  &::before {
    background-color: #e7b788;
    @include circles(
      (10% 20%, #0000000a, 18%) (16% 20%, #0000000a, 30%)
        (70% 30%, #0000000a, 43%)
    );
  }
}
.blue2 {
  &::before {
    background-color: #8ea9e8;
    @include circles(
      (22% 0%, #0000000a, 12%) (16% 20%, #0000000a, 18%)
        (30% 80%, #0000000a, 40%)
    );
  }
}
.gold {
  &::before {
    background-color: rgb(238, 220, 23);
    @include circles(
      (4% 15%, #0000000a, 10%) (10% 0%, #0000000a, 22%)
        (73% 10%, #0000000a, 53%)
    );
  }
}
.sub {
  &-enter-from {
    opacity: 0;
  }
  &-enter-active {
    transition: all $anim-fn $anim-dur;
    &.view {
      transition-delay: 0.2s;
    }
  }
  &-enter-to {
    height: auto;
  }
  &-leave-from {
    opacity: 1;
  }
  &-leave-active {
    transition: all $anim-fn $anim-dur;
  }
  &-leave-to {
    opacity: 0;
  }
}
a.btn {
  text-transform: uppercase;
  white-space: normal !important;
  font-weight: 600;
  border-radius: 27px;
  padding: 13px 35px;
  text-decoration: none;
  letter-spacing: 0.2px;
  font-size: 20px;
  background-color: #48c4d8;
  border-color: #48c4d8;
  color: #fff;
  text-shadow: none !important;
  box-shadow: 0 0 24px #0000004d, 2px 2px 4px #00000020;
}
</style>
