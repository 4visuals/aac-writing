const messages = {
  DUP_USER_ID: "이미 존재하는 아이디입니다.",
  MALFORMED_YMD: "날짜 형식은 년(4자리), 월(2자리), 일(2자리) 이어야 합니다.",
  PASSWORD_LENGTH: "비밀번호는 6~16 글자이여야 합니다.",
  PASSWORD_FORMAT: "영문자와 숫자를 모두 포함해야 합니다.",
  USER_EDIT_SUCCESS: "[성공] 정보 수정",
  USER_EDIT_FAILED: "[실패] 정보 수정 실패",
  NULL_USER_NAME: "[실패] 올바른 이름을 입력해주세요.",
  NEW_USER_SUCCESS: "[성공] 학생 생성",
  OUT_OF_LENGTH: "올바른 길이가 아닙니다.",
};

const parse = (code) => {
  const msg = messages[code];
  return msg || `요청을 처리하지 못했습니다.(CODE: ${code})`;
};
export default { parse };
