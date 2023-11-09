const statesMap = {
  ATV: { class: "atv", ko: "결제완료" },
  RDY: { class: "rdy", ko: "결제준비" },
};
export default class Order {
  constructor(orderDto) {
    this._dto = orderDto;
    const props = new Set(["receipt_url"]);
    const getters = new Set([
      "isGroupBuyingOrder",
      "isRetailgOrder",
      "isPaidOrder",
      "isPendingOrder",
      "getUuid",
      "getPaymentClass",
      "getPaymentText",
    ]);
    return new Proxy(this, {
      get(target, property, receiver) {
        const { _dto } = target;
        if (props.has(property)) {
          return Reflect.get(target, property);
        }
        if (getters.has(property)) {
          return target[property].bind(target);
        }
        return Reflect.get(_dto, property, receiver);
      },
    });
  }
  get receipt_url() {
    return this._dto.transactionDetail?.receipt_url;
  }
  getPaymentClass() {
    const map = statesMap[this._dto.orderState];
    return map?.class || `err-${this._dto.orderState}`;
  }
  getPaymentText() {
    const map = statesMap[this._dto.orderState];
    return map?.ko || `err-${this._dto.orderState}`;
  }
  getUuid() {
    return this._dto.orderUuid;
  }
  isGroupBuyingOrder() {
    const { salesType } = this._dto.product;
    return salesType === "GB";
  }
  isRetailgOrder() {
    const { salesType } = this._dto.product;
    return salesType === "RT";
  }
  /**
   * 결제 완료된 주문인지
   * @returns { boolean }
   */
  isPaidOrder() {
    return this._dto.orderState === "ATV";
  }
  /**
   * 결제 대기 중인 주문인지
   * @returns {boolean}
   */
  isPendingOrder() {
    return this._dto.orderState === "RDY";
  }
}
