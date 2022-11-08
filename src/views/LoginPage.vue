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
      <div class="cmp-detail">
        <p>
          (주)성주코퍼레이션 | 정인균 | 사업자번호 402-88-01673 | TEL:
          070-7808-8807
        </p>
        <p>contact@kdict.kr</p>
        <p>서울특별시 성동구 왕십리로 24나길 20, 2층 243호 (창성빌딩)</p>
        <p>© 2022 그림한글. All rights reserved.</p>
      </div>
    </section>
  </div>
</template>

<script>
import TeacherNav from "./nav/TeacherNav.vue";
import StudentLoginForm from "./StudentLoginForm.vue";
export default {
  components: {
    TeacherNav,
    StudentLoginForm,
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
