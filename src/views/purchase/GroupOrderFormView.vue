<template>
  <div class="container">
    <div class="jumbo">
      <h3>단체 구매 양식</h3>
      <p>단체 구매는 계좌이체로 결제합니다.</p>
      <p>이용권 단체 구매는 1년 이용권만 구매 가능합니다.</p>
    </div>

    <div class="elem" v-for="form in forms" :key="form.wid">
      <TextFieldView
        v-if="editMode"
        :formModel="form"
        :readOnly="form.wid === 'senderEmail'"
        @value="updateForm"
      >
        <template #title
          ><h3>{{ form.title }}</h3></template
        >
      </TextFieldView>
      <div v-else class="preview">
        <h3>{{ form.title }}</h3>
        <div v-if="form.value" class="value">{{ form.value }}</div>
        <div v-else class="empty value">미입력</div>
      </div>
    </div>
    <div class="elem">
      <h3>필요 서류</h3>
      <div v-if="editMode" class="papers">
        <div class="each" v-for="paper in papers" :key="paper.type">
          <label>
            <input type="checkbox" v-model="paper.selected" />
            <span>{{ paper.text }}</span>
          </label>
          <input
            v-if="paper.type === 'ETC' && papers[3].selected"
            type="text"
            v-model="papers[3].value"
          />
        </div>
      </div>
      <div v-else class="papers">
        <div
          class="each"
          v-for="paper in papers.filter((p) => p.selected)"
          :key="paper.type"
        >
          <div class="value">{{ paper.value || paper.text }}</div>
        </div>
      </div>
    </div>
    <div class="elem">
      <h3>문의 내용</h3>
      <p>이용권 수량(학생 수) 및 기타 문의사항을 입력해주세요</p>
      <div class="desc">
        <textarea
          v-model="memo.value"
          placeholder="예) 이용권 6장 &#10;기타 문의 사항 입력"
        ></textarea>
        <div class="state">
          <span class="n">{{ memo.value.length }}</span> /
          <span class="n">1000</span>
        </div>
      </div>
    </div>
    <div v-if="editMode" class="elem">
      <button @click="showPreview" class="nude blue">미리보기</button>
    </div>
    <div v-else class="elem">
      <button @click="showEdit" class="nude red">수정하기</button>
      <button @click="sendForm" class="nude blue">전송하기</button>
    </div>
  </div>
</template>

<script>
import { TextFieldView, InputForm } from "@/components/form";
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";
import api from "@/service/api";
import { useRouter } from "vue-router";
import toast from "../../components/toast";

export default {
  components: {
    TextFieldView,
  },
  setup() {
    const store = useStore();
    const userRef = computed(() => store.getters["user/currentUser"]);
    const router = useRouter();
    const editMode = ref(true);
    const forms = [
      new InputForm({
        wid: "orgName",
        title: "기관명 *",
        value: "",
        placeholder: "소속 기관명을 입력해주세요.",
      }),
      new InputForm({
        wid: "senderName",
        title: "문의자 이름 *",
        value: userRef.value?.name,
        placeholder: "이름을 입력해주세요.",
      }),
      new InputForm({
        wid: "senderContactInfo",
        title: "문의자 연락처 * ",
        value: "",
        placeholder: "010-0000-0000",
      }),
      new InputForm({
        wid: "senderEmail",
        title: "문의자 이메일",
        value: userRef.value?.email,
        readOnly: true,
        placeholder: "접수 후 이메일로 알려드립니다.",
      }),
      new InputForm({
        wid: "orgEmail",
        title: "행정실(학교) 이메일 (필요 서류를 받을 이메일 주소)",
        value: "",
        placeholder: "서류를 전달받을 기관 이메일을 입력해주세요.",
      }),
    ];
    const papers = reactive([
      {
        type: "EST",
        text: "견적서",
        selected: false,
        value: "",
      },
      {
        type: "CBR",
        text: "사업자등록증",
        selected: false,
        value: "",
      },
      {
        type: "BNK",
        text: "통장사본",
        selected: false,
        value: "",
      },
      {
        type: "ETC",
        text: "기타",
        selected: false,
        value: "",
      },
    ]);
    const memo = reactive({
      value: "",
    });
    const updateForm = ({ value, commit }) => {
      commit(value);
    };
    const validForm = () => {
      const orgName = forms.find((form) => form.wid === "orgName");
      const error = [];
      if (orgName.value.trim() === "") {
        error.push("소속 기관명을 입력해주세요");
      }
      const senderName = forms.find((form) => form.wid === "senderName");
      if (senderName.value.trim() === "") {
        error.push("문의자 이름을 입력해주세요");
      }
      const senderContactInfo = forms.find(
        (form) => form.wid === "senderContactInfo"
      );
      if (senderContactInfo.value.trim() === "") {
        error.push("문의자 연락처(전화번호)를 입력해주세요");
      }
      if (memo.value.trim() === "") {
        error.push("문의 내용을 입력해주세요");
      }
      if (error.length > 0) {
        toast.warn(error, "구매 양식", 30);
      }
      return error.length === 0;
    };
    const showPreview = () => {
      if (validForm()) {
        console.log(papers.filter((paper) => paper.selected));
        editMode.value = false;
      }
    };
    const showEdit = () => (editMode.value = true);
    const sendForm = () => {
      const orderForm = {
        seq: null,
        orgName: null,
        senderName: null,
        senderContactInfo: null,
        senderEmail: null,
        orgEmail: null,
        content: null,
        papers: [],
      };
      const paperSpec = {
        paperType: null,
        desc: null,
      };
      forms.reduce((order, form) => {
        order[form.wid] = form.value;
        return order;
      }, orderForm);
      orderForm.content = memo.value;

      papers
        .filter((p) => p.selected)
        .forEach((paper) => {
          const p = Object.assign({}, paperSpec);
          p.paperType = paper.type;
          p.desc = paper.value;
          orderForm.papers.push(p);
        });
      api.order.group.sendForm(orderForm).then(() => {
        alert("접수완료");
        router.replace("/");
      });
    };
    return {
      forms,
      papers,
      memo,
      editMode,
      showPreview,
      showEdit,
      sendForm,
      updateForm,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 600px;
  .jumbo {
    text-align: center;
    margin-top: 24px;
    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 12px;
    }
  }
  .elem {
    margin-top: 16px;
    h3 {
      font-size: 1rem;
      margin-bottom: 4px;
      font-weight: 600;
    }

    .papers {
      display: flex;
      flex-direction: column;
      .each {
        flex: 0 0 25%;
        display: flex;
        align-items: center;
        column-gap: 8px;
        label {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          column-gap: 8px;
          white-space: nowrap;
        }
        input {
          flex: 1 1 auto;
        }
      }
    }
    .desc {
      height: 180px;
      width: 100%;
      display: flex;
      flex-direction: column;
      textarea {
        flex: 1 1 auto;
        resize: none;
        padding: 8px;
        font-size: 1.1rem;
      }
      .state {
        text-align: right;
      }
    }
  }
}
</style>
