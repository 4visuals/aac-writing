import env from "./env";

const ONE_DAY_MILLIS = 24 * 60 * 60 * 1000;
//
const key = {
  /**
   *
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
  dictation: {
    scene: (path) =>
      `https://kr.object.ncloudstorage.com/aacweb/scenes/${path}`,
  },
  // https://kr.object.ncloudstorage.com/aacweb/scenes/a229b38f-3438-410c-afb3-5ad057323bf8.png
  resolveUrl: (picPath) => {
    if (picPath.indexOf("aacweb:") === 0) {
      const uri = picPath.substring("aacweb:".length);
      return path.aacweb.symbol(uri);
    } else {
      return path.dictation.scene(picPath);
    }
  },
};
const time = {
  readableText: (millis) => {
    const divs = [
      { amount: 1000, text: "초" },
      { amount: 60, text: "분" },
      { amount: 60, text: "시간" },
      { amount: 24, text: "일" },
    ];
    let i = 0;
    let diff = millis;
    let suffix = "";
    while (i < divs.length && diff >= divs[i].amount) {
      diff /= divs[i].amount;
      suffix = divs[i].text;
      i++;
    }
    return `${parseInt(diff)} ${suffix}`;
  },
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
    const D =
      epochMillis.constructor === Date ? epochMillis : new Date(epochMillis);
    const mm = ("0" + (D.getMonth() + 1)).slice(-2);
    const dd = ("0" + D.getDate()).slice(-2);
    return `${D.getFullYear()}-${mm}-${dd}`;
  },
  toHMS: (epochMillis) => {
    const D =
      epochMillis.constructor === Date ? epochMillis : new Date(epochMillis);
    const hh = ("0" + D.getHours()).slice(-2);
    const mm = ("0" + D.getMinutes()).slice(-2);
    const ss = ("0" + D.getSeconds()).slice(-2);
    return `${hh}-${mm}-${ss}`;
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
    const parts = hostname.split(".");
    return "pwa" === parts[0];
  },
  isStudentMode: () => {
    const { hostname } = document.location;
    const parts = hostname.split(".");
    if (parts.length === 1 && parts[0] === "localhost") {
      const mode = new URL(document.location).searchParams.get("mode");
      parts[0] = mode || "student";
    }
    return "student" === parts[0];
  },
  isTeacherMode: () => {
    const parts = document.location.hostname.split(".");
    if (parts.length === 1 && parts[0] === "localhost") {
      parts[0] = "kdict";
    }
    return "kdict" === parts[0] || "aacdict" === parts[0];
  },
};
const logger = {
  log: (msg, title) => {
    if (env.devMode) {
      console.log(`[${title || ""}]`, msg);
      console.trace(`[${title || ""}]`);
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

const bindElem = (obj, specs, idx, elem) => {
  if (specs.length === idx) {
    obj.push(elem);
    return;
  }
  const prop = specs[idx];
  if (!obj[prop]) {
    obj[prop] = idx + 1 === specs.length ? [] : {};
  }
  bindElem(obj[prop], specs, idx + 1, elem);
};
const arr = {
  unflat: (arr, target, keyResolver) => {
    const t = target || {};
    arr.forEach((elem) => {
      const specs = keyResolver(elem);
      bindElem(t, specs, 0, elem);
    });
    return t;
  },
};
const valid = {
  y4md: (value) => {
    // check valid yyyy-mm-dd
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }
    const cur = new Date();
    const time = new Date(value);
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();
    const [year, month, date] = value.split("-").map((s) => +s);
    return cur.getFullYear() > y && year === y && month == m && date === d;
  },
};
const currency = {
  format: (amount) => {
    const chr = "" + amount;
    let txt = "";
    let end = chr.length;
    while (end > 0) {
      let start = Math.max(end - 3, 0);
      txt = `,${chr.substring(start, end)}` + txt;
      end = start;
    }
    return txt.substring(1);
  },
};
const vue = {
  parsePath: (route) => route.path.split("/").filter((p) => p.length > 0),
};
/**
 * level, book chapter관련 utility 함수들
 */
const chapter = {
  /**
   * chapter에 속하는 section들의 범위를 나타내는 값(ex: 1 ~ 4 단계)
   * @param {Object} chapter
   * @param {String} suffix
   * @returns
   */
  rangeText: (chapter, suffix = "") => {
    const { sections } = chapter;
    const min = sections[0].level;
    const max = sections[sections.length - 2].level;
    return `${min} - ${max}${suffix}`;
  },
};
export { key, path, time, host, logger, arr, vue, valid, currency, pick };
export default {
  key,
  path,
  time,
  host,
  logger,
  arr,
  vue,
  valid,
  currency,
  pick,
  chapter,
};
