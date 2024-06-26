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
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
        <ProductView
          :product="product"
          theme="red"
          :paymentVisible="false"
          :minified="true"
        />
        <div class="inline buy">
          <button
            :disabled="
              !user || (product.offline && !deliveryInfo) || amount.total === 0
            "
            class="btn-purchase nude blue"
            @click="startOrder('card')"
          >
            <AppIcon icon="credit_card" /><span>신용카드</span>
          </button>
          <!-- <button class="btn-purchase nude green" @click="startOrder('phone')">
            <AppIcon icon="phone_android" /><span>휴대폰</span>
          </button> -->
        </div>
        <div v-if="product.offline && !deliveryInfo" class="alert">
          배송 정보 입력 후 주문 가능합니다.
        </div>
        <div v-if="!user" class="alert">로그인 후 결제 가능합니다.</div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-8">
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
        <section v-if="product.offline" class="refound">
          <h3>수량 및 결제금액</h3>
          <p v-if="amount.total === 0" class="alert">수량을 선택해주세요.</p>
          <div class="total-amount">
            <div class="qtt">
              <select class="field" v-model="amount.qtt">
                <option value="0">수량 선택</option>
                <option v-for="cnt in amount.option" :key="cnt" :value="cnt">
                  {{ cnt }}세트
                </option>
              </select>
            </div>
            <div class="p">
              <h3>
                총 <span class="price">{{ format(amount.total) }}</span> 원
              </h3>
            </div>
          </div>
        </section>
        <section v-if="product.offline" class="refound">
          <h3>배송 정보 입력</h3>
          <div class="delivery">
            <div v-if="deliveryInfo" class="info">
              <p>우){{ deliveryInfo.zipCode }}</p>
              <p>
                {{ deliveryInfo.baseAddress }} {{ deliveryInfo.detailAddress }}
              </p>
              <p>{{ deliveryInfo.receiverName }}</p>
              <p>{{ deliveryInfo.phoneNumber }}</p>
              <button class="nude sm blue" @click="resetDelivery">
                재입력
              </button>
            </div>
            <div v-else>
              <p class="alert">배송 정보 입력 후 주문 가능합니다.</p>
              <button class="nude sm blue" @click="loadAddressMap">
                배송정보
              </button>
            </div>
          </div>
        </section>
        <section class="buy">
          <button
            :disabled="
              !user || (product.offline && !deliveryInfo) || amount.total === 0
            "
            class="btn-purchase nude blue"
            @click="startOrder('card')"
          >
            <AppIcon icon="credit_card" /><span>신용카드</span>
          </button>
          <!-- <button class="btn-purchase nude green" @click="startOrder('phone')">
            <AppIcon icon="phone_android" /><span>휴대폰 결제</span>
          </button> -->
        </section>
        <section v-if="product.offline" class="guide">
          <h3>{{ info.offline.title }}</h3>
          <ul>
            <li v-for="(elem, idx) in info.offline.elems" :key="idx">
              {{ elem }}
            </li>
          </ul>
        </section>
        <section v-if="!product.offline" class="guide">
          <h3>{{ info.usage.title }}</h3>
          <ul>
            <li v-for="(elem, idx) in info.usage.elems" :key="idx">
              {{ elem }}
            </li>
          </ul>
        </section>
        <section v-if="!product.offline" class="refound">
          <h3>{{ info.refund.title }}</h3>
          <ul>
            <li v-for="(elem, idx) in info.refund.elems" :key="idx">
              {{ elem }}
            </li>
          </ul>
        </section>
        <div v-if="!user" class="alert">로그인 후 결제 가능합니다.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, shallowRef, reactive, watch } from "vue";
import ProductView from "../../components/product/ProductView.vue";
import ActionIcon from "../../components/form/ActionIcon.vue";
import { OrderForm } from "./order-form";
import util from "../../service/util";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import toast from "../../components/toast";
import env from "../../service/env";
import AppIcon from "../../components/AppIcon.vue";
import modal from "@/components/modal";
import AddressMapView from "../../components/map/AddressMapView.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const user = computed(() => store.getters["user/currentUser"]);
/** @type {import('vue').Ref<OrderForm>} */
const order = ref(null);
const product = computed(() => order.value && order.value.product);
const amount = reactive({
  qtt: 0,
  total: 0,
  option: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
});
const deliveryInfo = shallowRef(undefined);

const info = {
  usage: {
    title: "이용 안내",
    elems: `이용권 1매당 1명의 학생을 등록합니다.
이용권은 학생과 연결될 때부터 적용됩니다.
사용중인 이용권이 만료된 후 새 이용권에 기존 학생을 연결하여 사용합니다.
이용권 상품은 기한이 끝나도 자동 연장되지 않습니다.
이용권 되팔기로 인해 발생하는 모든 분쟁 요소는 책임지지 않습니다.`.split("\n"),
  },
  refund: {
    title: "환불 정책 안내",
    elems:
      `환불 요청은 승인일로 부터 7일 이내에 제기해 주셔야 하며, 이 경우 결제와 동일한 수단으로 환불됩니다.
콘텐츠의 내용이 표시 ・ 광고 내용과 다르거나 계약 내용과 다르게 이행된 경우에는 당해 콘텐츠를 공급받은 날로 부터 3월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 환불 받으실 수 있으며 납입한 금액의 2/3에 대해서 환불합니다.`.split(
        "\n"
      ),
  },
  offline: {
    title: "교환 및 환불정책 안내",
    elems:
      `제품 불량으로 인한 교환 및 환불은 제품 수령 후 7일까지 무상으로 가능합니다. (7일 이후 요청 시 왕복 택배비 고객 부담)
단순 변심에 의한 환불은 제품 수령 후 7일까지만 가능하며, 왕복 배송비는 고객 부담입니다.
훼손 또는 사용 시 교환 및 환불은 불가능합니다.
인쇄상 발생한 동일 색상의 미세한 색상 차이는 불량이 아니며, 이로 인한 교환 및 환불은 단순 변심으로 처리되어 왕복 배송비가 발생되며 이는 고객 부담입니다.`.split(
        "\n"
      ),
  },
};

const gotoPurchasePage = () => router.replace("/purchase");
const format = (money) => util.currency.format(money);

const handlePaidOrder = () => {
  router.push("/purchase/order/checking");
};

const handleFailedOrder = (res) => {
  order.value.reset();
  console.log("[FAILURE]", res);
  toast.warn("결제를 취소했습니다", "결제 취소", 10);
};
const startPgOrder = () => {
  const imp = window.IMP;
  imp.init(env.IMPORT_ACCOUNT);
  const { method } = order.value;
  const merchant_uid = order.value.getUuid();
  const loginUser = store.getters["user/currentUser"];
  const prod = product.value;
  const { origin } = document.location;
  const redirectUrl = `${origin}/purchase/order/checking`;

  const amount = order.value.getPaidAmount();
  const tax_free = order.value.getTaxAmount();
  imp.request_pay(
    {
      // param
      pg: env.IMPORT_PGNAME,
      pay_method: method,
      merchant_uid,
      name: prod.name,
      amount,
      tax_free,
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
  const { qtt, total } = amount;
  order.value
    .prepare(method, deliveryInfo.value, qtt, total)
    .then(startPgOrder)
    .catch((e) => {
      console.log(e);
    });
  // imp20450844
};

const resetDelivery = () => {
  // deliveryInfo.value = undefined;
  loadAddressMap();
};
const updateDeliveryInfo = (
  /** @type {import('../../components/map/map-search').DeliveryInfo} */ delivery
) => {
  deliveryInfo.value = delivery;
  modal.closeModal();
};
const loadAddressMap = () => {
  modal.showModal(AddressMapView, {
    width: "md",
    fill: true,
    events: { delivery: updateDeliveryInfo },
  });
};
OrderForm.load(route.params.code)
  .then((orderForm) => {
    order.value = orderForm;
    const { product } = orderForm;
    if (product.digital) {
      amount.qtt = 1;
      amount.total = product.price;
    }
  })
  .catch((err) => {
    toast.error("@" + err.cause, "상품 정보 오류", 10);
  });

watch(
  () => amount.qtt,
  () => {
    amount.total = amount.qtt * product.value.price;
    console.log(amount.total);
  }
);
watch(order, (orderForm) => {
  if (orderForm.product.tax === "Y") {
    amount.qtt = 1;
    amount.total = orderForm.product.price;
  }
});
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
      &.sm {
        font-size: 1rem;
        padding: 4px 8px;
        border-radius: 4px;
      }
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
  .delivery {
    .info {
      border: 1px solid #2b70ea;
      border-radius: 4px;
      padding: 4px;
      font-size: 1.2rem;
    }
  }
  .total-amount {
    display: flex;
    column-gap: 8px;
    align-items: center;
    h3 {
      color: #ae0000;
      margin: 0;
      font-weight: 900;
      font-family: Tahoma;
      // text-align: right;
    }
  }
  .alert {
    color: crimson;
    font-weight: 600;
    padding-left: 8px;
    margin: 8px 0;
  }
}
</style>
