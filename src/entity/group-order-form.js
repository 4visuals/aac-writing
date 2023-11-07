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
  get orgEmailText() {
    return this.orgEmail || "미입력";
  }
  get orgContactInfoText() {
    return this.orgContactInfo || "미입력";
  }
  /**
   * 공동구매 참여 가격
   */
  getPrice() {
    if (typeof this.content === "object") {
      return this.content.price;
    } else {
      return "No Price";
    }
  }
  /**
   * 공동구매 참여 수량
   */
  getQtt() {
    if (typeof this.content === "object") {
      return this.content.qtt;
    } else {
      return "No Qtt";
    }
  }
}

GroupOrderForm.fromGroupBuying = (formDto) => {
  const content = JSON.parse(formDto.content);
  formDto.content = content;
  formDto.forms = [];
  return new GroupOrderForm(formDto);
};
