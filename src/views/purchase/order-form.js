import api from "../../service/api";
import storage from "../../service/storage";
import Product from "../../entity/product";
import License from "../../entity/license";
import Order from "../../entity/order";

// ['imp_uid', 'merchant_uid', 'imp_success', 'error_msg']
class OrderForm {
  /** @type {import("../../components/map/map-search").DeliveryInfo} */
  delivery;
  /**
   * 구매 수량
   */
  qtt;
  /**
   * 백엔드와 검증하기 위한 전체 결제금액
   */
  totalAmount;
  constructor(method, productCode, startTime) {
    this.method = method;
    this.productCode = productCode;
    this.startTime = startTime || new Date().getTime();
    this.product = undefined;
    this._order = null;
    this.delivery = undefined;
  }
  /**
   *
   * @param {string} method 결제 수단 ("card")
   * @param {import("../../components/map/map-search").DeliveryInfo} 배송정보
   * @param {number} qtt 주문 수량(이용권은 1개로 고정되고 책은 사용자가 지정할 수 있음)
   * @returns
   */
  prepare(method, delivery, qtt = 1, totalAmount = 0) {
    this.method = method;
    this.delivery = delivery;
    this.qtt = !qtt ? 1 : qtt;
    this.totalAmount = totalAmount;
    if (this.qtt <= 0) {
      throw new Error("INVALID_QTT");
    }
    if (this.product.offline && !delivery) {
      throw new Error("DELIVERY_REQUIRED");
    }
    return api.order
      .create(this.productCode, this.delivery, this.qtt)
      .then((res) => {
        const { order } = res;
        this._order = new Order(order);
        if (order.totalAmount !== this.totalAmount) {
          // 백엔드에서 계산한 전체 결제금액과 화면에서 계산한 결제금액이 다르다.
          throw new Error("AMOUNT_MISMATCH");
        }
        storage.session.write("kdict.order", {
          code: this.productCode,
          orderUuid: order.orderUuid,
          startAt: new Date().getTime(),
          status: "PENDING",
        });
        return this;
      });
  }
  reset() {
    return api.order.cancel(this.getUuid()).then((res) => {
      this.method = null;
      this._order = null;
      storage.session.remove("kdict.order");
      return res;
    });
  }
  getUuid() {
    return this._order?.orderUuid;
  }
  isPending() {
    return this._order?.pending;
  }
  isActive() {
    return this._order?.active;
  }
  isError() {
    return this._order?.error;
  }
  getPaidAmount() {
    return this._order.totalAmount;
  }
  getTaxAmount() {
    if (this.product.taxFree) {
      return this._order.totalAmount;
    } else {
      return 0;
    }
  }
}
/**
 *
 * @param {OrderForm} orderForm
 * @returns {Promise<OrderForm>}
 */
const loadProduct = (orderForm) =>
  api.product
    .detail({ code: orderForm.productCode })
    .then((res) => {
      orderForm.product = res.product;
      return orderForm;
    })
    .catch((err) => {
      console.log(err);
      orderForm.error = err;
      throw err;
    });
/**
 *
 * @param {string} code
 * @returns {Promise<OrderForm>}
 */
OrderForm.load = (code) => {
  if (code) {
    const form = new OrderForm("card", code);
    return loadProduct(form);
  } else {
    return Promise.reject("NO_ORDER");
  }
};
OrderForm.loadPendingOrder = () => {
  const obj = storage.session.read("kdict.order");
  if (!obj) {
    return Promise.reject({ cause: "NO_PENDING_ORDER" });
  }
  const order = new OrderForm(null, obj.code, obj.startAt);
  return api.order.get(obj.orderUuid).then((res) => {
    order._order = res.order;
    order._order.items = res.order.items.map((lcs) => new License(lcs));
    order.product = new Product(res.order.product);
    return order;
  });
};

export { OrderForm };
