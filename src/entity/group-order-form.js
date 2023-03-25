/**
 * GroupOrderForm
 */
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
}
