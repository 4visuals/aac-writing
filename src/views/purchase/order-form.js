import api from "../../service/api";
import storage from "../../service/storage";
import Product from "../../entity/product";
import License from "../../entity/license";

// ['imp_uid', 'merchant_uid', 'imp_success', 'error_msg']
class OrderForm {
  /** @type {import("../../components/map/map-search").DeliveryInfo} */
  delivery;
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
   * @returns
   */
  prepare(method, delivery) {
    this.method = method;
    this.delivery = delivery;
    if (this.product.offline && !delivery) {
      throw new Error("DELIVERY_REQUIRED");
    }
    return api.order.create(this.productCode, this.delivery).then((res) => {
      const { order } = res;
      this._order = order;
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
