import ActionIcon from "./ActionIcon.vue";
import AacButton from "./AacButton.vue";
import AppButton from "./AppButton.vue";
import StaticButton from "./StaticButton.vue";
import TextField from "./TextField.vue";
import SwitchButton from "./SwitchButton.vue";
import DropDown from "./DropDown.vue";
import TextFieldView from "./TextFieldView.vue";
import util from "@/service/util";
import validators from "./validation";
import message from "../../service/message";

const DEFAULT_FILTER = (v) => v;
class InputForm {
  constructor({
    wid,
    title,
    desc = "",
    status,
    value,
    required,
    error,
    type = "text",
    placeholder,
    filter,
  }) {
    this.wid = wid;
    this.title = title;
    this.desc = desc;
    this.status = status;
    this.value = value;
    this.required = required || false;
    this.error = error;
    this.type = type;
    this.placeholder = placeholder;
    this.filter = filter || DEFAULT_FILTER;
  }
  getErrorMessage() {
    if (!this.error) {
      return null;
    }
    if (this.error.startsWith("@")) {
      const code = this.error.substring(1);
      return message.parse(code);
    } else {
      return this.error;
    }
  }
  reset() {
    if (this.error) {
      this.error = null;
    }
  }
}

InputForm.fromUser = (user) => {
  return [
    new InputForm({
      wid: "name",
      title: "이름",
      desc: "학생 이름을 입력해주세요",
      status: "active",
      value: user.name,
      error: null,
    }),
    new InputForm({
      wid: "birth",
      title: "생일",
      desc: "생일을 입력해주세요(예: 2010-03-15)",
      status: "active",
      value: util.time.toYMD(user.birth),
      error: null,
      filter: (val) => val.replace(/[^0-9-]/g, "").replace(/-{2,}/g, "-"),
    }),
    new InputForm({
      wid: "userId",
      title: "아이디",
      desc: "영문자와 숫자로 아이디를 입력헤주세요.",
      status: "active",
      value: user.userId,
      error: null,
      filter: (val) => val.replace(/[^a-z0-9]/g, ""),
    }),
    new InputForm({
      wid: "pass",
      title: "비밀 번호",
      desc: "학생이 사용할 비밀번호입니다. 영문자와 숫자를 반드시 포함해야 합니다(특수문자 포함 추천).",
      status: "active",
      type: "password",
      value: user.pass,
      error: null,
    }),
  ];
};
export {
  InputForm,
  ActionIcon,
  AacButton,
  AppButton,
  StaticButton,
  TextField,
  TextFieldView,
  SwitchButton,
  DropDown,
  validators,
};
