<template>
  <div class="lcs-form">
    <h3>신규 발급</h3>
    <p>{{ user.email }}({{ user.name }})</p>
    <div class="ctrl">
      <AacButton
        borderless
        rect
        theme="blue"
        text="1장"
        size="xs"
        muted
        @click="issueLicense(1)"
      ></AacButton>
      <AacButton
        borderless
        rect
        theme="blue"
        text="3장"
        size="xs"
        muted
        @click="issueLicense(3)"
      ></AacButton>
      <AacButton
        borderless
        rect
        theme="blue"
        text="5장"
        size="xs"
        muted
        @click="issueLicense(5)"
      ></AacButton>
    </div>
  </div>
</template>

<script>
import adminApi from "../../service/admin-api";
export default {
  props: ["user"],
  setup(props, { emit }) {
    const issueLicense = (cnt) => {
      adminApi.license.create(props.user.seq, cnt).then((res) => {
        console.log(res);
        emit("created", res.licenses);
      });
    };
    return {
      issueLicense,
    };
  },
};
</script>

<style lang="scss" scoped>
.lcs-form {
  padding: 16px;
  .ctrl {
    display: flex;
    column-gap: 4px;
  }
}
</style>
