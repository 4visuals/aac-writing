<template>
  <div class="fview">
    <h5>{{ product.name }}</h5>
    <div class="form search-box">
      <DropDown
        :items="userRefs"
        :fomat="(user) => `${user.name}(${user.email})`"
        placeholder="선생님 이메일 또는 이름"
        @focus="showUsers"
        @typing="search"
        @clear="clearSearch"
        @navigate="startNavigation"
        @move="moveBy"
        v-slot:default="{ item: user, setText }"
      >
        <div
          class="user"
          :class="{ focused: user === activeUserRef }"
          @click="
            () => {
              userSelected(user);
              setText(user.email);
            }
          "
        >
          {{ user.name }}({{ user.email }})
        </div>
      </DropDown>
    </div>
    <div v-if="activeUserRef" :key="activeUserRef" class="form">
      <div v-for="form in inputs" :key="form.wid" class="elem">
        <TextFieldView
          :formModel="form"
          @value="updateForm"
          :readOnly="form.readOnly"
        />
      </div>
      <div class="commit">
        <FormButton text="닫기" theme="gray" @click="$emit('close')" />
        <FormButton text="등록" theme="blue" @click="commitForm" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, shallowRef } from "vue";

import { DropDown } from "@/components/form";
import { TextFieldView, InputForm } from "@/components/form";
import adminApi from "../../spa/admin/service/admin-api";
import FormButton from "@/components/form/FormButton.vue";

const props = defineProps({
  /** @type { import('vue').PropType<import("../../entity/product").default> } */
  product: Object,
  /** @type { import('vue').PropType<GroupOrderForm> } */
  editingForm: Object,
});
const emit = defineEmits(["submit"]);
const inputs = shallowRef(undefined);

const initForm = () => {
  const user = activeUserRef.value;
  inputs.value = [
    new InputForm({
      wid: "senderEmail",
      title: "이메일",
      value: user.email,
      readOnly: true,
      placeholder: "접수 후 이메일로 알려드립니다.",
    }),
    new InputForm({
      wid: "senderName",
      title: "이름",
      value: user.name,
      required: true,
      placeholder: "이름을 입력해주세요.",
    }),
    new InputForm({
      wid: "_price",
      title: "가격",
      value: "",
      required: true,
      placeholder: "공구 참여가격",
    }),
    new InputForm({
      wid: "_qtt",
      title: "수량",
      value: "",
      required: true,
      placeholder: "구매 갯수",
    }),
  ];
};
const updateForm = ({ value, commit }) => {
  commit(value);
};
const commitForm = () => {
  const gbuyingForm = {
    productRef: props.product.seq,
    senderEmail: undefined,
    senderName: undefined,
    content: undefined,
  };
  const user = activeUserRef.value;
  // user, price, qtt는 json 형식으로 조립 후 content 속성에 담아줌
  const content = { price: undefined, qtt: undefined, userRef: user.seq };
  inputs.value.reduce((gbuying, item) => {
    const { wid } = item;
    if (wid.startsWith("_")) {
      content[wid.substring(1)] = item.value;
    } else {
      gbuying[wid] = item.value;
    }
    return gbuying;
  }, gbuyingForm);

  gbuyingForm.content = JSON.stringify(content);
  emit("submit", gbuyingForm);
};

/** @type { import('vue').ShallowRef<User> } */
const activeUserRef = shallowRef(undefined);

/** @type { import('vue').ShallowRef<Array<User>> } */
const userRefs = shallowRef(undefined);

const search = (keyword) => {
  if (keyword.trim().length === 0) {
    return;
  }
  adminApi.member.search(keyword).then((res) => {
    userRefs.value = res.members;
  });
};
const clearSearch = () => {
  activeUserRef.value = undefined;
  userRefs.value = undefined;
};
const userSelected = (user) => {
  console.log(user);
  activeUserRef.value = user;
  initForm();
};
const showUsers = () => {};
const startNavigation = () => {
  activeUserRef.value = userRefs.value[0];
};
const moveBy = (delta) => {
  if (!activeUserRef.value) {
    return;
  }
  const userList = userRefs.value;
  const focused = activeUserRef.value;
  const idx = userList.findIndex((user) => user === focused);
  const nextIdx = (idx + delta + userList.length) % userList.length;
  activeUserRef.value = userList[nextIdx];
};
</script>

<style lang="scss" scoped>
.fview {
  padding: 16px;
  .search-box {
    .user {
      padding: 4px 8px;
      &.focused {
        background-color: #ececec;
      }
    }
  }
}
</style>
