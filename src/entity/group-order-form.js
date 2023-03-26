/**
 * GroupOrderForm
 */
export const GroupOrderState = {
  PND: "대기중",
  CMT: "결제완료",
  CBU: "사용자취소",
  CBS: "시스템취소",
};
export class GroupOrderForm {
  constructor(orderDto) {
    this._dto = orderDto;
    Object.keys(orderDto).forEach((prop) => {
      if (typeof orderDto[prop] === "string") {
        this[prop] = orderDto[prop]
          .replaceAll("<", "＜")
          .replaceAll(">", "＞")
          .replaceAll("&amp;", "&")
          .replaceAll("&lt;", "＜")
          .replaceAll("&gt;", "＞")
          .replaceAll("&quot;", "“");
      } else {
        this[prop] = orderDto[prop];
      }
    });
  }
  get stateText() {
    return GroupOrderState[this.state];
  }
}
