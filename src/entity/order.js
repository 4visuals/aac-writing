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
      "isGroupOrder",
      "isRetailOrder",
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
  /**
   * 단체구매인지(단체 구매 문의에 대한 주문)
   */
  isGroupOrder() {
    const { product, licenseQtt } = this._dto;
    return product.salesType === "RT" && licenseQtt > 1;
  }
  /**
   * 공동구매인지
   * @returns
   */
  isGroupBuyingOrder() {
    const { product } = this._dto;
    return product.salesType === "GB";
  }
  /**
   * 개별 구매인지(구매 페이지에서 1장씩 구매함)
   */
  isRetailOrder() {
    const { product, licenseQtt } = this._dto;
    return product.salesType === "RT" && licenseQtt === 1;
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
