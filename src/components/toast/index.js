import toastStore from "./toast-store";
import message from "@/service/message";

const closeByDuration = (toast) => {
  toastStore.closeToast(toast);
};
let uuid = 1000;
class Toast {
  constructor(type, title, msg, duration) {
    this.id = `id${uuid++}`;
    this.type = type;
    this.title = title;
    this.msg = msg;
    this.duration = duration;
    this.t = setTimeout(closeByDuration, duration, this);
  }
  beforeDelete() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
const create = (type, title, msg, durationInSeconds) => {
  if (typeof msg === "string") {
    msg = [msg];
  }
  msg = msg.map((msg) => {
    if (msg.startsWith("@")) {
      const code = msg.substring(1);
      return message.parse(code);
    } else {
      return msg;
    }
  });

  const t = new Toast(type, title, msg, durationInSeconds * 1000);
  toastStore.addToast(t);
};
const info = (msg, title, dur = 3) => create("info", title, msg, dur);
const success = (msg, title, dur = 3) => create("success", title, msg, dur);
const warn = (msg, title, dur = 3) => create("warn", title, msg, dur);
const error = (msg, title, dur = 3) => create("error", title, msg, dur);
export { Toast };
export default {
  info,
  success,
  warn,
  error,
};
