<template>
  <section>
    <div class="policy">
      <router-link
        active-class="pol"
        exact-active-class="active"
        to="/policy/tou"
        >이용 약관</router-link
      >
      <span class="delim">|</span>
      <router-link
        active-class="pol"
        exact-active-class="active"
        to="/policy/privacy"
        >개인정보처리방침</router-link
      >
    </div>
    <CompanyDetail class="cmp-detail" />
  </section>
</template>

<script>
import CompanyDetail from "../CompanyDetail.vue";
export default {
  components: {
    CompanyDetail,
  },
};
</script>

<style lang="scss" scoped>
section {
  background-color: #242424;
  color: #ccc;
  padding: 16px;
  scroll-snap-align: end;
  .policy {
    display: inline-flex;
    align-items: center;
    column-gap: 8px;
    // flex-direction: column;
    margin-bottom: 20px;
    row-gap: 8px;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      height: 1px;
      bottom: -10px;
      left: 0;
      width: 100%;
      background-color: #ccc;
    }
    a {
      color: white;
      text-decoration: none;
      &:hover {
        color: rgb(125, 168, 255);
      }
    }
    .delim {
      color: #ccc;
      font-size: 8px;
    }
  }
  .cmp-detail {
    p {
      font-size: 0.8em;
      margin: 0;
      line-height: 1.5;
    }
  }
}
</style>
