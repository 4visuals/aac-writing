<template>
  <div
    class="student"
    v-if="assigned.student"
    :data-stud="assigned.student.seq"
  >
    <div class="stud-info">
      <nav>
        <div class="logo">
          <Pavicon class="icon" path="/img/stud-pavicon.svg"></Pavicon>
        </div>

        <div class="ctrl">
          <button class="nude" @click="$emit('edit', assigned)">
            <span>수정</span>
          </button>
          <button
            class="nude"
            :disabled="assigned.license && assigned.license.isInUse()"
            @click="provider.deleteStudent(assigned.student)"
          >
            <span>삭제</span>
          </button>
        </div>
      </nav>
      <table>
        <tr>
          <td><SpanText class="label">이름</SpanText></td>
          <td>
            <SpanText class="nowrap">{{ assigned.student.name }}</SpanText>
          </td>
        </tr>
        <tr>
          <td><SpanText class="label">생일</SpanText></td>
          <td>
            <SpanText class="nowrap">{{
              ymd(assigned.student.birth)
            }}</SpanText>
          </td>
        </tr>
        <tr>
          <td><SpanText class="label">아이디</SpanText></td>
          <td>
            <SpanText class="nowrap">{{ assigned.student.userId }}</SpanText>
          </td>
        </tr>
        <tr>
          <td><SpanText class="label">비밀번호</SpanText></td>
          <td>
            <SpanText class="nowrap">{{ assigned.student.pass }}</SpanText>
          </td>
        </tr>
      </table>
    </div>
    <div class="lcs">
      <div v-if="assigned.license" class="license">
        <button
          class="nude"
          :class="[assigned.license.isExpired() ? 'exp' : 'using']"
        >
          {{ assigned.license.isExpired() ? "이용권 만료" : "이용중" }}
        </button>
        <!-- <button :disabled="true" class="nude history">학습 결과</button> -->
      </div>
      <div v-else class="license">
        <button class="nude red" @click="$emit('reg-license', assigned)">
          이용권 없음
        </button>
      </div>
      <div class="license">
        <button class="nude history" @click="$emit('diagnosis', assigned)">
          학습정보
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { time } from "@/service/util";
import { SpanText } from "../../../../components/text";
import Pavicon from "../../../../components/Pavicon.vue";
import { inject, defineProps, defineEmits } from "vue";

defineProps(["assigned"]);
defineEmits(["diagnosis", "reg-license"]);
const ymd = (birth) => time.toYMD(birth);
const provider = inject("settingNav");
</script>

<style lang="scss" scoped>
.student {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  .stud-info {
    flex: 1 1 auto;
    nav {
      display: flex;
      .logo {
        position: relative;
        flex: 1 1 auto;
        display: flex;
        // flex-direction: column;
        .icon {
          flex: 1 1 auto;
        }
      }

      .ctrl {
        flex: 0 0;
        span {
          white-space: nowrap;
        }
      }
    }
    table {
      tr {
        td {
          padding: 4px 8px;
        }
      }
    }
  }
  .lcs {
    flex: 0;
    display: flex;
    justify-content: space-between;
  }
  .label {
    white-space: nowrap;
  }

  .stud-del {
    position: absolute;
    top: -4px;
    right: -4px;
    font-size: 20px;
    color: var(--aac-color-red-900);
    padding: 4px;
    &:hover {
      background-color: var(--aac-color-red-200);
    }
  }
}
.license {
  display: inline-flex;
  align-items: center;
  column-gap: 6px;

  user-select: none;
  button {
    border-radius: 20px;
    &.history {
      color: #32393d;
      border: 1px solid #32393d;
    }
    &.exp {
      background-color: #32393d;
      color: white;
      border-color: transparent;
    }
    &.using {
      background-color: #1db270;
      color: white;
    }
    &.history {
      background-color: #003ac0;
      color: white;
    }
  }
  .icon {
    font-size: 14px;
  }
}
</style>
