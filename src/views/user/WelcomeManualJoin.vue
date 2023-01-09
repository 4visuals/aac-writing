<template>
  <div class="welcome">
    <Logo size="md" vendor="guest" />
    <h3>{{ user.name }}님의 계정을 생성했습니다.</h3>
    <ul class="detail">
      <li>
        {{ user.name }}님의 아이디는
        <span class="info">{{ user.userId }}</span> 입니다.
      </li>
      <li>
        {{ user.name }}님의 비밀번호는
        <span class="info click" @click="showPass">{{
          passHidden ? replace(user.pass, "*") : user.pass
        }}</span>
        입니다.
      </li>
    </ul>
    <p>
      로그인 후 무료 체험 수강증이 발급됩니다. 학생을 등록해서 받아쓰기 학습을
      시작하세요.
    </p>
    <div>
      <router-link class="btn" to="/">로그인 페이지로 이동</router-link>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/oauth/Logo.vue";
import { ref } from "vue";
// import { useStore } from "vuex";
export default {
  props: ["user", "password"],
  components: {
    Logo,
  },
  setup() {
    // const store = useStore();
    const passHidden = ref(true);

    const replace = (str, ch) => str.split("").reduce((acc) => acc + ch, "");
    const showPass = () => (passHidden.value = false);
    return {
      replace,
      passHidden,
      showPass,
    };
  },
};
</script>

<style lang="scss" scoped>
.welcome {
  padding: 24px;
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  row-gap: 1.2rem;
  align-items: center;
  border-radius: 16px;
  box-shadow: 4px 4px 24px #0000001d, 0 0 2px #0000002d;
  .detail {
    list-style: none;
    padding: 0;
    margin: 0;
    .info {
      font-weight: 600;
      padding: 2px 8px;
      display: inline-block;
      font-size: 1.1rem;
      &.click {
        cursor: pointer;
        &:hover {
          background-color: rgb(127, 223, 255);
        }
      }
    }
  }
  a {
    color: inherit;
    text-decoration: none;
    line-height: 1;
    border-radius: 24px;
    margin: 24px 0 0;
    display: inline-block;
    &.btn {
      padding: 10px 16px;
      background-color: #1a73e8;
      color: white;
    }
  }
}
</style>
