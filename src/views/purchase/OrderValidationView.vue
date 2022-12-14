<template>
  <div class="container order">
    <transition name="trs-scale-grow" mode="out-in">
      <div class="row" v-if="pending.state === 'LOADING'" key="loading">
        <div class="col-xs-12">
          <div class="loading">
            <p>결제를 확인 중입니다.</p>
            <Loading class="icon" :pending="pending" />
          </div>
        </div>
      </div>
      <div class="row" v-else-if="pending.state === 'DONE'" key="success">
        <div class="col-xs-12">
          <h3 class="mgb-16px">구매 완료</h3>
          <ProductView
            :product="order.product"
            theme="red"
            :paymentVisible="false"
            :minified="true"
          />
        </div>
        <div class="col-xs-12">
          <section>
            <h3 class="mgb-16px">수강증</h3>
            <ul>
              <li v-for="lcs in order._order.items" :key="lcs.uuid">
                <div class="license">
                  <h5>
                    <span class="name">{{ order.product.name }}</span>
                    <span class="uuid">{{ lcs.uuid.substring(4, 12) }}</span>
                  </h5>

                  <p class="dur">
                    <AppIcon icon="watch_later" />{{ ymd(lcs.activatedAt) }} ~
                    {{ ymd(lcs.expiredAt) }}
                  </p>
                  <p v-if="lcs.student_ref">사용 중</p>
                  <p v-else>
                    <AppIcon icon="account_circle" />학생을 등록해주세요
                  </p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
      <div class="row" v-else-if="order && order.isError()" key="error">
        <div class="col-xs-12">
          <section>
            <h3>결제 확인 실패</h3>
            <p class="mgt-16px">결제 확인 과정에서 문제가 발생했습니다.</p>
          </section>
          <section>
            <h3>주문 번호</h3>
            <p class="mgt-16px">{{ order.getUuid() }}</p>
          </section>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { OrderForm } from "./order-form";
import ProductView from "../../components/product/ProductView.vue";
import Loading from "../../components/Loading.vue";
import toast from "../../components/toast";
import util from "../../service/util";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  components: {
    ProductView,
    Loading,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const order = ref(null);
    const pending = reactive({ error: null, state: "LOADING", done: false });

    const ymd = (time) => {
      const t = typeof time === "string" ? Date.parse(time) : time;
      return util.time.toYMD(t);
    };
    const retry = (fn, delay) => {
      setTimeout(fn, delay);
    };

    const loadPendingOrder = () => {
      OrderForm.loadPendingOrder()
        .then((orderForm) => {
          if (orderForm.isPending()) {
            retry(loadPendingOrder, 3000);
          } else if (orderForm.isActive()) {
            order.value = orderForm;
            const { product } = orderForm;
            pending.state = "DONE";
            toast.success(
              `구매하신 상품이 결제되었습니다.(${product.price}원)`,
              product.name,
              10
            );
            store.dispatch("user/autoLogin");
          } else if (orderForm.isError()) {
            order.value = orderForm;
            pending.state = "ERROR";
            pending.error = true;
            toast.error(
              "결제 확인에 실패했습니다.",
              "결제 확인 실패",
              60 * 1000
            );
          }
        })
        .catch((err) => {
          pending.state = "ERROR";
          pending.error = true;
          toast.error("@" + err.cause, "상품 정보 오류", 10);
          router.replace("/");
        });
    };

    onBeforeMount(loadPendingOrder);
    onMounted(() => {});
    return {
      order,
      pending,
      ymd,
    };
  },
};
</script>

<style lang="scss" scoped>
.order {
  margin-top: 5rem;
  margin-bottom: 5rem;
  max-width: 480px;
  font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
  h3 {
    font-weight: 700;
  }
  .loading {
    padding-top: 32px;
    max-width: 400px;
    margin: 0 auto;
    p {
      text-align: center;
      font-size: 1.25rem;
    }
    .icon {
      height: 100px;
      position: relative;
    }
  }
  section {
    margin-top: 2rem;
    h3 {
      font-weight: 700;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      li + li {
        padding-top: 8px;
      }
    }
    .license {
      background-color: #ddf2ff;
      padding: 8px;
      font-size: 1.2rem;
      display: flex;
      flex-direction: column;
      row-gap: 8px;
      // align-items: flex-start;

      font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
      h5 {
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
        font-size: 1.25rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        .name {
          flex: 1 1 auto;
        }
        .uuid {
          flex: 0 0;
          display: inline-flex;
          background-color: #bbe4ff;
          padding: 4px 6px;
          border: 1px solid #62c0ff;
          border-radius: 3px;
          font-size: 1rem;
          color: #494949;
        }
      }
      p {
        display: flex;
        align-items: center;
        column-gap: 8px;
        font-size: 1rem;
        color: #494949 !important;
      }
    }
  }
}
</style>
