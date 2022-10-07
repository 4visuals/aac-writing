import util from "@/service/util";
import api from "@/service/api";
import message from "@/service/message";

const user = {
  name: () => Promise.resolve(),
  birth: (value) =>
    new Promise((success, failed) => {
      const ymd = value.split("-");
      if (ymd.length !== 3) {
        failed(message.parse("MALFORMED_YMD"));
      } else if (!util.valid.y4md(value)) {
        failed(message.parse("MALFORMED_YMD"));
      } else {
        success();
      }
    }),
  userId: (value) =>
    new Promise((yes, no) => {
      if (value.length < 4 || value.length > 20) {
        no("아이디는 4글자 이상, 16글자 이하여야 합니다.");
      } else {
        api.user.check
          .id(value)
          .then(() => {
            yes();
          })
          .catch((err) => {
            no(message.parse(err.cause));
          });
      }
    }),
  pass: (pass) => {
    if (pass.length < 6 || pass.length > 16) {
      return Promise.reject("@PASSWORD_LENGTH");
    } else if (!/[a-zA-Z]/.test(pass)) {
      return Promise.reject("@PASSWORD_FORMAT");
    } else if (!/[0-9]/.test(pass)) {
      return Promise.reject("@PASSWORD_FORMAT");
    } else {
      return Promise.resolve();
    }
  },
  pass2: (form, inputForms) => {
    const passForm = inputForms.find((wzd) => wzd.wid === "pass");
    if (passForm.value !== form.value) {
      return Promise.reject("비밀번호가 일치하지 않습니다.");
    } else {
      return Promise.resolve();
    }
  },
};

export default {
  user,
};
