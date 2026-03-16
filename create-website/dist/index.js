#!/usr/bin/env node
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS((exports, module) => {
  var p = process || {};
  var argv = p.argv || [];
  var env = p.env || {};
  var isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
  var formatter = (open, close, replace = open) => (input) => {
    let string = "" + input, index = string.indexOf(close, open.length);
    return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
  };
  var replaceClose = (string, close, replace, index) => {
    let result = "", cursor = 0;
    do {
      result += string.substring(cursor, index) + replace;
      cursor = index + close.length;
      index = string.indexOf(close, cursor);
    } while (~index);
    return result + string.substring(cursor);
  };
  var createColors = (enabled = isColorSupported) => {
    let f = enabled ? formatter : () => String;
    return {
      isColorSupported: enabled,
      reset: f("\x1B[0m", "\x1B[0m"),
      bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
      dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
      italic: f("\x1B[3m", "\x1B[23m"),
      underline: f("\x1B[4m", "\x1B[24m"),
      inverse: f("\x1B[7m", "\x1B[27m"),
      hidden: f("\x1B[8m", "\x1B[28m"),
      strikethrough: f("\x1B[9m", "\x1B[29m"),
      black: f("\x1B[30m", "\x1B[39m"),
      red: f("\x1B[31m", "\x1B[39m"),
      green: f("\x1B[32m", "\x1B[39m"),
      yellow: f("\x1B[33m", "\x1B[39m"),
      blue: f("\x1B[34m", "\x1B[39m"),
      magenta: f("\x1B[35m", "\x1B[39m"),
      cyan: f("\x1B[36m", "\x1B[39m"),
      white: f("\x1B[37m", "\x1B[39m"),
      gray: f("\x1B[90m", "\x1B[39m"),
      bgBlack: f("\x1B[40m", "\x1B[49m"),
      bgRed: f("\x1B[41m", "\x1B[49m"),
      bgGreen: f("\x1B[42m", "\x1B[49m"),
      bgYellow: f("\x1B[43m", "\x1B[49m"),
      bgBlue: f("\x1B[44m", "\x1B[49m"),
      bgMagenta: f("\x1B[45m", "\x1B[49m"),
      bgCyan: f("\x1B[46m", "\x1B[49m"),
      bgWhite: f("\x1B[47m", "\x1B[49m"),
      blackBright: f("\x1B[90m", "\x1B[39m"),
      redBright: f("\x1B[91m", "\x1B[39m"),
      greenBright: f("\x1B[92m", "\x1B[39m"),
      yellowBright: f("\x1B[93m", "\x1B[39m"),
      blueBright: f("\x1B[94m", "\x1B[39m"),
      magentaBright: f("\x1B[95m", "\x1B[39m"),
      cyanBright: f("\x1B[96m", "\x1B[39m"),
      whiteBright: f("\x1B[97m", "\x1B[39m"),
      bgBlackBright: f("\x1B[100m", "\x1B[49m"),
      bgRedBright: f("\x1B[101m", "\x1B[49m"),
      bgGreenBright: f("\x1B[102m", "\x1B[49m"),
      bgYellowBright: f("\x1B[103m", "\x1B[49m"),
      bgBlueBright: f("\x1B[104m", "\x1B[49m"),
      bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
      bgCyanBright: f("\x1B[106m", "\x1B[49m"),
      bgWhiteBright: f("\x1B[107m", "\x1B[49m")
    };
  };
  module.exports = createColors();
  module.exports.createColors = createColors;
});

// node_modules/sisteransi/src/index.js
var require_src = __commonJS((exports, module) => {
  var ESC = "\x1B";
  var CSI = `${ESC}[`;
  var beep = "\x07";
  var cursor = {
    to(x, y) {
      if (!y)
        return `${CSI}${x + 1}G`;
      return `${CSI}${y + 1};${x + 1}H`;
    },
    move(x, y) {
      let ret = "";
      if (x < 0)
        ret += `${CSI}${-x}D`;
      else if (x > 0)
        ret += `${CSI}${x}C`;
      if (y < 0)
        ret += `${CSI}${-y}A`;
      else if (y > 0)
        ret += `${CSI}${y}B`;
      return ret;
    },
    up: (count = 1) => `${CSI}${count}A`,
    down: (count = 1) => `${CSI}${count}B`,
    forward: (count = 1) => `${CSI}${count}C`,
    backward: (count = 1) => `${CSI}${count}D`,
    nextLine: (count = 1) => `${CSI}E`.repeat(count),
    prevLine: (count = 1) => `${CSI}F`.repeat(count),
    left: `${CSI}G`,
    hide: `${CSI}?25l`,
    show: `${CSI}?25h`,
    save: `${ESC}7`,
    restore: `${ESC}8`
  };
  var scroll = {
    up: (count = 1) => `${CSI}S`.repeat(count),
    down: (count = 1) => `${CSI}T`.repeat(count)
  };
  var erase = {
    screen: `${CSI}2J`,
    up: (count = 1) => `${CSI}1J`.repeat(count),
    down: (count = 1) => `${CSI}J`.repeat(count),
    line: `${CSI}2K`,
    lineEnd: `${CSI}K`,
    lineStart: `${CSI}1K`,
    lines(count) {
      let clear = "";
      for (let i = 0;i < count; i++)
        clear += this.line + (i < count - 1 ? cursor.up() : "");
      if (count)
        clear += cursor.left;
      return clear;
    }
  };
  module.exports = { cursor, scroll, erase, beep };
});

// node_modules/@clack/core/dist/index.mjs
var import_picocolors = __toESM(require_picocolors(), 1);
var import_sisteransi = __toESM(require_src(), 1);
import { stdout as R, stdin as q } from "node:process";
import * as k from "node:readline";
import ot from "node:readline";
import { ReadStream as J } from "node:tty";
function B(t, e, s) {
  if (!s.some((u) => !u.disabled))
    return t;
  const i = t + e, r = Math.max(s.length - 1, 0), n = i < 0 ? r : i > r ? 0 : i;
  return s[n].disabled ? B(n, e < 0 ? -1 : 1, s) : n;
}
var at = (t) => t === 161 || t === 164 || t === 167 || t === 168 || t === 170 || t === 173 || t === 174 || t >= 176 && t <= 180 || t >= 182 && t <= 186 || t >= 188 && t <= 191 || t === 198 || t === 208 || t === 215 || t === 216 || t >= 222 && t <= 225 || t === 230 || t >= 232 && t <= 234 || t === 236 || t === 237 || t === 240 || t === 242 || t === 243 || t >= 247 && t <= 250 || t === 252 || t === 254 || t === 257 || t === 273 || t === 275 || t === 283 || t === 294 || t === 295 || t === 299 || t >= 305 && t <= 307 || t === 312 || t >= 319 && t <= 322 || t === 324 || t >= 328 && t <= 331 || t === 333 || t === 338 || t === 339 || t === 358 || t === 359 || t === 363 || t === 462 || t === 464 || t === 466 || t === 468 || t === 470 || t === 472 || t === 474 || t === 476 || t === 593 || t === 609 || t === 708 || t === 711 || t >= 713 && t <= 715 || t === 717 || t === 720 || t >= 728 && t <= 731 || t === 733 || t === 735 || t >= 768 && t <= 879 || t >= 913 && t <= 929 || t >= 931 && t <= 937 || t >= 945 && t <= 961 || t >= 963 && t <= 969 || t === 1025 || t >= 1040 && t <= 1103 || t === 1105 || t === 8208 || t >= 8211 && t <= 8214 || t === 8216 || t === 8217 || t === 8220 || t === 8221 || t >= 8224 && t <= 8226 || t >= 8228 && t <= 8231 || t === 8240 || t === 8242 || t === 8243 || t === 8245 || t === 8251 || t === 8254 || t === 8308 || t === 8319 || t >= 8321 && t <= 8324 || t === 8364 || t === 8451 || t === 8453 || t === 8457 || t === 8467 || t === 8470 || t === 8481 || t === 8482 || t === 8486 || t === 8491 || t === 8531 || t === 8532 || t >= 8539 && t <= 8542 || t >= 8544 && t <= 8555 || t >= 8560 && t <= 8569 || t === 8585 || t >= 8592 && t <= 8601 || t === 8632 || t === 8633 || t === 8658 || t === 8660 || t === 8679 || t === 8704 || t === 8706 || t === 8707 || t === 8711 || t === 8712 || t === 8715 || t === 8719 || t === 8721 || t === 8725 || t === 8730 || t >= 8733 && t <= 8736 || t === 8739 || t === 8741 || t >= 8743 && t <= 8748 || t === 8750 || t >= 8756 && t <= 8759 || t === 8764 || t === 8765 || t === 8776 || t === 8780 || t === 8786 || t === 8800 || t === 8801 || t >= 8804 && t <= 8807 || t === 8810 || t === 8811 || t === 8814 || t === 8815 || t === 8834 || t === 8835 || t === 8838 || t === 8839 || t === 8853 || t === 8857 || t === 8869 || t === 8895 || t === 8978 || t >= 9312 && t <= 9449 || t >= 9451 && t <= 9547 || t >= 9552 && t <= 9587 || t >= 9600 && t <= 9615 || t >= 9618 && t <= 9621 || t === 9632 || t === 9633 || t >= 9635 && t <= 9641 || t === 9650 || t === 9651 || t === 9654 || t === 9655 || t === 9660 || t === 9661 || t === 9664 || t === 9665 || t >= 9670 && t <= 9672 || t === 9675 || t >= 9678 && t <= 9681 || t >= 9698 && t <= 9701 || t === 9711 || t === 9733 || t === 9734 || t === 9737 || t === 9742 || t === 9743 || t === 9756 || t === 9758 || t === 9792 || t === 9794 || t === 9824 || t === 9825 || t >= 9827 && t <= 9829 || t >= 9831 && t <= 9834 || t === 9836 || t === 9837 || t === 9839 || t === 9886 || t === 9887 || t === 9919 || t >= 9926 && t <= 9933 || t >= 9935 && t <= 9939 || t >= 9941 && t <= 9953 || t === 9955 || t === 9960 || t === 9961 || t >= 9963 && t <= 9969 || t === 9972 || t >= 9974 && t <= 9977 || t === 9979 || t === 9980 || t === 9982 || t === 9983 || t === 10045 || t >= 10102 && t <= 10111 || t >= 11094 && t <= 11097 || t >= 12872 && t <= 12879 || t >= 57344 && t <= 63743 || t >= 65024 && t <= 65039 || t === 65533 || t >= 127232 && t <= 127242 || t >= 127248 && t <= 127277 || t >= 127280 && t <= 127337 || t >= 127344 && t <= 127373 || t === 127375 || t === 127376 || t >= 127387 && t <= 127404 || t >= 917760 && t <= 917999 || t >= 983040 && t <= 1048573 || t >= 1048576 && t <= 1114109;
var lt = (t) => t === 12288 || t >= 65281 && t <= 65376 || t >= 65504 && t <= 65510;
var ht = (t) => t >= 4352 && t <= 4447 || t === 8986 || t === 8987 || t === 9001 || t === 9002 || t >= 9193 && t <= 9196 || t === 9200 || t === 9203 || t === 9725 || t === 9726 || t === 9748 || t === 9749 || t >= 9800 && t <= 9811 || t === 9855 || t === 9875 || t === 9889 || t === 9898 || t === 9899 || t === 9917 || t === 9918 || t === 9924 || t === 9925 || t === 9934 || t === 9940 || t === 9962 || t === 9970 || t === 9971 || t === 9973 || t === 9978 || t === 9981 || t === 9989 || t === 9994 || t === 9995 || t === 10024 || t === 10060 || t === 10062 || t >= 10067 && t <= 10069 || t === 10071 || t >= 10133 && t <= 10135 || t === 10160 || t === 10175 || t === 11035 || t === 11036 || t === 11088 || t === 11093 || t >= 11904 && t <= 11929 || t >= 11931 && t <= 12019 || t >= 12032 && t <= 12245 || t >= 12272 && t <= 12287 || t >= 12289 && t <= 12350 || t >= 12353 && t <= 12438 || t >= 12441 && t <= 12543 || t >= 12549 && t <= 12591 || t >= 12593 && t <= 12686 || t >= 12688 && t <= 12771 || t >= 12783 && t <= 12830 || t >= 12832 && t <= 12871 || t >= 12880 && t <= 19903 || t >= 19968 && t <= 42124 || t >= 42128 && t <= 42182 || t >= 43360 && t <= 43388 || t >= 44032 && t <= 55203 || t >= 63744 && t <= 64255 || t >= 65040 && t <= 65049 || t >= 65072 && t <= 65106 || t >= 65108 && t <= 65126 || t >= 65128 && t <= 65131 || t >= 94176 && t <= 94180 || t === 94192 || t === 94193 || t >= 94208 && t <= 100343 || t >= 100352 && t <= 101589 || t >= 101632 && t <= 101640 || t >= 110576 && t <= 110579 || t >= 110581 && t <= 110587 || t === 110589 || t === 110590 || t >= 110592 && t <= 110882 || t === 110898 || t >= 110928 && t <= 110930 || t === 110933 || t >= 110948 && t <= 110951 || t >= 110960 && t <= 111355 || t === 126980 || t === 127183 || t === 127374 || t >= 127377 && t <= 127386 || t >= 127488 && t <= 127490 || t >= 127504 && t <= 127547 || t >= 127552 && t <= 127560 || t === 127568 || t === 127569 || t >= 127584 && t <= 127589 || t >= 127744 && t <= 127776 || t >= 127789 && t <= 127797 || t >= 127799 && t <= 127868 || t >= 127870 && t <= 127891 || t >= 127904 && t <= 127946 || t >= 127951 && t <= 127955 || t >= 127968 && t <= 127984 || t === 127988 || t >= 127992 && t <= 128062 || t === 128064 || t >= 128066 && t <= 128252 || t >= 128255 && t <= 128317 || t >= 128331 && t <= 128334 || t >= 128336 && t <= 128359 || t === 128378 || t === 128405 || t === 128406 || t === 128420 || t >= 128507 && t <= 128591 || t >= 128640 && t <= 128709 || t === 128716 || t >= 128720 && t <= 128722 || t >= 128725 && t <= 128727 || t >= 128732 && t <= 128735 || t === 128747 || t === 128748 || t >= 128756 && t <= 128764 || t >= 128992 && t <= 129003 || t === 129008 || t >= 129292 && t <= 129338 || t >= 129340 && t <= 129349 || t >= 129351 && t <= 129535 || t >= 129648 && t <= 129660 || t >= 129664 && t <= 129672 || t >= 129680 && t <= 129725 || t >= 129727 && t <= 129733 || t >= 129742 && t <= 129755 || t >= 129760 && t <= 129768 || t >= 129776 && t <= 129784 || t >= 131072 && t <= 196605 || t >= 196608 && t <= 262141;
var O = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/y;
var y = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y;
var L = /\t{1,1000}/y;
var P = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/yu;
var M = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y;
var ct = /\p{M}+/gu;
var ft = { limit: 1 / 0, ellipsis: "" };
var X = (t, e = {}, s = {}) => {
  const i = e.limit ?? 1 / 0, r = e.ellipsis ?? "", n = e?.ellipsisWidth ?? (r ? X(r, ft, s).width : 0), u = s.ansiWidth ?? 0, a = s.controlWidth ?? 0, l = s.tabWidth ?? 8, E = s.ambiguousWidth ?? 1, g = s.emojiWidth ?? 2, m = s.fullWidthWidth ?? 2, A = s.regularWidth ?? 1, V = s.wideWidth ?? 2;
  let h = 0, o = 0, p = t.length, v = 0, F = false, d = p, b = Math.max(0, i - n), C = 0, w = 0, c = 0, f = 0;
  t:
    for (;; ) {
      if (w > C || o >= p && o > h) {
        const ut = t.slice(C, w) || t.slice(h, o);
        v = 0;
        for (const Y of ut.replaceAll(ct, "")) {
          const $ = Y.codePointAt(0) || 0;
          if (lt($) ? f = m : ht($) ? f = V : E !== A && at($) ? f = E : f = A, c + f > b && (d = Math.min(d, Math.max(C, h) + v)), c + f > i) {
            F = true;
            break t;
          }
          v += Y.length, c += f;
        }
        C = w = 0;
      }
      if (o >= p)
        break;
      if (M.lastIndex = o, M.test(t)) {
        if (v = M.lastIndex - o, f = v * A, c + f > b && (d = Math.min(d, o + Math.floor((b - c) / A))), c + f > i) {
          F = true;
          break;
        }
        c += f, C = h, w = o, o = h = M.lastIndex;
        continue;
      }
      if (O.lastIndex = o, O.test(t)) {
        if (c + u > b && (d = Math.min(d, o)), c + u > i) {
          F = true;
          break;
        }
        c += u, C = h, w = o, o = h = O.lastIndex;
        continue;
      }
      if (y.lastIndex = o, y.test(t)) {
        if (v = y.lastIndex - o, f = v * a, c + f > b && (d = Math.min(d, o + Math.floor((b - c) / a))), c + f > i) {
          F = true;
          break;
        }
        c += f, C = h, w = o, o = h = y.lastIndex;
        continue;
      }
      if (L.lastIndex = o, L.test(t)) {
        if (v = L.lastIndex - o, f = v * l, c + f > b && (d = Math.min(d, o + Math.floor((b - c) / l))), c + f > i) {
          F = true;
          break;
        }
        c += f, C = h, w = o, o = h = L.lastIndex;
        continue;
      }
      if (P.lastIndex = o, P.test(t)) {
        if (c + g > b && (d = Math.min(d, o)), c + g > i) {
          F = true;
          break;
        }
        c += g, C = h, w = o, o = h = P.lastIndex;
        continue;
      }
      o += 1;
    }
  return { width: F ? b : c, index: F ? d : p, truncated: F, ellipsed: F && i >= n };
};
var pt = { limit: 1 / 0, ellipsis: "", ellipsisWidth: 0 };
var S = (t, e = {}) => X(t, pt, e).width;
var W = "\x1B";
var Z = "";
var Ft = 39;
var j = "\x07";
var Q = "[";
var dt = "]";
var tt = "m";
var U = `${dt}8;;`;
var et = new RegExp(`(?:\\${Q}(?<code>\\d+)m|\\${U}(?<uri>.*)${j})`, "y");
var mt = (t) => {
  if (t >= 30 && t <= 37 || t >= 90 && t <= 97)
    return 39;
  if (t >= 40 && t <= 47 || t >= 100 && t <= 107)
    return 49;
  if (t === 1 || t === 2)
    return 22;
  if (t === 3)
    return 23;
  if (t === 4)
    return 24;
  if (t === 7)
    return 27;
  if (t === 8)
    return 28;
  if (t === 9)
    return 29;
  if (t === 0)
    return 0;
};
var st = (t) => `${W}${Q}${t}${tt}`;
var it = (t) => `${W}${U}${t}${j}`;
var gt = (t) => t.map((e) => S(e));
var G = (t, e, s) => {
  const i = e[Symbol.iterator]();
  let r = false, n = false, u = t.at(-1), a = u === undefined ? 0 : S(u), l = i.next(), E = i.next(), g = 0;
  for (;!l.done; ) {
    const m = l.value, A = S(m);
    a + A <= s ? t[t.length - 1] += m : (t.push(m), a = 0), (m === W || m === Z) && (r = true, n = e.startsWith(U, g + 1)), r ? n ? m === j && (r = false, n = false) : m === tt && (r = false) : (a += A, a === s && !E.done && (t.push(""), a = 0)), l = E, E = i.next(), g += m.length;
  }
  u = t.at(-1), !a && u !== undefined && u.length > 0 && t.length > 1 && (t[t.length - 2] += t.pop());
};
var vt = (t) => {
  const e = t.split(" ");
  let s = e.length;
  for (;s > 0 && !(S(e[s - 1]) > 0); )
    s--;
  return s === e.length ? t : e.slice(0, s).join(" ") + e.slice(s).join("");
};
var Et = (t, e, s = {}) => {
  if (s.trim !== false && t.trim() === "")
    return "";
  let i = "", r, n;
  const u = t.split(" "), a = gt(u);
  let l = [""];
  for (const [h, o] of u.entries()) {
    s.trim !== false && (l[l.length - 1] = (l.at(-1) ?? "").trimStart());
    let p = S(l.at(-1) ?? "");
    if (h !== 0 && (p >= e && (s.wordWrap === false || s.trim === false) && (l.push(""), p = 0), (p > 0 || s.trim === false) && (l[l.length - 1] += " ", p++)), s.hard && a[h] > e) {
      const v = e - p, F = 1 + Math.floor((a[h] - v - 1) / e);
      Math.floor((a[h] - 1) / e) < F && l.push(""), G(l, o, e);
      continue;
    }
    if (p + a[h] > e && p > 0 && a[h] > 0) {
      if (s.wordWrap === false && p < e) {
        G(l, o, e);
        continue;
      }
      l.push("");
    }
    if (p + a[h] > e && s.wordWrap === false) {
      G(l, o, e);
      continue;
    }
    l[l.length - 1] += o;
  }
  s.trim !== false && (l = l.map((h) => vt(h)));
  const E = l.join(`
`), g = E[Symbol.iterator]();
  let m = g.next(), A = g.next(), V = 0;
  for (;!m.done; ) {
    const h = m.value, o = A.value;
    if (i += h, h === W || h === Z) {
      et.lastIndex = V + 1;
      const F = et.exec(E)?.groups;
      if (F?.code !== undefined) {
        const d = Number.parseFloat(F.code);
        r = d === Ft ? undefined : d;
      } else
        F?.uri !== undefined && (n = F.uri.length === 0 ? undefined : F.uri);
    }
    const p = r ? mt(r) : undefined;
    o === `
` ? (n && (i += it("")), r && p && (i += st(p))) : h === `
` && (r && p && (i += st(r)), n && (i += it(n))), V += h.length, m = A, A = g.next();
  }
  return i;
};
function K(t, e, s) {
  return String(t).normalize().replaceAll(`\r
`, `
`).split(`
`).map((i) => Et(i, e, s)).join(`
`);
}
var At = ["up", "down", "left", "right", "space", "enter", "cancel"];
var _ = { actions: new Set(At), aliases: new Map([["k", "up"], ["j", "down"], ["h", "left"], ["l", "right"], ["\x03", "cancel"], ["escape", "cancel"]]), messages: { cancel: "Canceled", error: "Something went wrong" }, withGuide: true };
function H(t, e) {
  if (typeof t == "string")
    return _.aliases.get(t) === e;
  for (const s of t)
    if (s !== undefined && H(s, e))
      return true;
  return false;
}
function _t(t, e) {
  if (t === e)
    return;
  const s = t.split(`
`), i = e.split(`
`), r = Math.max(s.length, i.length), n = [];
  for (let u = 0;u < r; u++)
    s[u] !== i[u] && n.push(u);
  return { lines: n, numLinesBefore: s.length, numLinesAfter: i.length, numLines: r };
}
var bt = globalThis.process.platform.startsWith("win");
var z = Symbol("clack:cancel");
function Ct(t) {
  return t === z;
}
function T(t, e) {
  const s = t;
  s.isTTY && s.setRawMode(e);
}
function Bt({ input: t = q, output: e = R, overwrite: s = true, hideCursor: i = true } = {}) {
  const r = k.createInterface({ input: t, output: e, prompt: "", tabSize: 1 });
  k.emitKeypressEvents(t, r), t instanceof J && t.isTTY && t.setRawMode(true);
  const n = (u, { name: a, sequence: l }) => {
    const E = String(u);
    if (H([E, a, l], "cancel")) {
      i && e.write(import_sisteransi.cursor.show), process.exit(0);
      return;
    }
    if (!s)
      return;
    const g = a === "return" ? 0 : -1, m = a === "return" ? -1 : 0;
    k.moveCursor(e, g, m, () => {
      k.clearLine(e, 1, () => {
        t.once("keypress", n);
      });
    });
  };
  return i && e.write(import_sisteransi.cursor.hide), t.once("keypress", n), () => {
    t.off("keypress", n), i && e.write(import_sisteransi.cursor.show), t instanceof J && t.isTTY && !bt && t.setRawMode(false), r.terminal = false, r.close();
  };
}
var rt = (t) => ("columns" in t) && typeof t.columns == "number" ? t.columns : 80;
var nt = (t) => ("rows" in t) && typeof t.rows == "number" ? t.rows : 20;
function xt(t, e, s, i = s) {
  const r = rt(t ?? R);
  return K(e, r - s.length, { hard: true, trim: false }).split(`
`).map((n, u) => `${u === 0 ? i : s}${n}`).join(`
`);
}

class x {
  input;
  output;
  _abortSignal;
  rl;
  opts;
  _render;
  _track = false;
  _prevFrame = "";
  _subscribers = new Map;
  _cursor = 0;
  state = "initial";
  error = "";
  value;
  userInput = "";
  constructor(e, s = true) {
    const { input: i = q, output: r = R, render: n, signal: u, ...a } = e;
    this.opts = a, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = n.bind(this), this._track = s, this._abortSignal = u, this.input = i, this.output = r;
  }
  unsubscribe() {
    this._subscribers.clear();
  }
  setSubscriber(e, s) {
    const i = this._subscribers.get(e) ?? [];
    i.push(s), this._subscribers.set(e, i);
  }
  on(e, s) {
    this.setSubscriber(e, { cb: s });
  }
  once(e, s) {
    this.setSubscriber(e, { cb: s, once: true });
  }
  emit(e, ...s) {
    const i = this._subscribers.get(e) ?? [], r = [];
    for (const n of i)
      n.cb(...s), n.once && r.push(() => i.splice(i.indexOf(n), 1));
    for (const n of r)
      n();
  }
  prompt() {
    return new Promise((e) => {
      if (this._abortSignal) {
        if (this._abortSignal.aborted)
          return this.state = "cancel", this.close(), e(z);
        this._abortSignal.addEventListener("abort", () => {
          this.state = "cancel", this.close();
        }, { once: true });
      }
      this.rl = ot.createInterface({ input: this.input, tabSize: 2, prompt: "", escapeCodeTimeout: 50, terminal: true }), this.rl.prompt(), this.opts.initialUserInput !== undefined && this._setUserInput(this.opts.initialUserInput, true), this.input.on("keypress", this.onKeypress), T(this.input, true), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), T(this.input, false), e(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), T(this.input, false), e(z);
      });
    });
  }
  _isActionKey(e, s) {
    return e === "\t";
  }
  _setValue(e) {
    this.value = e, this.emit("value", this.value);
  }
  _setUserInput(e, s) {
    this.userInput = e ?? "", this.emit("userInput", this.userInput), s && this._track && this.rl && (this.rl.write(this.userInput), this._cursor = this.rl.cursor);
  }
  _clearUserInput() {
    this.rl?.write(null, { ctrl: true, name: "u" }), this._setUserInput("");
  }
  onKeypress(e, s) {
    if (this._track && s.name !== "return" && (s.name && this._isActionKey(e, s) && this.rl?.write(null, { ctrl: true, name: "h" }), this._cursor = this.rl?.cursor ?? 0, this._setUserInput(this.rl?.line)), this.state === "error" && (this.state = "active"), s?.name && (!this._track && _.aliases.has(s.name) && this.emit("cursor", _.aliases.get(s.name)), _.actions.has(s.name) && this.emit("cursor", s.name)), e && (e.toLowerCase() === "y" || e.toLowerCase() === "n") && this.emit("confirm", e.toLowerCase() === "y"), this.emit("key", e?.toLowerCase(), s), s?.name === "return") {
      if (this.opts.validate) {
        const i = this.opts.validate(this.value);
        i && (this.error = i instanceof Error ? i.message : i, this.state = "error", this.rl?.write(this.userInput));
      }
      this.state !== "error" && (this.state = "submit");
    }
    H([e, s?.name, s?.sequence], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), T(this.input, false), this.rl?.close(), this.rl = undefined, this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const e = K(this._prevFrame, process.stdout.columns, { hard: true, trim: false }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, e * -1));
  }
  render() {
    const e = K(this._render(this) ?? "", process.stdout.columns, { hard: true, trim: false });
    if (e !== this._prevFrame) {
      if (this.state === "initial")
        this.output.write(import_sisteransi.cursor.hide);
      else {
        const s = _t(this._prevFrame, e), i = nt(this.output);
        if (this.restoreCursor(), s) {
          const r = Math.max(0, s.numLinesAfter - i), n = Math.max(0, s.numLinesBefore - i);
          let u = s.lines.find((a) => a >= r);
          if (u === undefined) {
            this._prevFrame = e;
            return;
          }
          if (s.lines.length === 1) {
            this.output.write(import_sisteransi.cursor.move(0, u - n)), this.output.write(import_sisteransi.erase.lines(1));
            const a = e.split(`
`);
            this.output.write(a[u]), this._prevFrame = e, this.output.write(import_sisteransi.cursor.move(0, a.length - u - 1));
            return;
          } else if (s.lines.length > 1) {
            if (r < n)
              u = r;
            else {
              const l = u - n;
              l > 0 && this.output.write(import_sisteransi.cursor.move(0, l));
            }
            this.output.write(import_sisteransi.erase.down());
            const a = e.split(`
`).slice(u);
            this.output.write(a.join(`
`)), this._prevFrame = e;
            return;
          }
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(e), this.state === "initial" && (this.state = "active"), this._prevFrame = e;
    }
  }
}
function wt(t, e) {
  if (t === undefined || e.length === 0)
    return 0;
  const s = e.findIndex((i) => i.value === t);
  return s !== -1 ? s : 0;
}
function Dt(t, e) {
  return (e.label ?? String(e.value)).toLowerCase().includes(t.toLowerCase());
}
function St(t, e) {
  if (e)
    return t ? e : e[0];
}

class Vt extends x {
  filteredOptions;
  multiple;
  isNavigating = false;
  selectedValues = [];
  focusedValue;
  #t = 0;
  #s = "";
  #i;
  #e;
  get cursor() {
    return this.#t;
  }
  get userInputWithCursor() {
    if (!this.userInput)
      return import_picocolors.default.inverse(import_picocolors.default.hidden("_"));
    if (this._cursor >= this.userInput.length)
      return `${this.userInput}█`;
    const e = this.userInput.slice(0, this._cursor), [s, ...i] = this.userInput.slice(this._cursor);
    return `${e}${import_picocolors.default.inverse(s)}${i.join("")}`;
  }
  get options() {
    return typeof this.#e == "function" ? this.#e() : this.#e;
  }
  constructor(e) {
    super(e), this.#e = e.options;
    const s = this.options;
    this.filteredOptions = [...s], this.multiple = e.multiple === true, this.#i = e.filter ?? Dt;
    let i;
    if (e.initialValue && Array.isArray(e.initialValue) ? this.multiple ? i = e.initialValue : i = e.initialValue.slice(0, 1) : !this.multiple && this.options.length > 0 && (i = [this.options[0].value]), i)
      for (const r of i) {
        const n = s.findIndex((u) => u.value === r);
        n !== -1 && (this.toggleSelected(r), this.#t = n);
      }
    this.focusedValue = this.options[this.#t]?.value, this.on("key", (r, n) => this.#r(r, n)), this.on("userInput", (r) => this.#n(r));
  }
  _isActionKey(e, s) {
    return e === "\t" || this.multiple && this.isNavigating && s.name === "space" && e !== undefined && e !== "";
  }
  #r(e, s) {
    const i = s.name === "up", r = s.name === "down", n = s.name === "return";
    i || r ? (this.#t = B(this.#t, i ? -1 : 1, this.filteredOptions), this.focusedValue = this.filteredOptions[this.#t]?.value, this.multiple || (this.selectedValues = [this.focusedValue]), this.isNavigating = true) : n ? this.value = St(this.multiple, this.selectedValues) : this.multiple ? this.focusedValue !== undefined && (s.name === "tab" || this.isNavigating && s.name === "space") ? this.toggleSelected(this.focusedValue) : this.isNavigating = false : (this.focusedValue && (this.selectedValues = [this.focusedValue]), this.isNavigating = false);
  }
  deselectAll() {
    this.selectedValues = [];
  }
  toggleSelected(e) {
    this.filteredOptions.length !== 0 && (this.multiple ? this.selectedValues.includes(e) ? this.selectedValues = this.selectedValues.filter((s) => s !== e) : this.selectedValues = [...this.selectedValues, e] : this.selectedValues = [e]);
  }
  #n(e) {
    if (e !== this.#s) {
      this.#s = e;
      const s = this.options;
      e ? this.filteredOptions = s.filter((n) => this.#i(e, n)) : this.filteredOptions = [...s];
      const i = wt(this.focusedValue, this.filteredOptions);
      this.#t = B(i, 0, this.filteredOptions);
      const r = this.filteredOptions[this.#t];
      r && !r.disabled ? this.focusedValue = r.value : this.focusedValue = undefined, this.multiple || (this.focusedValue !== undefined ? this.toggleSelected(this.focusedValue) : this.deselectAll());
    }
  }
}

class kt extends x {
  get cursor() {
    return this.value ? 0 : 1;
  }
  get _value() {
    return this.cursor === 0;
  }
  constructor(e) {
    super(e, false), this.value = !!e.initialValue, this.on("userInput", () => {
      this.value = this._value;
    }), this.on("confirm", (s) => {
      this.output.write(import_sisteransi.cursor.move(0, -1)), this.value = s, this.state = "submit", this.close();
    }), this.on("cursor", () => {
      this.value = !this.value;
    });
  }
}

class yt extends x {
  options;
  cursor = 0;
  #t;
  getGroupItems(e) {
    return this.options.filter((s) => s.group === e);
  }
  isGroupSelected(e) {
    const s = this.getGroupItems(e), i = this.value;
    return i === undefined ? false : s.every((r) => i.includes(r.value));
  }
  toggleValue() {
    const e = this.options[this.cursor];
    if (this.value === undefined && (this.value = []), e.group === true) {
      const s = e.value, i = this.getGroupItems(s);
      this.isGroupSelected(s) ? this.value = this.value.filter((r) => i.findIndex((n) => n.value === r) === -1) : this.value = [...this.value, ...i.map((r) => r.value)], this.value = Array.from(new Set(this.value));
    } else {
      const s = this.value.includes(e.value);
      this.value = s ? this.value.filter((i) => i !== e.value) : [...this.value, e.value];
    }
  }
  constructor(e) {
    super(e, false);
    const { options: s } = e;
    this.#t = e.selectableGroups !== false, this.options = Object.entries(s).flatMap(([i, r]) => [{ value: i, group: true, label: i }, ...r.map((n) => ({ ...n, group: i }))]), this.value = [...e.initialValues ?? []], this.cursor = Math.max(this.options.findIndex(({ value: i }) => i === e.cursorAt), this.#t ? 0 : 1), this.on("cursor", (i) => {
      switch (i) {
        case "left":
        case "up": {
          this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
          const r = this.options[this.cursor]?.group === true;
          !this.#t && r && (this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1);
          break;
        }
        case "down":
        case "right": {
          this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
          const r = this.options[this.cursor]?.group === true;
          !this.#t && r && (this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1);
          break;
        }
        case "space":
          this.toggleValue();
          break;
      }
    });
  }
}
class Wt extends x {
  options;
  cursor = 0;
  get _selectedValue() {
    return this.options[this.cursor];
  }
  changeValue() {
    this.value = this._selectedValue.value;
  }
  constructor(e) {
    super(e, false), this.options = e.options;
    const s = this.options.findIndex(({ value: r }) => r === e.initialValue), i = s === -1 ? 0 : s;
    this.cursor = this.options[i].disabled ? B(i, 1, this.options) : i, this.changeValue(), this.on("cursor", (r) => {
      switch (r) {
        case "left":
        case "up":
          this.cursor = B(this.cursor, -1, this.options);
          break;
        case "down":
        case "right":
          this.cursor = B(this.cursor, 1, this.options);
          break;
      }
      this.changeValue();
    });
  }
}
class $t extends x {
  get userInputWithCursor() {
    if (this.state === "submit")
      return this.userInput;
    const e = this.userInput;
    if (this.cursor >= e.length)
      return `${this.userInput}█`;
    const s = e.slice(0, this.cursor), [i, ...r] = e.slice(this.cursor);
    return `${s}${import_picocolors.default.inverse(i)}${r.join("")}`;
  }
  get cursor() {
    return this._cursor;
  }
  constructor(e) {
    super({ ...e, initialUserInput: e.initialUserInput ?? e.initialValue }), this.on("userInput", (s) => {
      this._setValue(s);
    }), this.on("finalize", () => {
      this.value || (this.value = e.defaultValue), this.value === undefined && (this.value = "");
    });
  }
}

// node_modules/@clack/prompts/dist/index.mjs
var import_picocolors2 = __toESM(require_picocolors(), 1);
import N2 from "node:process";
var import_sisteransi2 = __toESM(require_src(), 1);
function me() {
  return N2.platform !== "win32" ? N2.env.TERM !== "linux" : !!N2.env.CI || !!N2.env.WT_SESSION || !!N2.env.TERMINUS_SUBLIME || N2.env.ConEmuTask === "{cmd::Cmder}" || N2.env.TERM_PROGRAM === "Terminus-Sublime" || N2.env.TERM_PROGRAM === "vscode" || N2.env.TERM === "xterm-256color" || N2.env.TERM === "alacritty" || N2.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
var et2 = me();
var ct2 = () => process.env.CI === "true";
var C = (t, r) => et2 ? t : r;
var Rt = C("◆", "*");
var dt2 = C("■", "x");
var $t2 = C("▲", "x");
var V = C("◇", "o");
var ht2 = C("┌", "T");
var d = C("│", "|");
var x2 = C("└", "—");
var Ot = C("┐", "T");
var Pt = C("┘", "—");
var Q2 = C("●", ">");
var H2 = C("○", " ");
var st2 = C("◻", "[•]");
var U2 = C("◼", "[+]");
var q2 = C("◻", "[ ]");
var Nt = C("▪", "•");
var rt2 = C("─", "-");
var mt2 = C("╮", "+");
var Wt2 = C("├", "+");
var pt2 = C("╯", "+");
var gt2 = C("╰", "+");
var Lt2 = C("╭", "+");
var ft2 = C("●", "•");
var Ft2 = C("◆", "*");
var yt2 = C("▲", "!");
var Et2 = C("■", "x");
var W2 = (t) => {
  switch (t) {
    case "initial":
    case "active":
      return import_picocolors2.default.cyan(Rt);
    case "cancel":
      return import_picocolors2.default.red(dt2);
    case "error":
      return import_picocolors2.default.yellow($t2);
    case "submit":
      return import_picocolors2.default.green(V);
  }
};
var vt2 = (t) => {
  switch (t) {
    case "initial":
    case "active":
      return import_picocolors2.default.cyan(d);
    case "cancel":
      return import_picocolors2.default.red(d);
    case "error":
      return import_picocolors2.default.yellow(d);
    case "submit":
      return import_picocolors2.default.green(d);
  }
};
var pe = (t) => t === 161 || t === 164 || t === 167 || t === 168 || t === 170 || t === 173 || t === 174 || t >= 176 && t <= 180 || t >= 182 && t <= 186 || t >= 188 && t <= 191 || t === 198 || t === 208 || t === 215 || t === 216 || t >= 222 && t <= 225 || t === 230 || t >= 232 && t <= 234 || t === 236 || t === 237 || t === 240 || t === 242 || t === 243 || t >= 247 && t <= 250 || t === 252 || t === 254 || t === 257 || t === 273 || t === 275 || t === 283 || t === 294 || t === 295 || t === 299 || t >= 305 && t <= 307 || t === 312 || t >= 319 && t <= 322 || t === 324 || t >= 328 && t <= 331 || t === 333 || t === 338 || t === 339 || t === 358 || t === 359 || t === 363 || t === 462 || t === 464 || t === 466 || t === 468 || t === 470 || t === 472 || t === 474 || t === 476 || t === 593 || t === 609 || t === 708 || t === 711 || t >= 713 && t <= 715 || t === 717 || t === 720 || t >= 728 && t <= 731 || t === 733 || t === 735 || t >= 768 && t <= 879 || t >= 913 && t <= 929 || t >= 931 && t <= 937 || t >= 945 && t <= 961 || t >= 963 && t <= 969 || t === 1025 || t >= 1040 && t <= 1103 || t === 1105 || t === 8208 || t >= 8211 && t <= 8214 || t === 8216 || t === 8217 || t === 8220 || t === 8221 || t >= 8224 && t <= 8226 || t >= 8228 && t <= 8231 || t === 8240 || t === 8242 || t === 8243 || t === 8245 || t === 8251 || t === 8254 || t === 8308 || t === 8319 || t >= 8321 && t <= 8324 || t === 8364 || t === 8451 || t === 8453 || t === 8457 || t === 8467 || t === 8470 || t === 8481 || t === 8482 || t === 8486 || t === 8491 || t === 8531 || t === 8532 || t >= 8539 && t <= 8542 || t >= 8544 && t <= 8555 || t >= 8560 && t <= 8569 || t === 8585 || t >= 8592 && t <= 8601 || t === 8632 || t === 8633 || t === 8658 || t === 8660 || t === 8679 || t === 8704 || t === 8706 || t === 8707 || t === 8711 || t === 8712 || t === 8715 || t === 8719 || t === 8721 || t === 8725 || t === 8730 || t >= 8733 && t <= 8736 || t === 8739 || t === 8741 || t >= 8743 && t <= 8748 || t === 8750 || t >= 8756 && t <= 8759 || t === 8764 || t === 8765 || t === 8776 || t === 8780 || t === 8786 || t === 8800 || t === 8801 || t >= 8804 && t <= 8807 || t === 8810 || t === 8811 || t === 8814 || t === 8815 || t === 8834 || t === 8835 || t === 8838 || t === 8839 || t === 8853 || t === 8857 || t === 8869 || t === 8895 || t === 8978 || t >= 9312 && t <= 9449 || t >= 9451 && t <= 9547 || t >= 9552 && t <= 9587 || t >= 9600 && t <= 9615 || t >= 9618 && t <= 9621 || t === 9632 || t === 9633 || t >= 9635 && t <= 9641 || t === 9650 || t === 9651 || t === 9654 || t === 9655 || t === 9660 || t === 9661 || t === 9664 || t === 9665 || t >= 9670 && t <= 9672 || t === 9675 || t >= 9678 && t <= 9681 || t >= 9698 && t <= 9701 || t === 9711 || t === 9733 || t === 9734 || t === 9737 || t === 9742 || t === 9743 || t === 9756 || t === 9758 || t === 9792 || t === 9794 || t === 9824 || t === 9825 || t >= 9827 && t <= 9829 || t >= 9831 && t <= 9834 || t === 9836 || t === 9837 || t === 9839 || t === 9886 || t === 9887 || t === 9919 || t >= 9926 && t <= 9933 || t >= 9935 && t <= 9939 || t >= 9941 && t <= 9953 || t === 9955 || t === 9960 || t === 9961 || t >= 9963 && t <= 9969 || t === 9972 || t >= 9974 && t <= 9977 || t === 9979 || t === 9980 || t === 9982 || t === 9983 || t === 10045 || t >= 10102 && t <= 10111 || t >= 11094 && t <= 11097 || t >= 12872 && t <= 12879 || t >= 57344 && t <= 63743 || t >= 65024 && t <= 65039 || t === 65533 || t >= 127232 && t <= 127242 || t >= 127248 && t <= 127277 || t >= 127280 && t <= 127337 || t >= 127344 && t <= 127373 || t === 127375 || t === 127376 || t >= 127387 && t <= 127404 || t >= 917760 && t <= 917999 || t >= 983040 && t <= 1048573 || t >= 1048576 && t <= 1114109;
var ge = (t) => t === 12288 || t >= 65281 && t <= 65376 || t >= 65504 && t <= 65510;
var fe = (t) => t >= 4352 && t <= 4447 || t === 8986 || t === 8987 || t === 9001 || t === 9002 || t >= 9193 && t <= 9196 || t === 9200 || t === 9203 || t === 9725 || t === 9726 || t === 9748 || t === 9749 || t >= 9800 && t <= 9811 || t === 9855 || t === 9875 || t === 9889 || t === 9898 || t === 9899 || t === 9917 || t === 9918 || t === 9924 || t === 9925 || t === 9934 || t === 9940 || t === 9962 || t === 9970 || t === 9971 || t === 9973 || t === 9978 || t === 9981 || t === 9989 || t === 9994 || t === 9995 || t === 10024 || t === 10060 || t === 10062 || t >= 10067 && t <= 10069 || t === 10071 || t >= 10133 && t <= 10135 || t === 10160 || t === 10175 || t === 11035 || t === 11036 || t === 11088 || t === 11093 || t >= 11904 && t <= 11929 || t >= 11931 && t <= 12019 || t >= 12032 && t <= 12245 || t >= 12272 && t <= 12287 || t >= 12289 && t <= 12350 || t >= 12353 && t <= 12438 || t >= 12441 && t <= 12543 || t >= 12549 && t <= 12591 || t >= 12593 && t <= 12686 || t >= 12688 && t <= 12771 || t >= 12783 && t <= 12830 || t >= 12832 && t <= 12871 || t >= 12880 && t <= 19903 || t >= 19968 && t <= 42124 || t >= 42128 && t <= 42182 || t >= 43360 && t <= 43388 || t >= 44032 && t <= 55203 || t >= 63744 && t <= 64255 || t >= 65040 && t <= 65049 || t >= 65072 && t <= 65106 || t >= 65108 && t <= 65126 || t >= 65128 && t <= 65131 || t >= 94176 && t <= 94180 || t === 94192 || t === 94193 || t >= 94208 && t <= 100343 || t >= 100352 && t <= 101589 || t >= 101632 && t <= 101640 || t >= 110576 && t <= 110579 || t >= 110581 && t <= 110587 || t === 110589 || t === 110590 || t >= 110592 && t <= 110882 || t === 110898 || t >= 110928 && t <= 110930 || t === 110933 || t >= 110948 && t <= 110951 || t >= 110960 && t <= 111355 || t === 126980 || t === 127183 || t === 127374 || t >= 127377 && t <= 127386 || t >= 127488 && t <= 127490 || t >= 127504 && t <= 127547 || t >= 127552 && t <= 127560 || t === 127568 || t === 127569 || t >= 127584 && t <= 127589 || t >= 127744 && t <= 127776 || t >= 127789 && t <= 127797 || t >= 127799 && t <= 127868 || t >= 127870 && t <= 127891 || t >= 127904 && t <= 127946 || t >= 127951 && t <= 127955 || t >= 127968 && t <= 127984 || t === 127988 || t >= 127992 && t <= 128062 || t === 128064 || t >= 128066 && t <= 128252 || t >= 128255 && t <= 128317 || t >= 128331 && t <= 128334 || t >= 128336 && t <= 128359 || t === 128378 || t === 128405 || t === 128406 || t === 128420 || t >= 128507 && t <= 128591 || t >= 128640 && t <= 128709 || t === 128716 || t >= 128720 && t <= 128722 || t >= 128725 && t <= 128727 || t >= 128732 && t <= 128735 || t === 128747 || t === 128748 || t >= 128756 && t <= 128764 || t >= 128992 && t <= 129003 || t === 129008 || t >= 129292 && t <= 129338 || t >= 129340 && t <= 129349 || t >= 129351 && t <= 129535 || t >= 129648 && t <= 129660 || t >= 129664 && t <= 129672 || t >= 129680 && t <= 129725 || t >= 129727 && t <= 129733 || t >= 129742 && t <= 129755 || t >= 129760 && t <= 129768 || t >= 129776 && t <= 129784 || t >= 131072 && t <= 196605 || t >= 196608 && t <= 262141;
var At2 = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/y;
var it2 = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y;
var nt2 = /\t{1,1000}/y;
var wt2 = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/yu;
var at2 = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y;
var Fe = /\p{M}+/gu;
var ye = { limit: 1 / 0, ellipsis: "" };
var jt = (t, r = {}, s = {}) => {
  const i = r.limit ?? 1 / 0, a = r.ellipsis ?? "", o = r?.ellipsisWidth ?? (a ? jt(a, ye, s).width : 0), u = s.ansiWidth ?? 0, l = s.controlWidth ?? 0, n = s.tabWidth ?? 8, c = s.ambiguousWidth ?? 1, g = s.emojiWidth ?? 2, F = s.fullWidthWidth ?? 2, p = s.regularWidth ?? 1, E = s.wideWidth ?? 2;
  let $ = 0, m = 0, h = t.length, y2 = 0, f = false, v = h, S2 = Math.max(0, i - o), I2 = 0, B2 = 0, A = 0, w = 0;
  t:
    for (;; ) {
      if (B2 > I2 || m >= h && m > $) {
        const _2 = t.slice(I2, B2) || t.slice($, m);
        y2 = 0;
        for (const D2 of _2.replaceAll(Fe, "")) {
          const T2 = D2.codePointAt(0) || 0;
          if (ge(T2) ? w = F : fe(T2) ? w = E : c !== p && pe(T2) ? w = c : w = p, A + w > S2 && (v = Math.min(v, Math.max(I2, $) + y2)), A + w > i) {
            f = true;
            break t;
          }
          y2 += D2.length, A += w;
        }
        I2 = B2 = 0;
      }
      if (m >= h)
        break;
      if (at2.lastIndex = m, at2.test(t)) {
        if (y2 = at2.lastIndex - m, w = y2 * p, A + w > S2 && (v = Math.min(v, m + Math.floor((S2 - A) / p))), A + w > i) {
          f = true;
          break;
        }
        A += w, I2 = $, B2 = m, m = $ = at2.lastIndex;
        continue;
      }
      if (At2.lastIndex = m, At2.test(t)) {
        if (A + u > S2 && (v = Math.min(v, m)), A + u > i) {
          f = true;
          break;
        }
        A += u, I2 = $, B2 = m, m = $ = At2.lastIndex;
        continue;
      }
      if (it2.lastIndex = m, it2.test(t)) {
        if (y2 = it2.lastIndex - m, w = y2 * l, A + w > S2 && (v = Math.min(v, m + Math.floor((S2 - A) / l))), A + w > i) {
          f = true;
          break;
        }
        A += w, I2 = $, B2 = m, m = $ = it2.lastIndex;
        continue;
      }
      if (nt2.lastIndex = m, nt2.test(t)) {
        if (y2 = nt2.lastIndex - m, w = y2 * n, A + w > S2 && (v = Math.min(v, m + Math.floor((S2 - A) / n))), A + w > i) {
          f = true;
          break;
        }
        A += w, I2 = $, B2 = m, m = $ = nt2.lastIndex;
        continue;
      }
      if (wt2.lastIndex = m, wt2.test(t)) {
        if (A + g > S2 && (v = Math.min(v, m)), A + g > i) {
          f = true;
          break;
        }
        A += g, I2 = $, B2 = m, m = $ = wt2.lastIndex;
        continue;
      }
      m += 1;
    }
  return { width: f ? S2 : A, index: f ? v : h, truncated: f, ellipsed: f && i >= o };
};
var Ee = { limit: 1 / 0, ellipsis: "", ellipsisWidth: 0 };
var M2 = (t, r = {}) => jt(t, Ee, r).width;
var ot2 = "\x1B";
var Gt = "";
var ve = 39;
var Ct2 = "\x07";
var kt2 = "[";
var Ae = "]";
var Vt2 = "m";
var St2 = `${Ae}8;;`;
var Ht = new RegExp(`(?:\\${kt2}(?<code>\\d+)m|\\${St2}(?<uri>.*)${Ct2})`, "y");
var we = (t) => {
  if (t >= 30 && t <= 37 || t >= 90 && t <= 97)
    return 39;
  if (t >= 40 && t <= 47 || t >= 100 && t <= 107)
    return 49;
  if (t === 1 || t === 2)
    return 22;
  if (t === 3)
    return 23;
  if (t === 4)
    return 24;
  if (t === 7)
    return 27;
  if (t === 8)
    return 28;
  if (t === 9)
    return 29;
  if (t === 0)
    return 0;
};
var Ut = (t) => `${ot2}${kt2}${t}${Vt2}`;
var Kt = (t) => `${ot2}${St2}${t}${Ct2}`;
var Ce = (t) => t.map((r) => M2(r));
var It2 = (t, r, s) => {
  const i = r[Symbol.iterator]();
  let a = false, o = false, u = t.at(-1), l = u === undefined ? 0 : M2(u), n = i.next(), c = i.next(), g = 0;
  for (;!n.done; ) {
    const F = n.value, p = M2(F);
    l + p <= s ? t[t.length - 1] += F : (t.push(F), l = 0), (F === ot2 || F === Gt) && (a = true, o = r.startsWith(St2, g + 1)), a ? o ? F === Ct2 && (a = false, o = false) : F === Vt2 && (a = false) : (l += p, l === s && !c.done && (t.push(""), l = 0)), n = c, c = i.next(), g += F.length;
  }
  u = t.at(-1), !l && u !== undefined && u.length > 0 && t.length > 1 && (t[t.length - 2] += t.pop());
};
var Se = (t) => {
  const r = t.split(" ");
  let s = r.length;
  for (;s > 0 && !(M2(r[s - 1]) > 0); )
    s--;
  return s === r.length ? t : r.slice(0, s).join(" ") + r.slice(s).join("");
};
var Ie = (t, r, s = {}) => {
  if (s.trim !== false && t.trim() === "")
    return "";
  let i = "", a, o;
  const u = t.split(" "), l = Ce(u);
  let n = [""];
  for (const [$, m] of u.entries()) {
    s.trim !== false && (n[n.length - 1] = (n.at(-1) ?? "").trimStart());
    let h = M2(n.at(-1) ?? "");
    if ($ !== 0 && (h >= r && (s.wordWrap === false || s.trim === false) && (n.push(""), h = 0), (h > 0 || s.trim === false) && (n[n.length - 1] += " ", h++)), s.hard && l[$] > r) {
      const y2 = r - h, f = 1 + Math.floor((l[$] - y2 - 1) / r);
      Math.floor((l[$] - 1) / r) < f && n.push(""), It2(n, m, r);
      continue;
    }
    if (h + l[$] > r && h > 0 && l[$] > 0) {
      if (s.wordWrap === false && h < r) {
        It2(n, m, r);
        continue;
      }
      n.push("");
    }
    if (h + l[$] > r && s.wordWrap === false) {
      It2(n, m, r);
      continue;
    }
    n[n.length - 1] += m;
  }
  s.trim !== false && (n = n.map(($) => Se($)));
  const c = n.join(`
`), g = c[Symbol.iterator]();
  let F = g.next(), p = g.next(), E = 0;
  for (;!F.done; ) {
    const $ = F.value, m = p.value;
    if (i += $, $ === ot2 || $ === Gt) {
      Ht.lastIndex = E + 1;
      const f = Ht.exec(c)?.groups;
      if (f?.code !== undefined) {
        const v = Number.parseFloat(f.code);
        a = v === ve ? undefined : v;
      } else
        f?.uri !== undefined && (o = f.uri.length === 0 ? undefined : f.uri);
    }
    const h = a ? we(a) : undefined;
    m === `
` ? (o && (i += Kt("")), a && h && (i += Ut(h))) : $ === `
` && (a && h && (i += Ut(a)), o && (i += Kt(o))), E += $.length, F = p, p = g.next();
  }
  return i;
};
function J2(t, r, s) {
  return String(t).normalize().replaceAll(`\r
`, `
`).split(`
`).map((i) => Ie(i, r, s)).join(`
`);
}
var be = (t, r, s, i, a) => {
  let o = r, u = 0;
  for (let l = s;l < i; l++) {
    const n = t[l];
    if (o = o - n.length, u++, o <= a)
      break;
  }
  return { lineCount: o, removals: u };
};
var X2 = (t) => {
  const { cursor: r, options: s, style: i } = t, a = t.output ?? process.stdout, o = rt(a), u = t.columnPadding ?? 0, l = t.rowPadding ?? 4, n = o - u, c = nt(a), g = import_picocolors2.default.dim("..."), F = t.maxItems ?? Number.POSITIVE_INFINITY, p = Math.max(c - l, 0), E = Math.max(Math.min(F, p), 5);
  let $ = 0;
  r >= E - 3 && ($ = Math.max(Math.min(r - E + 3, s.length - E), 0));
  let m = E < s.length && $ > 0, h = E < s.length && $ + E < s.length;
  const y2 = Math.min($ + E, s.length), f = [];
  let v = 0;
  m && v++, h && v++;
  const S2 = $ + (m ? 1 : 0), I2 = y2 - (h ? 1 : 0);
  for (let A = S2;A < I2; A++) {
    const w = J2(i(s[A], A === r), n, { hard: true, trim: false }).split(`
`);
    f.push(w), v += w.length;
  }
  if (v > p) {
    let A = 0, w = 0, _2 = v;
    const D2 = r - S2, T2 = (Y, L2) => be(f, _2, Y, L2, p);
    m ? ({ lineCount: _2, removals: A } = T2(0, D2), _2 > p && ({ lineCount: _2, removals: w } = T2(D2 + 1, f.length))) : ({ lineCount: _2, removals: w } = T2(D2 + 1, f.length), _2 > p && ({ lineCount: _2, removals: A } = T2(0, D2))), A > 0 && (m = true, f.splice(0, A)), w > 0 && (h = true, f.splice(f.length - w, w));
  }
  const B2 = [];
  m && B2.push(g);
  for (const A of f)
    for (const w of A)
      B2.push(w);
  return h && B2.push(g), B2;
};
var Re = (t) => {
  const r = t.active ?? "Yes", s = t.inactive ?? "No";
  return new kt({ active: r, inactive: s, signal: t.signal, input: t.input, output: t.output, initialValue: t.initialValue ?? true, render() {
    const i = t.withGuide ?? _.withGuide, a = `${i ? `${import_picocolors2.default.gray(d)}
` : ""}${W2(this.state)}  ${t.message}
`, o = this.value ? r : s;
    switch (this.state) {
      case "submit": {
        const u = i ? `${import_picocolors2.default.gray(d)}  ` : "";
        return `${a}${u}${import_picocolors2.default.dim(o)}`;
      }
      case "cancel": {
        const u = i ? `${import_picocolors2.default.gray(d)}  ` : "";
        return `${a}${u}${import_picocolors2.default.strikethrough(import_picocolors2.default.dim(o))}${i ? `
${import_picocolors2.default.gray(d)}` : ""}`;
      }
      default: {
        const u = i ? `${import_picocolors2.default.cyan(d)}  ` : "", l = i ? import_picocolors2.default.cyan(x2) : "";
        return `${a}${u}${this.value ? `${import_picocolors2.default.green(Q2)} ${r}` : `${import_picocolors2.default.dim(H2)} ${import_picocolors2.default.dim(r)}`}${t.vertical ? i ? `
${import_picocolors2.default.cyan(d)}  ` : `
` : ` ${import_picocolors2.default.dim("/")} `}${this.value ? `${import_picocolors2.default.dim(H2)} ${import_picocolors2.default.dim(s)}` : `${import_picocolors2.default.green(Q2)} ${s}`}
${l}
`;
      }
    }
  } }).prompt();
};
var R2 = { message: (t = [], { symbol: r = import_picocolors2.default.gray(d), secondarySymbol: s = import_picocolors2.default.gray(d), output: i = process.stdout, spacing: a = 1, withGuide: o } = {}) => {
  const u = [], l = o ?? _.withGuide, n = l ? s : "", c = l ? `${r}  ` : "", g = l ? `${s}  ` : "";
  for (let p = 0;p < a; p++)
    u.push(n);
  const F = Array.isArray(t) ? t : t.split(`
`);
  if (F.length > 0) {
    const [p, ...E] = F;
    p.length > 0 ? u.push(`${c}${p}`) : u.push(l ? r : "");
    for (const $ of E)
      $.length > 0 ? u.push(`${g}${$}`) : u.push(l ? s : "");
  }
  i.write(`${u.join(`
`)}
`);
}, info: (t, r) => {
  R2.message(t, { ...r, symbol: import_picocolors2.default.blue(ft2) });
}, success: (t, r) => {
  R2.message(t, { ...r, symbol: import_picocolors2.default.green(Ft2) });
}, step: (t, r) => {
  R2.message(t, { ...r, symbol: import_picocolors2.default.green(V) });
}, warn: (t, r) => {
  R2.message(t, { ...r, symbol: import_picocolors2.default.yellow(yt2) });
}, warning: (t, r) => {
  R2.warn(t, r);
}, error: (t, r) => {
  R2.message(t, { ...r, symbol: import_picocolors2.default.red(Et2) });
} };
var Ne = (t = "", r) => {
  (r?.output ?? process.stdout).write(`${import_picocolors2.default.gray(x2)}  ${import_picocolors2.default.red(t)}

`);
};
var We = (t = "", r) => {
  (r?.output ?? process.stdout).write(`${import_picocolors2.default.gray(ht2)}  ${t}
`);
};
var Le = (t = "", r) => {
  (r?.output ?? process.stdout).write(`${import_picocolors2.default.gray(d)}
${import_picocolors2.default.gray(x2)}  ${t}

`);
};
var Ge = (t) => import_picocolors2.default.dim(t);
var ke = (t, r, s) => {
  const i = { hard: true, trim: false }, a = J2(t, r, i).split(`
`), o = a.reduce((n, c) => Math.max(M2(c), n), 0), u = a.map(s).reduce((n, c) => Math.max(M2(c), n), 0), l = r - (u - o);
  return J2(t, l, i);
};
var Ve = (t = "", r = "", s) => {
  const i = s?.output ?? N2.stdout, a = s?.withGuide ?? _.withGuide, o = s?.format ?? Ge, u = ["", ...ke(t, rt(i) - 6, o).split(`
`).map(o), ""], l = M2(r), n = Math.max(u.reduce((p, E) => {
    const $ = M2(E);
    return $ > p ? $ : p;
  }, 0), l) + 2, c = u.map((p) => `${import_picocolors2.default.gray(d)}  ${p}${" ".repeat(n - M2(p))}${import_picocolors2.default.gray(d)}`).join(`
`), g = a ? `${import_picocolors2.default.gray(d)}
` : "", F = a ? Wt2 : gt2;
  i.write(`${g}${import_picocolors2.default.green(V)}  ${import_picocolors2.default.reset(r)} ${import_picocolors2.default.gray(rt2.repeat(Math.max(n - l - 1, 1)) + mt2)}
${c}
${import_picocolors2.default.gray(F + rt2.repeat(n + 2) + pt2)}
`);
};
var Ke = import_picocolors2.default.magenta;
var bt2 = ({ indicator: t = "dots", onCancel: r, output: s = process.stdout, cancelMessage: i, errorMessage: a, frames: o = et2 ? ["◒", "◐", "◓", "◑"] : ["•", "o", "O", "0"], delay: u = et2 ? 80 : 120, signal: l, ...n } = {}) => {
  const c = ct2();
  let g, F, p = false, E = false, $ = "", m, h = performance.now();
  const y2 = rt(s), f = n?.styleFrame ?? Ke, v = (b) => {
    const O2 = b > 1 ? a ?? _.messages.error : i ?? _.messages.cancel;
    E = b === 1, p && (L2(O2, b), E && typeof r == "function" && r());
  }, S2 = () => v(2), I2 = () => v(1), B2 = () => {
    process.on("uncaughtExceptionMonitor", S2), process.on("unhandledRejection", S2), process.on("SIGINT", I2), process.on("SIGTERM", I2), process.on("exit", v), l && l.addEventListener("abort", I2);
  }, A = () => {
    process.removeListener("uncaughtExceptionMonitor", S2), process.removeListener("unhandledRejection", S2), process.removeListener("SIGINT", I2), process.removeListener("SIGTERM", I2), process.removeListener("exit", v), l && l.removeEventListener("abort", I2);
  }, w = () => {
    if (m === undefined)
      return;
    c && s.write(`
`);
    const b = J2(m, y2, { hard: true, trim: false }).split(`
`);
    b.length > 1 && s.write(import_sisteransi2.cursor.up(b.length - 1)), s.write(import_sisteransi2.cursor.to(0)), s.write(import_sisteransi2.erase.down());
  }, _2 = (b) => b.replace(/\.+$/, ""), D2 = (b) => {
    const O2 = (performance.now() - b) / 1000, j2 = Math.floor(O2 / 60), G2 = Math.floor(O2 % 60);
    return j2 > 0 ? `[${j2}m ${G2}s]` : `[${G2}s]`;
  }, T2 = n.withGuide ?? _.withGuide, Y = (b = "") => {
    p = true, g = Bt({ output: s }), $ = _2(b), h = performance.now(), T2 && s.write(`${import_picocolors2.default.gray(d)}
`);
    let O2 = 0, j2 = 0;
    B2(), F = setInterval(() => {
      if (c && $ === m)
        return;
      w(), m = $;
      const G2 = f(o[O2]);
      let tt2;
      if (c)
        tt2 = `${G2}  ${$}...`;
      else if (t === "timer")
        tt2 = `${G2}  ${$} ${D2(h)}`;
      else {
        const te = ".".repeat(Math.floor(j2)).slice(0, 3);
        tt2 = `${G2}  ${$}${te}`;
      }
      const Zt = J2(tt2, y2, { hard: true, trim: false });
      s.write(Zt), O2 = O2 + 1 < o.length ? O2 + 1 : 0, j2 = j2 < 4 ? j2 + 0.125 : 0;
    }, u);
  }, L2 = (b = "", O2 = 0, j2 = false) => {
    if (!p)
      return;
    p = false, clearInterval(F), w();
    const G2 = O2 === 0 ? import_picocolors2.default.green(V) : O2 === 1 ? import_picocolors2.default.red(dt2) : import_picocolors2.default.red($t2);
    $ = b ?? $, j2 || (t === "timer" ? s.write(`${G2}  ${$} ${D2(h)}
`) : s.write(`${G2}  ${$}
`)), A(), g();
  };
  return { start: Y, stop: (b = "") => L2(b, 0), message: (b = "") => {
    $ = _2(b ?? $);
  }, cancel: (b = "") => L2(b, 1), error: (b = "") => L2(b, 2), clear: () => L2("", 0, true), get isCancelled() {
    return E;
  } };
};
var zt = { light: C("─", "-"), heavy: C("━", "="), block: C("█", "#") };
var lt2 = (t, r) => t.includes(`
`) ? t.split(`
`).map((s) => r(s)).join(`
`) : r(t);
var Je = (t) => {
  const r = (s, i) => {
    const a = s.label ?? String(s.value);
    switch (i) {
      case "disabled":
        return `${import_picocolors2.default.gray(H2)} ${lt2(a, import_picocolors2.default.gray)}${s.hint ? ` ${import_picocolors2.default.dim(`(${s.hint ?? "disabled"})`)}` : ""}`;
      case "selected":
        return `${lt2(a, import_picocolors2.default.dim)}`;
      case "active":
        return `${import_picocolors2.default.green(Q2)} ${a}${s.hint ? ` ${import_picocolors2.default.dim(`(${s.hint})`)}` : ""}`;
      case "cancelled":
        return `${lt2(a, (o) => import_picocolors2.default.strikethrough(import_picocolors2.default.dim(o)))}`;
      default:
        return `${import_picocolors2.default.dim(H2)} ${lt2(a, import_picocolors2.default.dim)}`;
    }
  };
  return new Wt({ options: t.options, signal: t.signal, input: t.input, output: t.output, initialValue: t.initialValue, render() {
    const s = t.withGuide ?? _.withGuide, i = `${W2(this.state)}  `, a = `${vt2(this.state)}  `, o = xt(t.output, t.message, a, i), u = `${s ? `${import_picocolors2.default.gray(d)}
` : ""}${o}
`;
    switch (this.state) {
      case "submit": {
        const l = s ? `${import_picocolors2.default.gray(d)}  ` : "", n = xt(t.output, r(this.options[this.cursor], "selected"), l);
        return `${u}${n}`;
      }
      case "cancel": {
        const l = s ? `${import_picocolors2.default.gray(d)}  ` : "", n = xt(t.output, r(this.options[this.cursor], "cancelled"), l);
        return `${u}${n}${s ? `
${import_picocolors2.default.gray(d)}` : ""}`;
      }
      default: {
        const l = s ? `${import_picocolors2.default.cyan(d)}  ` : "", n = s ? import_picocolors2.default.cyan(x2) : "", c = u.split(`
`).length, g = s ? 2 : 1;
        return `${u}${l}${X2({ output: t.output, cursor: this.cursor, options: this.options, maxItems: t.maxItems, columnPadding: l.length, rowPadding: c + g, style: (F, p) => r(F, F.disabled ? "disabled" : p ? "active" : "inactive") }).join(`
${l}`)}
${n}
`;
      }
    }
  } }).prompt();
};
var Qt = `${import_picocolors2.default.gray(d)}  `;
var Ze = (t) => new $t({ validate: t.validate, placeholder: t.placeholder, defaultValue: t.defaultValue, initialValue: t.initialValue, output: t.output, signal: t.signal, input: t.input, render() {
  const r = t?.withGuide ?? _.withGuide, s = `${`${r ? `${import_picocolors2.default.gray(d)}
` : ""}${W2(this.state)}  `}${t.message}
`, i = t.placeholder ? import_picocolors2.default.inverse(t.placeholder[0]) + import_picocolors2.default.dim(t.placeholder.slice(1)) : import_picocolors2.default.inverse(import_picocolors2.default.hidden("_")), a = this.userInput ? this.userInputWithCursor : i, o = this.value ?? "";
  switch (this.state) {
    case "error": {
      const u = this.error ? `  ${import_picocolors2.default.yellow(this.error)}` : "", l = r ? `${import_picocolors2.default.yellow(d)}  ` : "", n = r ? import_picocolors2.default.yellow(x2) : "";
      return `${s.trim()}
${l}${a}
${n}${u}
`;
    }
    case "submit": {
      const u = o ? `  ${import_picocolors2.default.dim(o)}` : "", l = r ? import_picocolors2.default.gray(d) : "";
      return `${s}${l}${u}`;
    }
    case "cancel": {
      const u = o ? `  ${import_picocolors2.default.strikethrough(import_picocolors2.default.dim(o))}` : "", l = r ? import_picocolors2.default.gray(d) : "";
      return `${s}${l}${u}${o.trim() ? `
${l}` : ""}`;
    }
    default: {
      const u = r ? `${import_picocolors2.default.cyan(d)}  ` : "", l = r ? import_picocolors2.default.cyan(x2) : "";
      return `${s}${u}${a}
${l}
`;
    }
  }
} }).prompt();

// src/index.ts
var import_picocolors3 = __toESM(require_picocolors(), 1);
import crypto from "crypto";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
var PAYLOAD_ONLY = [
  "src/collections",
  "src/globals",
  "src/components/payload",
  "src/app/(payload)",
  "src/app/api/site-routes",
  "src/lib/syncPages.ts",
  "src/lib/getSiteRoutes.ts",
  "src/lib/generateAltText.ts",
  "src/lib/cms/payload.ts",
  "src/payload.config.ts",
  "src/payload-types.ts",
  "src/app/(payload)/admin/importMap.js"
];
var SANITY_ONLY = [
  "src/sanity",
  "src/app/studio",
  "src/lib/cms/sanity.ts"
];
var PAYLOAD_DEPS = [
  "payload",
  "@payloadcms/db-vercel-postgres",
  "@payloadcms/email-resend",
  "@payloadcms/next",
  "@payloadcms/plugin-import-export",
  "@payloadcms/richtext-lexical",
  "@payloadcms/storage-vercel-blob",
  "@payloadcms/ui"
];
var SANITY_DEPS = [
  "sanity",
  "next-sanity",
  "@sanity/image-url",
  "@sanity/vision"
];
function run(cmd, opts) {
  try {
    return execSync(cmd, { stdio: "pipe", cwd: opts?.cwd }).toString().trim();
  } catch {
    return null;
  }
}
function runInteractive(cmd, opts) {
  execSync(cmd, { stdio: "inherit", cwd: opts?.cwd });
}
function isInstalled(cmd) {
  return run(`which ${cmd}`) !== null;
}
var scaffoldedDir = null;
function abort(message = "Cancelled.") {
  if (scaffoldedDir && fs.existsSync(scaffoldedDir)) {
    fs.rmSync(scaffoldedDir, { recursive: true, force: true });
  }
  Ne(message);
  process.exit(0);
}
async function cancelOrContinue(message) {
  const result = await Re({ message, initialValue: true });
  if (Ct(result))
    abort();
  return result;
}
var TOOLS = {
  gh: {
    name: "GitHub CLI",
    cmd: "gh",
    brewPkg: "gh"
  },
  vercel: {
    name: "Vercel CLI",
    cmd: "vercel",
    bunPkg: "vercel"
  },
  neonctl: {
    name: "Neon CLI",
    cmd: "neonctl",
    bunPkg: "neonctl"
  },
  sanity: {
    name: "Sanity CLI",
    cmd: "sanity",
    bunPkg: "sanity"
  }
};
async function ensureBrew(s) {
  if (isInstalled("brew"))
    return true;
  const shouldInstall = await cancelOrContinue("Homebrew is needed to install some tools. Install it now?");
  if (!shouldInstall)
    return false;
  s.start("Installing Homebrew...");
  try {
    execSync('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', { stdio: "inherit" });
  } catch {
    s.stop("Failed to install Homebrew");
    return false;
  }
  const brewDirs = ["/opt/homebrew/bin", "/opt/homebrew/sbin", "/usr/local/bin", "/usr/local/sbin"];
  const currentPath = process.env.PATH || "";
  const newDirs = brewDirs.filter((d2) => !currentPath.includes(d2));
  if (newDirs.length > 0) {
    process.env.PATH = `${newDirs.join(":")}:${currentPath}`;
  }
  if (!isInstalled("brew")) {
    s.stop("Homebrew installed but not found on PATH. Restart your terminal and try again.");
    return false;
  }
  s.stop("Homebrew installed");
  return true;
}
async function ensureTool(key, s) {
  const tool = TOOLS[key];
  if (isInstalled(tool.cmd))
    return true;
  const shouldInstall = await cancelOrContinue(`${tool.name} (${tool.cmd}) is not installed. Install it now?`);
  if (!shouldInstall)
    return false;
  let installCmd;
  if (tool.bunPkg) {
    installCmd = `bun add -g ${tool.bunPkg}`;
  } else if (tool.brewPkg) {
    if (!await ensureBrew(s))
      return false;
    installCmd = `brew install ${tool.brewPkg}`;
  } else {
    return false;
  }
  s.start(`Installing ${tool.name}...`);
  const result = run(installCmd);
  if (result === null) {
    s.stop(`Failed to install ${tool.name}`);
    return false;
  }
  s.stop(`${tool.name} installed`);
  return true;
}
async function ensureAuth(toolName, checkCmd, authCmd, s) {
  s.start(`Checking ${toolName} authentication...`);
  if (run(checkCmd) !== null) {
    s.stop(`${toolName} authenticated`);
    return true;
  }
  s.stop(`${toolName} not authenticated`);
  const shouldAuth = await cancelOrContinue(`You need to log in to ${toolName}. Log in now?`);
  if (!shouldAuth)
    return false;
  R2.info(`Running ${import_picocolors3.default.cyan(authCmd)} — follow the prompts:`);
  try {
    runInteractive(authCmd);
  } catch {
    R2.error(`${toolName} authentication failed.`);
    return false;
  }
  if (run(checkCmd) !== null) {
    R2.success(`${toolName} authenticated`);
    return true;
  }
  R2.error(`${toolName} still not authenticated.`);
  return false;
}
async function selectGitHubOrg() {
  const output = run('gh api /user/orgs --jq ".[].login"');
  if (!output)
    return null;
  const orgs = output.split(`
`).filter(Boolean);
  if (orgs.length === 0)
    return null;
  const selected = await Je({
    message: "Which GitHub account?",
    options: [
      { value: "__personal__", label: "Personal account" },
      ...orgs.map((org) => ({ value: org, label: org }))
    ]
  });
  if (Ct(selected))
    abort();
  return selected === "__personal__" ? null : selected;
}
async function selectVercelTeam() {
  const output = run("vercel team ls 2>/dev/null");
  if (!output)
    return null;
  const teams = [];
  for (const line of output.split(`
`)) {
    const match = line.match(/[●○]\s+(\S+)\s*(?:\((.+?)\))?/);
    if (match) {
      teams.push({ slug: match[1], name: match[2] || match[1] });
    }
  }
  if (teams.length === 0) {
    for (const line of output.split(`
`)) {
      const trimmed = line.trim();
      if (!trimmed || /^(id|name|slug|─|>|\d+ teams?)/i.test(trimmed))
        continue;
      const parts = trimmed.split(/\s{2,}/);
      if (parts.length >= 1 && /^[a-z0-9][\w-]*$/.test(parts[0])) {
        teams.push({ slug: parts[0], name: parts[1] || parts[0] });
      }
    }
  }
  if (teams.length === 0)
    return null;
  const selected = await Je({
    message: "Which Vercel account?",
    options: [
      { value: "__personal__", label: "Personal account" },
      ...teams.map((t) => ({
        value: t.slug,
        label: t.name !== t.slug ? `${t.name} (${t.slug})` : t.slug
      }))
    ]
  });
  if (Ct(selected))
    abort();
  return selected === "__personal__" ? null : selected;
}
async function selectNeonOrg() {
  const output = run("neonctl orgs list --output json 2>/dev/null");
  if (!output)
    return null;
  try {
    const data = JSON.parse(output);
    const orgs = Array.isArray(data) ? data : data.orgs || data.organizations || [];
    if (orgs.length === 0)
      return null;
    const selected = await Je({
      message: "Which Neon organization?",
      options: [
        { value: "__personal__", label: "Personal account" },
        ...orgs.map((org) => ({
          value: org.id || org.org_id,
          label: org.name || org.id
        }))
      ]
    });
    if (Ct(selected))
      abort();
    return selected === "__personal__" ? null : selected;
  } catch {
    return null;
  }
}
async function setupGitHub(projectName, targetDir, s) {
  if (!await ensureTool("gh", s))
    return null;
  if (!await ensureAuth("GitHub", "gh auth status", "gh auth login", s))
    return null;
  const existing = await Je({
    message: "GitHub repository:",
    options: [
      { value: "create", label: "Create a new repo", hint: projectName },
      { value: "existing", label: "Use an existing repo" },
      { value: "skip", label: "Skip GitHub setup" }
    ]
  });
  if (Ct(existing))
    abort();
  if (existing === "skip")
    return null;
  if (existing === "existing") {
    const repoUrl2 = await Ze({
      message: "Enter the GitHub repo URL:",
      placeholder: `https://github.com/yourorg/${projectName}`,
      validate: (v) => {
        if (!v)
          return "Repo URL is required";
      }
    });
    if (Ct(repoUrl2))
      abort();
    s.start("Linking to existing repo...");
    run(`git remote add origin ${repoUrl2}`, { cwd: targetDir });
    s.stop("Linked to existing repo");
    return repoUrl2;
  }
  const ghOrg = await selectGitHubOrg();
  const visibility = await Je({
    message: "Repository visibility:",
    options: [
      { value: "private", label: "Private" },
      { value: "public", label: "Public" }
    ]
  });
  if (Ct(visibility))
    abort();
  const repoFullName = ghOrg ? `${ghOrg}/${projectName}` : projectName;
  s.start(`Creating GitHub repo ${import_picocolors3.default.cyan(repoFullName)}...`);
  const result = run(`gh repo create ${repoFullName} --${visibility} --source . --remote origin`, { cwd: targetDir });
  if (result === null) {
    s.stop("Failed to create GitHub repo");
    return null;
  }
  s.stop(`GitHub repo created: ${import_picocolors3.default.cyan(repoFullName)}`);
  const repoUrl = run("gh repo view --json url -q .url", { cwd: targetDir });
  return repoUrl;
}
async function setupNeon(projectName, s) {
  if (!await ensureTool("neonctl", s))
    return null;
  if (!await ensureAuth("Neon", "neonctl me", "neonctl auth", s))
    return null;
  const existing = await Je({
    message: "Neon database:",
    options: [
      { value: "create", label: "Create a new database", hint: projectName },
      { value: "existing", label: "Use an existing database" },
      { value: "skip", label: "Skip database setup" }
    ]
  });
  if (Ct(existing))
    abort();
  if (existing === "skip")
    return null;
  if (existing === "existing") {
    const connStr = await Ze({
      message: "Paste your Neon connection string (POSTGRES_URL):",
      placeholder: "postgresql://user:pass@host/dbname?sslmode=require",
      validate: (v) => {
        if (!v)
          return "Connection string is required";
        if (!v.startsWith("postgres"))
          return "Must be a PostgreSQL connection string";
      }
    });
    if (Ct(connStr))
      abort();
    return connStr;
  }
  const neonOrgId = await selectNeonOrg();
  s.start(`Creating Neon database ${import_picocolors3.default.cyan(projectName)}...`);
  const orgFlag = neonOrgId ? ` --org-id ${neonOrgId}` : "";
  const output = run(`neonctl projects create --name ${projectName}${orgFlag} --output json`);
  if (!output) {
    s.stop("Failed to create Neon database");
    R2.warn("Try creating a Neon project manually at https://console.neon.tech");
    return null;
  }
  try {
    const data = JSON.parse(output);
    const connStr = data.connection_uris?.[0]?.connection_uri || data.connection_uri || null;
    if (connStr) {
      s.stop(`Neon database created: ${import_picocolors3.default.cyan(projectName)}`);
      return connStr;
    }
    const projectId = data.project?.id || data.id;
    if (projectId) {
      const csOutput = run(`neonctl connection-string ${projectId}${orgFlag}`);
      if (csOutput && csOutput.startsWith("postgres")) {
        s.stop(`Neon database created: ${import_picocolors3.default.cyan(projectName)}`);
        return csOutput;
      }
    }
    s.stop("Neon project created but couldn't get connection string");
    R2.warn(`Get your connection string from https://console.neon.tech or run:
` + "  neonctl connection-string");
    return null;
  } catch {
    if (output.startsWith("postgres")) {
      s.stop(`Neon database created: ${import_picocolors3.default.cyan(projectName)}`);
      return output;
    }
    s.stop("Neon project created but couldn't parse output");
    R2.info(`Raw output: ${output}`);
    return null;
  }
}
async function setupSanityProject(projectName, s) {
  if (!await ensureTool("sanity", s))
    return null;
  if (!await ensureAuth("Sanity", "sanity whoami", "sanity login", s))
    return null;
  const existing = await Je({
    message: "Sanity project:",
    options: [
      { value: "create", label: "Create a new Sanity project", hint: projectName },
      { value: "existing", label: "Use an existing project" },
      { value: "skip", label: "Skip Sanity setup" }
    ]
  });
  if (Ct(existing))
    abort();
  if (existing === "skip")
    return null;
  if (existing === "existing") {
    const projectId = await Ze({
      message: "Enter your Sanity project ID:",
      placeholder: "abc123xy",
      validate: (v) => {
        if (!v)
          return "Project ID is required";
      }
    });
    if (Ct(projectId))
      abort();
    const dataset = await Ze({
      message: "Dataset name:",
      placeholder: "production",
      initialValue: "production"
    });
    if (Ct(dataset))
      abort();
    return { projectId, dataset };
  }
  s.start(`Creating Sanity project ${import_picocolors3.default.cyan(projectName)}...`);
  const output = run(`sanity projects create "${projectName}" --output json`);
  if (!output) {
    s.stop("Failed to create Sanity project");
    return null;
  }
  try {
    const data = JSON.parse(output);
    const projectId = data.projectId || data.id;
    if (!projectId) {
      s.stop("Sanity project created but couldn't get project ID");
      return null;
    }
    run(`sanity dataset create production --project ${projectId}`);
    s.stop(`Sanity project created: ${import_picocolors3.default.cyan(projectId)}`);
    return { projectId, dataset: "production" };
  } catch {
    s.stop("Sanity project created but couldn't parse output");
    return null;
  }
}
async function setupVercel(projectName, targetDir, repoUrl, s) {
  if (!await ensureTool("vercel", s))
    return { url: null, scope: null };
  if (!await ensureAuth("Vercel", "vercel whoami", "vercel login", s))
    return { url: null, scope: null };
  const existing = await Je({
    message: "Vercel project:",
    options: [
      { value: "create", label: "Create a new Vercel project", hint: projectName },
      { value: "existing", label: "Link to an existing project" },
      { value: "skip", label: "Skip Vercel setup" }
    ]
  });
  if (Ct(existing))
    abort();
  if (existing === "skip")
    return { url: null, scope: null };
  const vercelTeam = await selectVercelTeam();
  const scopeFlag = vercelTeam ? ` --scope ${vercelTeam}` : "";
  if (existing === "existing") {
    s.start("Linking to existing Vercel project...");
    try {
      runInteractive(`vercel link --yes${scopeFlag}`, { cwd: targetDir });
      s.stop("Linked to Vercel project");
    } catch {
      s.stop("Failed to link Vercel project");
      return { url: null, scope: vercelTeam };
    }
    return { url: `https://${projectName}.vercel.app`, scope: vercelTeam };
  }
  s.start(`Creating Vercel project ${import_picocolors3.default.cyan(projectName)}...`);
  const result = run(`vercel link --yes --project ${projectName}${scopeFlag}`, { cwd: targetDir });
  if (result === null) {
    run(`vercel project add ${projectName}${scopeFlag}`, { cwd: targetDir });
    run(`vercel link --yes --project ${projectName}${scopeFlag}`, { cwd: targetDir });
  }
  s.stop(`Vercel project created: ${import_picocolors3.default.cyan(projectName)}`);
  try {
    execSync(`vercel env add NODE_VERSION production preview development --yes${scopeFlag}`, { input: `22.x
`, cwd: targetDir, stdio: ["pipe", "pipe", "pipe"] });
  } catch {}
  if (repoUrl) {
    s.start("Connecting Vercel to GitHub for auto-deploy...");
    const connected = run(`vercel git connect --yes${scopeFlag}`, { cwd: targetDir });
    if (connected !== null) {
      s.stop("Vercel connected to GitHub — pushes will auto-deploy");
    } else {
      s.stop("Could not auto-connect — link GitHub in the Vercel dashboard");
    }
  }
  return { url: `https://${projectName}.vercel.app`, scope: vercelTeam };
}
async function pushEnvToVercel(envVars, targetDir, scope, s) {
  s.start("Pushing environment variables to Vercel...");
  const scopeFlag = scope ? ` --scope ${scope}` : "";
  let pushed = 0;
  for (const [key, value] of Object.entries(envVars)) {
    if (!value)
      continue;
    try {
      execSync(`vercel env add ${key} production preview development --yes${scopeFlag}`, {
        input: value + `
`,
        cwd: targetDir,
        stdio: ["pipe", "pipe", "pipe"]
      });
      pushed++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists"))
        continue;
      R2.warn(`Failed to push ${key}: ${msg.split(`
`)[0]}`);
    }
  }
  s.stop(`Pushed ${pushed} env var(s) to Vercel`);
}
async function askOpenAIKey() {
  const setup = await Je({
    message: "OpenAI API key:",
    options: [
      { value: "enter", label: "Enter API key now" },
      { value: "skip", label: "Skip — set up later" }
    ]
  });
  if (Ct(setup))
    abort();
  if (setup === "skip")
    return null;
  const key = await Ze({
    message: "Paste your OpenAI API key:",
    placeholder: "sk-...",
    validate: (v) => {
      if (!v)
        return "API key is required";
      if (!v.startsWith("sk-"))
        return "OpenAI keys start with sk-";
    }
  });
  if (Ct(key))
    abort();
  return key;
}
function configureTemplate(targetDir, cms, projectName) {
  fs.rmSync(path.join(targetDir, "create-website"), {
    recursive: true,
    force: true
  });
  const filesToDelete = cms === "payload" ? SANITY_ONLY : PAYLOAD_ONLY;
  for (const file of filesToDelete) {
    const fullPath = path.join(targetDir, file);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  }
  const cmsIndexPath = path.join(targetDir, "src/lib/cms/index.ts");
  const adapterImport = cms === "payload" ? 'export { payloadAdapter as cms } from "./payload";' : 'export { sanityAdapter as cms } from "./sanity";';
  fs.writeFileSync(cmsIndexPath, `/**
 * CMS abstraction layer.
 * Frontend pages import from this file — never directly from Payload or Sanity.
 */

export type {
  BlogPost,
  Page,
  CMSImage,
  SiteSettings,
  AnalyticsSettings,
  SocialLinks,
} from "./types";

${adapterImport}
`);
  const pkgPath = path.join(targetDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const depsToRemove = cms === "payload" ? SANITY_DEPS : PAYLOAD_DEPS;
  for (const dep of depsToRemove) {
    delete pkg.dependencies?.[dep];
    delete pkg.devDependencies?.[dep];
  }
  pkg.name = projectName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + `
`);
  if (cms === "sanity") {
    fs.writeFileSync(path.join(targetDir, "next.config.ts"), `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
`);
    const tsconfigPath = path.join(targetDir, "tsconfig.json");
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
    delete tsconfig.compilerOptions?.paths?.["@payload-config"];
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + `
`);
  }
  const homePath = path.join(targetDir, "src/app/(frontend)/page.tsx");
  if (fs.existsSync(homePath)) {
    let homeContent = fs.readFileSync(homePath, "utf-8");
    if (cms === "sanity") {
      homeContent = homeContent.replace('href="/admin"', 'href="/studio"');
    }
    fs.writeFileSync(homePath, homeContent);
  }
  if (cms === "payload") {
    const generalPath = path.join(targetDir, "src/globals/General.ts");
    if (fs.existsSync(generalPath)) {
      let content = fs.readFileSync(generalPath, "utf-8");
      content = content.replace('defaultValue: "My Site"', `defaultValue: "${projectName}"`);
      fs.writeFileSync(generalPath, content);
    }
  } else {
    const settingsPath = path.join(targetDir, "src/sanity/schemas/siteSettings.ts");
    if (fs.existsSync(settingsPath)) {
      let content = fs.readFileSync(settingsPath, "utf-8");
      content = content.replace('initialValue: "My Site"', `initialValue: "${projectName}"`);
      fs.writeFileSync(settingsPath, content);
    }
  }
}
function writeEnvFile(targetDir, cms, envVars) {
  const lines = [
    "# Site",
    `NEXT_PUBLIC_SITE_URL=${envVars.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}`,
    `NEXT_PUBLIC_GA_ID=`,
    ""
  ];
  if (cms === "payload") {
    lines.push("# Payload CMS", `POSTGRES_URL=${envVars.POSTGRES_URL || ""}`, `PAYLOAD_SECRET=${envVars.PAYLOAD_SECRET || ""}`, `BLOB_READ_WRITE_TOKEN=${envVars.BLOB_READ_WRITE_TOKEN || ""}`, `RESEND_API_KEY=${envVars.RESEND_API_KEY || ""}`, `OPENAI_API_KEY=${envVars.OPENAI_API_KEY || ""}`);
  } else {
    lines.push("# Sanity CMS", `NEXT_PUBLIC_SANITY_PROJECT_ID=${envVars.NEXT_PUBLIC_SANITY_PROJECT_ID || ""}`, `NEXT_PUBLIC_SANITY_DATASET=${envVars.NEXT_PUBLIC_SANITY_DATASET || "production"}`, `NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01`, `OPENAI_API_KEY=${envVars.OPENAI_API_KEY || ""}`);
  }
  fs.writeFileSync(path.join(targetDir, ".env.local"), lines.join(`
`) + `
`);
  const exampleLines = lines.map((line) => {
    if (line.startsWith("#") || line === "")
      return line;
    const [key] = line.split("=");
    if (key.startsWith("NEXT_PUBLIC_SANITY_DATASET"))
      return line;
    if (key.startsWith("NEXT_PUBLIC_SANITY_API_VERSION"))
      return line;
    if (key.startsWith("NEXT_PUBLIC_SITE_URL"))
      return `${key}=http://localhost:3000`;
    return `${key}=`;
  });
  fs.writeFileSync(path.join(targetDir, ".env.example"), exampleLines.join(`
`) + `
`);
}
async function main() {
  We(import_picocolors3.default.bgCyan(import_picocolors3.default.black(" create-website ")));
  const projectName = process.argv[2] || await Ze({
    message: "What is your project name?",
    placeholder: "my-site",
    validate: (v) => {
      if (!v)
        return "Project name is required";
      if (!/^[a-z0-9-]+$/.test(v))
        return "Use lowercase letters, numbers, and hyphens only";
    }
  });
  if (Ct(projectName))
    abort();
  const cms = await Je({
    message: "Which CMS do you want to use?",
    options: [
      {
        value: "payload",
        label: "Payload CMS",
        hint: "self-hosted, integrated with Next.js"
      },
      {
        value: "sanity",
        label: "Sanity",
        hint: "hosted service, Sanity Studio"
      }
    ]
  });
  if (Ct(cms))
    abort();
  const targetDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetDir)) {
    Ne(`Directory ${import_picocolors3.default.cyan(projectName)} already exists.`);
    process.exit(1);
  }
  const s = bt2();
  await ensureBrew(s);
  s.start("Cloning starter template...");
  execSync(`git clone --depth 1 https://github.com/sitekickcodes/website-starter.git ${targetDir}`, { stdio: "pipe" });
  fs.rmSync(path.join(targetDir, ".git"), { recursive: true, force: true });
  scaffoldedDir = targetDir;
  s.stop("Cloned template");
  s.start(`Configuring for ${cms === "payload" ? "Payload CMS" : "Sanity"}...`);
  configureTemplate(targetDir, cms, projectName);
  s.stop(`Configured for ${cms === "payload" ? "Payload CMS" : "Sanity"}`);
  s.start("Installing dependencies...");
  try {
    execSync("bun install", { cwd: targetDir, stdio: "pipe" });
    s.stop("Dependencies installed");
  } catch {
    s.stop("Dependency install failed — run `bun install` manually");
  }
  s.start("Initializing git...");
  execSync("git init", { cwd: targetDir, stdio: "pipe" });
  execSync("git add -A", { cwd: targetDir, stdio: "pipe" });
  execSync('git commit -m "Initial commit from create-website"', {
    cwd: targetDir,
    stdio: "pipe"
  });
  s.stop("Git initialized");
  const envVars = {};
  R2.step(import_picocolors3.default.bold("GitHub"));
  const repoUrl = await setupGitHub(projectName, targetDir, s);
  if (cms === "payload") {
    R2.step(import_picocolors3.default.bold("Neon Database"));
    const postgresUrl = await setupNeon(projectName, s);
    if (postgresUrl)
      envVars.POSTGRES_URL = postgresUrl;
    envVars.PAYLOAD_SECRET = crypto.randomBytes(32).toString("hex");
    R2.success("Generated PAYLOAD_SECRET");
  } else {
    R2.step(import_picocolors3.default.bold("Sanity"));
    const sanityInfo = await setupSanityProject(projectName, s);
    if (sanityInfo) {
      envVars.NEXT_PUBLIC_SANITY_PROJECT_ID = sanityInfo.projectId;
      envVars.NEXT_PUBLIC_SANITY_DATASET = sanityInfo.dataset;
    }
  }
  R2.step(import_picocolors3.default.bold("Vercel"));
  const { url: deployUrl, scope: vercelScope } = await setupVercel(projectName, targetDir, repoUrl, s);
  if (deployUrl) {
    envVars.NEXT_PUBLIC_SITE_URL = deployUrl;
  }
  R2.step(import_picocolors3.default.bold("OpenAI (optional)"));
  const openaiKey = await askOpenAIKey();
  if (openaiKey)
    envVars.OPENAI_API_KEY = openaiKey;
  s.start("Writing environment files...");
  writeEnvFile(targetDir, cms, envVars);
  s.stop("Environment files written");
  const isVercelLinked = fs.existsSync(path.join(targetDir, ".vercel"));
  if (isVercelLinked && Object.keys(envVars).length > 0) {
    const shouldPush = await cancelOrContinue("Push environment variables to Vercel?");
    if (shouldPush) {
      await pushEnvToVercel(envVars, targetDir, vercelScope, s);
    }
  }
  run("git add .env.example", { cwd: targetDir });
  run('git commit -m "Add .env.example with project configuration"', {
    cwd: targetDir
  });
  if (repoUrl) {
    s.start("Pushing to GitHub...");
    const pushResult = run("git push -u origin main", { cwd: targetDir });
    if (pushResult !== null) {
      s.stop("Pushed to GitHub — Vercel will auto-deploy");
    } else {
      const pushMaster = run("git push -u origin master", { cwd: targetDir });
      if (pushMaster !== null) {
        s.stop("Pushed to GitHub — Vercel will auto-deploy");
      } else {
        s.stop("Push failed — run `git push` manually");
      }
    }
  }
  const nextSteps = [`cd ${projectName}`];
  const missingVars = [];
  if (cms === "payload") {
    if (!envVars.POSTGRES_URL)
      missingVars.push("POSTGRES_URL");
    if (!envVars.BLOB_READ_WRITE_TOKEN)
      missingVars.push("BLOB_READ_WRITE_TOKEN (Vercel Blob)");
  } else {
    if (!envVars.NEXT_PUBLIC_SANITY_PROJECT_ID)
      missingVars.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  }
  if (missingVars.length > 0) {
    nextSteps.push(`# Set up missing env vars in .env.local:`);
    for (const v of missingVars)
      nextSteps.push(`#   ${v}`);
  }
  if (cms === "payload") {
    nextSteps.push("# Add Vercel Blob storage in the Vercel dashboard", "# Copy BLOB_READ_WRITE_TOKEN to .env.local");
  }
  nextSteps.push("bun dev");
  nextSteps.push(`# Visit ${cms === "payload" ? "/admin" : "/studio"} to create your first user`);
  Ve(nextSteps.join(`
`), "Next steps");
  const summary = [];
  if (repoUrl)
    summary.push(`GitHub: ${import_picocolors3.default.cyan(repoUrl)}`);
  if (deployUrl)
    summary.push(`Vercel: ${import_picocolors3.default.cyan(deployUrl)}`);
  if (envVars.POSTGRES_URL)
    summary.push(`Database: ${import_picocolors3.default.green("connected")}`);
  if (envVars.NEXT_PUBLIC_SANITY_PROJECT_ID)
    summary.push(`Sanity: ${import_picocolors3.default.green(envVars.NEXT_PUBLIC_SANITY_PROJECT_ID)}`);
  if (summary.length > 0) {
    R2.info(summary.join(`
`));
  }
  Le(import_picocolors3.default.green("Done!") + " Your Sitekick project is ready at " + import_picocolors3.default.cyan(`./${projectName}`));
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
