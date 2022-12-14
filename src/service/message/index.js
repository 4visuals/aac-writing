const messages = {
  DUP_USER_ID: "이미 존재하는 아이디입니다.",
  DUP_USER_EMAIL: "이미 존재하는 이메일입니다.",
  MALFORMED_YMD: "날짜 형식은 년(4자리), 월(2자리), 일(2자리) 이어야 합니다.",
  NOT_A_MEMBER: "등록된 회원이 아닙니다. 아이디나 비밀번호를 확인해주세요",
  PASSWORD_LENGTH: "비밀번호는 6~16 글자이여야 합니다.",
  PASSWORD_NO_NUM: "비밀번호는 숫자를 포함해야 합니다.",
  PASSWORD_NO_CHAR: "비밀번호는 영문자를 포함해야 합니다.",
  PASSWORD_FORMAT: "영문자와 숫자를 모두 포함해야 합니다.",
  PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
  USER_ID_FORMAT: "아이디는 영어 소문자를 포함해야 합니다.",
  USER_ID_LENGTH: "아이디는 6글자 이상 16글자 이하여야 합니다.",
  USER_ID_NO_KOR: "아이디는 영어 소문자와 숫자만 허용합니다",
  USER_EMAIL_FORMAT: "이메일 주소를 확인해주세요.",
  USER_EDIT_SUCCESS: "[성공] 정보 수정",
  USER_EDIT_FAILED: "[실패] 정보 수정 실패",
  NULL_USER_NAME: "[실패] 올바른 이름을 입력해주세요.",
  NEW_USER_SUCCESS: "[성공] 학생 생성",
  OUT_OF_LENGTH: "올바른 길이가 아닙니다.",
  SETTING_UNLOCK_FAILED: "비밀번호를 확인해주세요",
  NO_PENDING_ORDER: "대기중인 결제 정보가 없습니다.",
};

const parse = (code) => {
  const msg = messages[code];
  return msg || `요청을 처리하지 못했습니다.(CODE: ${code})`;
};
export default { parse };
