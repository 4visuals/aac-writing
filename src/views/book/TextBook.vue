<template>
  <div class="book-ui">
    <div class="cover front">
      <slot name="front" />
    </div>
    <ul class="pages">
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <div class="cover back"></div>
  </div>
</template>

<script>
export default {
  props: ["text"],
};
</script>

<style lang="scss" scoped>
.book-ui {
  width: 60%;
  height: 150px;
  /* transform-style: preserve-3d; */
  perspective: 900px;
  position: relative;
  display: inline-block;
  border-radius: 10px;
  box-sizing: border-box;
  text-align: center;
  .cover {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    transform-origin: 0% 100%;
    border-radius: 3px;
    background-color: #b8dbd9;
    background-image: url("~@/assets/book-cover.svg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 10;
    &.front {
      left: 2px;
      transform: rotateY(-23.1deg);
      transition: transform 0.3s;
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }
    &.back {
      left: 0px;
      right: -3px;
      transform: rotateY(-10deg);
      background-color: #586f7c;
      z-index: 0;
    }
  }
  .pages {
    padding: 0;
    position: absolute;
    top: 3px;
    left: 3px;
    right: 1px;
    bottom: 3px;
    list-style: none;
    transform-style: preserve-3d;
    margin: 0;
    text-align: left;
    z-index: 5;
    li {
      border: 1px solid #eee;
      background-color: #f4f4f9;
      position: absolute;
      width: 100%;
      height: 100%;
      transform-origin: 0% 100%;
      transform-style: flat;
    }
  }
}
</style>
