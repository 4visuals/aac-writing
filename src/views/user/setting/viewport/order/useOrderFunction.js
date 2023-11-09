import util from "@/service/util";
export default () => {
  /**
   * 금액에 쉼표 찍어줌
   * @param {string} money
   * @returns
   */
  const formatCurrency = (money) => util.currency.format(money);
  /**
   *
   * @param {string} utcText
   * @returns
   */
  const formatTime = (utcText) => {
    const date = new Date(utcText);
    const [yy, mm, dd] = util.time.toYMD(date).split("-");
    const [h, m] = util.time.toHMS(date).split("-");
    return `${yy}년 ${mm}월 ${dd}일 ${h}시 ${m}분`;
  };
  return { formatCurrency, formatTime };
};
