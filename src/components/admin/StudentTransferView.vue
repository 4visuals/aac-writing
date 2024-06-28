<template>
  <div class="transfer">
    <header>
      <h3>학생 이동</h3>
      <p>이용권에 등록된 학생을 다른 교사에게 등록합니다.</p>
    </header>
    <div class="body">
      <TextFieldView
        v-for="form in forms"
        :key="form.wid"
        :formModel="form"
        :readOnly="true"
      />
    </div>
    <div class="next-teacher">
      <DropDown
        :items="users"
        :fomat="(user) => `${user.name}(${user.email})`"
        placeholder="선생님 이메일 또는 이름"
        @typing="search"
        @clear="clearSearch"
        @navigate="startNavigation"
        @move="moveBy"
        @commit="showUserDetail"
        v-slot:default="{ item: user, setText }"
      >
        <div
          class="user"
          :class="{ focused: user === nextTeacher }"
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
      <div v-if="nextTeacher" class="info">
        <h5>{{ nextTeacher.name }} 님</h5>
        <p>아래 버튼을 누르면 학생을 이동시킵니다.</p>
        <button class="nude blue" @click="doTrasfer">학생 이동</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { InputForm, TextFieldView, DropDown } from "../form";
import { defineProps, defineEmits, ref, shallowRef } from "vue";
import adminApi from "../../spa/admin/service/admin-api";

const props = defineProps(["student", "license", "teacher"]);
const emits = defineEmits("success");

const users = ref([]);
const nextTeacher = shallowRef(null);
const forms = [
  new InputForm({
    wid: "name",
    title: "학생",
    placeholder: "",
    readOnly: true,
    value: props.student.name,
  }),
  new InputForm({
    wid: "name",
    title: "현재 선생님",
    placeholder: "",
    readOnly: true,
    value: props.teacher.name,
  }),
];

const userSelected = (teacher) => {
  nextTeacher.value = teacher;
};
const search = (keyword) => {
  if (keyword.trim().length === 0) {
    return;
  }
  adminApi.member.search(keyword).then((res) => {
    users.value = res.members;
  });
};
const clearSearch = () => {
  users.value = null;
  nextTeacher.value = null;
};
const doTrasfer = () => {
  const { student, teacher, license } = props;
  adminApi.student
    .transfer({
      studentSeq: student.seq,
      teacher: teacher.seq,
      license: license.uuid,
      nextTeacher: nextTeacher.value.seq,
    })
    .then(() => {
      emits("success", { student, nextTeacher });
      alert("변경 완료");
    });
};
</script>

<style lang="scss" scoped>
.transfer {
  padding: 16px;
  .next-teacher {
    border: 1px solid #5ba2ff;
    padding: 8px;
    border-radius: 8px;
    min-height: 300px;
    .info {
    }
  }
}
</style>
