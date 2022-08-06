import env from "./env";

const ONE_DAY_MILLIS = 24 * 60 * 60 * 1000;

const key = {
  /**
   * macOS 크롬에서 한글 입력상태에서 enter를 누르면 key event가 두 번 발생한다.
   * (한글 입력 상태 ON, 한글 입력 상태 OFF)
   * @param {KeyEvent} e
   * @returns composing상태이면 true반환
   */
  isComposing: (e) => e.isComposing,
};

const path = {
  aacweb: {
    symbol: (picPath) => {
      return `https://kr.object.ncloudstorage.com/aacweb/symbols/after${picPath}`;
    },
    scene: (path) =>
      `https://kr.object.ncloudstorage.com/aacweb/dictation/${path}`,
  },
  // https://kr.object.ncloudstorage.com/aacweb/scenes/a229b38f-3438-410c-afb3-5ad057323bf8.png
  resolveUrl: (picPath) => {
    // 일단 이렇게만...
    const uri = picPath.substring("aacweb:".length);
    return path.aacweb.symbol(uri);
  },
};
const time = {
  diff: (before, after) => {
    // as millis
    const btime = before instanceof Date ? before.getTime() : before;
    const atime = after instanceof Date ? after.getTime() : after;
    // const sign = atime - btime < 0 ? -1 : 1;
    let diff = Math.abs(atime - btime); // as seconds
    let suffix = ""; // sign < 0 ? "전" : "후";
    const divs = [
      { amount: 1000, text: "초" },
      { amount: 60, text: "분" },
      { amount: 60, text: "시간" },
      { amount: 24, text: "일" },
    ];
    let i = 0;
    while (i < divs.length && diff >= divs[i].amount) {
      diff /= divs[i].amount;
      suffix = divs[i].text;
      i++;
    }
    // suffix += sign < 0 ? "전" : "후";
    return `${parseInt(diff)} ${suffix}`;
  },
  toYMD: (epochMillis) => {
    const D = new Date(epochMillis);
    const mm = ("0" + (D.getMonth() + 1)).slice(-2);
    const dd = ("0" + D.getDate()).slice(-2);
    return `${D.getFullYear()}-${mm}-${dd}`;
  },
  toYMD2: (epochMillis) => {
    const D = new Date(epochMillis);
    return {
      year: D.getFullYear(),
      month: D.getMonth() + 1,
      date: D.getDate(),
    };
  },
  birthToDate([year, month, date]) {
    const d = new Date();
    d.setFullYear(year);
    d.setMonth(month - 1);
    d.setDate(date);
    return d;
  },
  range: (cur, format) => {
    if (cur instanceof Date) {
      cur = cur.getTime();
    }
    const fmt = format.split(" ");
    const baseYMD = time.toYMD(cur);
    const base = new Date(baseYMD);
    const chunk = ONE_DAY_MILLIS;
    const ranges = [];
    const cnt = parseInt(fmt[0]);
    for (let i = 0; i < cnt; i++) {
      const d = new Date(base.getTime() - i * chunk);
      ranges.push({ text: time.toYMD(d), time: d });
    }
    return ranges.reverse();
  },
  weekRange: (date) => {
    const dow = date.getDay();
    const satOffset = (6 - dow) * ONE_DAY_MILLIS;
    const satMillis = date.getTime() + satOffset; // to saturday of the week
    const saturday = new Date(satMillis);
    return time.range(saturday, "7 day");
  },
  monthRange: (date) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const m2 = ("0" + (m + 1)).slice(-2);
    const nextMOnth = new Date(`${y}-${m2}-01`);
    const lastDate = new Date(nextMOnth.getTime() - ONE_DAY_MILLIS);
    const days = lastDate.getDate();
    return time.range(lastDate, `${days} day`);
  },
};
const host = {
  isPwaMode: () => {
    const { hostname } = document.location;
    return `pwa.${env.HOST}` === hostname;
  },
  isStudentMode: () => {
    const { hostname } = document.location;
    return `student.${env.HOST}` === hostname;
  },
};
const logger = {
  log: (msg, title) => {
    if (env.devMode) {
      console.log(`[${title || ""}]`, msg);
    }
  },
};

const pick = (arr, cnt) => {
  const picked = [...arr];
  for (let k = 0; k < cnt; k++) {
    const i = parseInt(Math.random() * picked.length);
    const j = parseInt(Math.random() * picked.length);
    const tmp = picked[i];
    picked[i] = picked[j];
    picked[j] = tmp;
  }
  return picked.slice(0, cnt);
};

export { key, path, time, host, logger, pick };
export default {
  key,
  path,
  time,
  host,
  logger,
  pick,
};
