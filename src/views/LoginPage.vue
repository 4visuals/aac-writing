<template>
  <div class="login-page">
    <TeacherNav />
    <div class="inner">
      <h3>로그인 페이지</h3>
      <StudentLoginForm />
    </div>
    <section class="company">
      <div class="policy">
        <router-link
          active-class="pol"
          exact-active-class="active"
          to="/policy/tou"
          >이용 약관</router-link
        >
        <router-link
          active-class="pol"
          exact-active-class="active"
          to="/policy/privacy"
          >개인정보처리방침</router-link
        >
      </div>
      <CompanyDetail class="cmp-detail" />
    </section>
  </div>
</template>

<script>
import CompanyDetail from "../components/CompanyDetail.vue";
import TeacherNav from "./nav/TeacherNav.vue";
import StudentLoginForm from "./StudentLoginForm.vue";
export default {
  components: {
    TeacherNav,
    StudentLoginForm,
    CompanyDetail,
  },
};
</script>

<style lang="scss" scoped>
.login-page {
  font-size: 16px;
  .inner {
    max-width: 480px;
    margin: 0 auto 24px;
  }
  a {
    color: inherit;
    text-decoration: none;
    line-height: 1;
    &.btn {
      padding: 4px;
    }
  }
  .company {
    background-color: #242424;
    color: #ccc;
    padding: 16px;
    scroll-snap-align: end;
    .policy {
      display: inline-flex;
      flex-direction: column;
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
        &:hover {
          color: rgb(125, 168, 255);
        }
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
}
</style>
