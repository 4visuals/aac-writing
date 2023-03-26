<template>
  <div class="lcs-form">
    <h3>단체 이용권 발급 화면</h3>

    <div class="elem">
      <h5>요청인</h5>
      <p class="col2">
        <span clas="lbl">문의시간</span
        ><span class="val">{{ order.creationTimeKr }}</span>
      </p>
      <p class="col2">
        <span clas="lbl">이름</span><span>{{ user.name }}</span>
      </p>
      <p class="col2">
        <span clas="lbl">이메일</span><span>{{ user.email }}</span>
      </p>
      <p class="col2">
        <span clas="lbl">연락처</span
        ><span v-if="order.senderContactInfo">{{
          order.senderContactInfo
        }}</span
        ><span v-else>미입력</span>
      </p>
      <textarea :value="order.content">{{}}</textarea>
    </div>

    <div class="elem">
      <h5>기관 정보</h5>
      <p class="col2">
        <span clas="lbl">기관명</span>
        <span v-if="order.orgName">{{ order.orgName }}</span
        ><span v-else>미입력</span>
      </p>
      <p class="col2">
        <span clas="lbl">기관 이메일</span>
        <span v-if="order.email">{{ order.orgEmail }}</span
        ><span v-else>미입력</span>
      </p>
      <p class="col2">
        <span class="lbl">필요서류</span>
        <span class="paper"
          ><span v-for="(paper, idx) in order.papers" :key="idx">{{
            paper.desc
          }}</span></span
        >
      </p>
    </div>
    <div class="elem">
      <h5>상품</h5>
      <select v-model="activeProduct">
        <option v-for="prod in products" :key="prod.seq" :value="prod">
          {{ prod.description }}
        </option>
      </select>
      <p v-if="activeProduct">
        1매 할인 반영 가격: {{ currency.format(activeProduct.price) }}원, ({{
          activeProduct.durationInDays
        }}일)
      </p>
    </div>
    <div class="elem">
      <h5>이용권 갯수</h5>
      <p>수강증 매수를 지정합니다. 7매인 경우 1매+1매+5매 또는 1매+3매+3매</p>
      <div class="ctrl">
        <AacButton
          borderless
          theme="blue"
          text="+1매"
          size="xs"
          muted
          @click="inc(1)"
        ></AacButton>
        <AacButton
          borderless
          theme="blue"
          text="+3매"
          size="xs"
          muted
          @click="inc(3)"
        ></AacButton>
        <AacButton
          borderless
          theme="blue"
          text="+5매"
          size="xs"
          muted
          @click="inc(5)"
        ></AacButton>
        <AacButton
          borderless
          theme="red"
          text="-1매"
          size="xs"
          muted
          @click="inc(-1)"
        ></AacButton>
        <AacButton
          borderless
          theme="red"
          text="초기화"
          size="xs"
          muted
          @click="inc(-1 * cnt)"
        ></AacButton>
      </div>
    </div>
    <div class="elem">
      <h5>약정 금액</h5>
      <p>고객이 납부할 금액을 입력합니다.</p>
      <p><input type="number" v-model="contractPrice" /></p>
      <p>
        <span>{{ currency.read(contractPrice) }}원</span>
      </p>
    </div>
    <div class="elem">
      <hr />
      <p>아래 버튼을 누르면 수강증이 발급됩니다.</p>
      <p>
        정상 가격 : <span>{{ currency.format(activeProduct.price * cnt) }}</span
        >원, 납부 금액
        <span class="currency">{{ currency.format(contractPrice) }}</span
        >원
      </p>
      <AacButton
        class="btn-purchase"
        borderless
        theme="gold"
        :text="`총 ${cnt} 매 발급`"
        size="lg"
        muted
        @click="issueLicense"
      ></AacButton>
    </div>
  </div>
</template>

<script>
import adminApi from "../../service/admin-api";
import util from "../../../../service/util";
import { ref, shallowRef } from "vue";
export default {
  props: ["order", "products"],
  setup(props) {
    const cnt = ref(0);
    /**
     * 선택한 상품
     */
    const activeProduct = shallowRef(props.products[0]);
    /**
     * 고객이 납부할 금액
     */
    const contractPrice = ref(0);
    const issueLicense = () => {
      adminApi.order.group
        .commit(
          props.order.seq,
          activeProduct.value.code,
          cnt.value,
          contractPrice.value
        )
        .then((res) => {
          console.log(res);
        });
    };
    const inc = (qtt) => {
      cnt.value = Math.max(0, cnt.value + qtt);
    };
    const oneYearProduct = props.products.find(
      (prod) => prod.durationInHours === 24 * 365
    );
    if (oneYearProduct) {
      activeProduct.value = oneYearProduct;
    }
    return {
      cnt,
      activeProduct,
      contractPrice,
      user: props.order.sender,
      issueLicense,
      inc,
      currency: util.currency,
    };
  },
};
</script>

<style lang="scss" scoped>
.lcs-form {
  padding: 16px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  .elem {
    font-weight: 300;
    h5 {
      font-size: 18px;
      margin-bottom: 6px;
    }
    p {
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 4px;
      &.col2 {
        display: grid;
        grid-template-columns: minmax(80px, 120px) 1fr;
        grid-template-rows: auto;
      }
      .paper {
        display: flex;
        column-gap: 8px;
        color: #3a3a3a;
        font-weight: 500;
      }
    }
    textarea {
      width: 100%;
      padding: 6px;
      border: none;
      background-color: #dff8ff;
      font-size: 14px;
      margin-top: 8px;
      &:focus {
        outline: #92bbff 1px solid;
      }
    }
    .btn-purchase {
      font-size: 18px;
    }
  }
  .ctrl {
    display: flex;
    column-gap: 4px;
  }
}
</style>
