const ymd = (/** @type {Date} */ date) => {
  const y = date.getFullYear();
  const M = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}-${("0" + M).slice(-2)}-${("0" + d).slice(-2)}`;
};
const hms = (/** @type {Date} */ date) => {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return `${("0" + h).slice(-2)}:${("0" + m).slice(-2)}:${("0" + s).slice(-2)}`;
};
export class LicenseGroup {
  /** @type {number} */
  orderNum;
  order;
  /**
   * @type {import('../../entity/license').License[]}
   */
  licenses;
  constructor(orderNum, order) {
    this.orderNum = orderNum;
    this.order = order;
    this.licenses = [];
  }
  /**
   *
   * @param {import('../../entity/license').License} lcs
   */
  add(lcs) {
    this.licenses.push(lcs);
  }
  get orderUuid() {
    return this.order ? this.order.orderUuid : undefined;
  }
  get activatedAt() {
    return this.licenses[0].activatedAt;
  }
  get expiredAt() {
    return this.licenses[0].expiredAt;
  }
  get createdAt() {
    return this.licenses[0].createdAt;
  }
  /**
   * 주문 발생 시간
   */
  get orderTimeText() {
    const { order } = this;
    if (!order) {
      return "---";
    }
    const d = new Date(order.orderTime);
    return ymd(d) + " " + hms(d);
  }
  /**
   * 결제시간
   */
  get paidTimeText() {
    const { order } = this;
    if (!order) {
      return "결제 정보 없음";
    }
    const d = new Date(order.paidTime);
    return ymd(d) + " " + hms(d);
  }
  get expiredDateText() {
    const iosForm = this.expiredAt;
    const d = new Date(iosForm);
    return ymd(d);
  }
  get expiredTimeText() {
    const iosForm = this.expiredAt;
    const d = new Date(iosForm);
    return ymd(d) + " " + hms(d);
  }
  isAlive() {
    return this.order && !this.licenses[0].isExpired();
  }
  isPaid() {
    return this.order && this.order.isPaidOrder();
  }
  isGroupOrder() {
    return this.order && this.order.groupOrder;
  }
  replaceExpiryDate(ymdText) {
    const exp = this.expiredTimeText.replace(" ", "T"); // yyyy-mm-ddThh:mm:ssZ
    const timeText = ymdText + exp.substring(10);
    const date = new Date(timeText);
    return date.toISOString();
  }
  setExpiredTime(utcTimeText) {
    this.licenses.forEach((lcs) => {
      lcs.expiredAt = utcTimeText;
    });
  }
}
