<template>
  <div class="container order">
    <div class="row">
      <div class="col-xs-12">
        <h3 class="back" @click="gotoPurchasePage">
          <ActionIcon icon="chevron_left" /><span>상품목록으로</span>
        </h3>
      </div>
    </div>
    <div class="row v-top" v-if="product">
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
        <ProductView
          :product="product"
          theme="red"
          :paymentVisible="false"
          :minified="true"
        />
        <div class="inline buy">
          <button class="btn-purchase nude blue" @click="startOrder('card')">
            <AppIcon icon="credit_card" /><span>신용카드</span>
          </button>
          <button class="btn-purchase nude green" @click="startOrder('phone')">
            <AppIcon icon="phone_android" /><span>휴대폰</span>
          </button>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-8 col-lg-8">
        <div class="product">
          <h3 class="title">{{ product.name }}</h3>
          <div class="hr"></div>
          <div class="info">
            <div class="base">
              <h5 class="rate">{{ product.discountRate.toFixed(1) }}%</h5>
              <h5 class="price">{{ format(product.priceKrWon) }}원</h5>
            </div>
            <div class="real">
              <h3 class="price">{{ format(product.price) }} 원</h3>
            </div>
          </div>
          <div class="hr"></div>
        </div>
        <section class="guide">
          <h3>이용 안내</h3>
          <ul>
            <li>이용권 1개당 2명의 자녀 등록이 가능합니다.</li>
            <li>이용권은 구매 즉시 적용됩니다.</li>
            <li>
              이용권 적용 후 남은 무료 체험 기간이 적용됩니다. (예, 3일 무료
              체험 후 이용권 신청시 100일 이용 후 + 4일 무료 체험일 추가됨)
            </li>
            <li>
              사용 중인 이용권이 있는 경우, 동일 계정에서 이용권 추가 구매시
              사용기간이 연장됩니다.
            </li>
            <li>이용권 상품은 기한이 끝나도 자동 연장되지 않습니다.</li>
            <li>
              이용권 되팔기로 인해 발생하는 모든 분쟁 요소는 책임지지 않습니다.
            </li>
          </ul>
        </section>
        <section class="refound">
          <h3>환불 정책 안내</h3>
          <ul>
            <li>
              환불 요청은 승인일로부터 7일 이내에 제기해 주셔야 하며,이 경우
              결제와 동일한 수단으로 환불됩니다.
            </li>
            <li>
              7일 이후 환불은 결제금액의 10%의 위약금과 정상가를 기준으로 한
              사용일수에 따른 이용금액을 제한 후 환불됩니다. 예 : 90일 사용권
              구매 후 20일 사용후 환불시 19,000원 - (1,900원 + 330원 * 20일) =
              10,500원 환불
            </li>
            <li>
              콘텐츠의 내용이 표시ㆍ광고 내용과 다르거나 계약내용과 다르게
              이행된 경우에는 당해 콘텐츠를 공급받은 날로부터 3월 이내, 그
              사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 환불받으실 수
              있으며 납입한 금액의 2/3에 대해서 환불합니다.
            </li>
          </ul>
        </section>
        <section class="buy">
          <button class="btn-purchase nude blue" @click="startOrder('card')">
            <AppIcon icon="credit_card" /><span>신용카드</span>
          </button>
          <button class="btn-purchase nude green" @click="startOrder('phone')">
            <AppIcon icon="phone_android" /><span>휴대폰 결제</span>
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import ProductView from "../../components/product/ProductView.vue";
import ActionIcon from "../../components/form/ActionIcon.vue";
import { OrderForm } from "./order-form";
import util from "../../service/util";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import toast from "../../components/toast";
import env from "../../service/env";
import AppIcon from "../../components/AppIcon.vue";

export default {
  components: {
    AppIcon,
    ActionIcon,
    ProductView,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const order = ref(null);
    const product = computed(() => order.value && order.value.product);

    const gotoPurchasePage = () => router.replace("/purchase");
    const format = (money) => util.currency.format(money);

    const handlePaidOrder = () => {
      router.push("/purchase/order/checking");
    };

    const handleFailedOrder = (res) => {
      order.value.reset();
      console.log("[FAILURE]", res);
      toast.warn("결제를 취소했습니다", "결제 취소", 5);
    };
    const startPgOrder = () => {
      const imp = window.IMP;
      imp.init("imp20450844");
      const { method } = order.value;
      const merchant_uid = order.value.getUuid();
      const loginUser = store.getters["user/currentUser"];
      const prod = product.value;
      const { origin } = document.location;

      const redirectUrl = `${origin}/purchase/order/checking`;

      imp.request_pay(
        {
          // param
          pg: env.IMPORT_PGNAME,
          pay_method: method,
          merchant_uid,
          name: prod.name,
          amount: prod.price,
          buyer_email: loginUser.email,
          buyer_name: loginUser.name,
          m_redirect_url: redirectUrl,
          notice_url: env.IMPORT_HOOK,
        },
        (res) => {
          // callback
          if (res.success) {
            handlePaidOrder(res);
            // 결제 성공 시 로직,
          } else {
            handleFailedOrder(res);
          }
        }
      );
    };
    const startOrder = (method) => {
      order.value.prepare(method).then(startPgOrder);
      // imp20450844
    };

    OrderForm.load(route.params.code)
      .then((orderForm) => {
        order.value = orderForm;
      })
      .catch((err) => {
        toast.error("@" + err.cause, "상품 정보 오류", 10);
      });
    return { product, gotoPurchasePage, format, startOrder };
  },
};
</script>

<style lang="scss" scoped>
.container {
  .row.v-top {
    align-items: flex-start;
    & > * {
      padding-top: 16px;
    }
  }
}
.order {
  .back {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    margin-top: 16px;
  }
  .product {
    .title {
      font-weight: 900;
    }
    .info {
      .base {
        display: flex;
        column-gap: 8px;
        // justify-content: flex-end;
        .rate {
          color: #222;
          font-style: italic;
        }
        .price {
          text-decoration: line-through;
          color: #888;
        }
      }
      .real {
        color: #ae0000;
        margin-top: 8px;
        h3 {
          font-weight: 900;
          font-family: Tahoma;
          // text-align: right;
        }
      }
    }
    .hr {
      margin: 16px 0;
      width: 100%;
      text-align: center;
      position: relative;
      display: flex;
      justify-content: center;
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        height: 1px;
        width: 100%;
        background: linear-gradient(
          90deg,
          #ccc 0px,
          #ccc 2px,
          #fff 2px,
          #fff 6px
        );
        background-size: 6px;
        background-repeat: repeat-x;
        z-index: 0;
      }
    }
  }
  section {
    margin-top: 16px;
    h3 {
      font-weight: 900;
      margin-bottom: 8px;
    }
    ul {
      font-size: 14px;
      list-style: decimal;
      li {
        line-height: 1.8;
      }
    }
    button.nude {
      font-size: 1.3rem;
      border-radius: 2rem;
      padding: 8px 16px;
    }
    &.buy {
      margin-bottom: 16px;
    }
  }
  .buy {
    display: flex;
    column-gap: 8px;
    .btn-purchase {
      margin-top: 16px;
      font-size: 1.3rem;
      border-radius: 2rem;
      padding: 8px 16px;
      display: inline-flex;
      align-items: center;
      column-gap: 8px;
    }
    &.inline {
      .btn-purchase {
        font-size: 1rem;
        flex: 1 1 auto;
      }
    }
  }
}
</style>
