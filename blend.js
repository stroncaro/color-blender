const CC_0 = "0".charCodeAt(0);
const CC_9 = "9".charCodeAt(0);
const CC_A = "A".charCodeAt(0);
const CC_F = "F".charCodeAt(0);
const CC_a = "a".charCodeAt(0);
const CC_f = "f".charCodeAt(0);

function hex_to_num(h) {
  if (typeof h !== 'string' && !(h instanceof String)) throw "not a string";
  
  let n = 0;
  for (let i = 0; i < h.length; i++) {
    const cc = h.charCodeAt(h.length - i - 1);
    const val = (cc >= CC_0 && cc <= CC_9)
      ? cc - CC_0
      : (cc >= CC_A && cc <= CC_F)
        ? cc - CC_A + 10
        : (cc >= CC_a && cc <= CC_f)
          ? cc - CC_a + 10
          : -1;
    if (val == -1) throw "invalid hex character";
    n += (16 ** i) * val;
  }

  return n;
}

function num_to_hex(n) {
  if (typeof n !== 'number') throw "not a number";
  
  let h = "";
  for (let i = 1;; i++) {
    const mod = n % (16 ** i);
    n -= mod;
    const val = mod / (16 ** (i - 1));
    const cc = val < 10
      ? val + CC_0
      : val + CC_a - 10;
    h = String.fromCharCode(cc).concat(h);

    if (n <= 0) break;
  }

  return h;
}

function string_rgb_split(string) {
  if (typeof string !== 'string' && !(string instanceof String)) throw "not a string";
  if (string.length != 6) throw "wrong string length: must have 6 chars"

  return [string.slice(0,2), string.slice(2,4), string.slice(4,6)];
}

function zip(a, b) {
  if (a.length != b.length) throw "can't zip: not the same length";

  return a.map((x, i) => [x, b[i]]);
}

function blend_color_value(a, b, t) {
  /* 
  blend math source:
  https://stackoverflow.com/questions/726549/algorithm-for-additive-color-mixing-for-rgb-values
  */
  return Math.sqrt((1-t) * (a**2) + t * (b**2));
}

function calc_t_from_nums(a, b) {
  return a / (a + b);
}

function blend_colors(rgb1, rgb2, t) {
  const rgbs = zip(rgb1, rgb2);
  return rgbs.map(vals => blend_color_value(vals[0], vals[1], t));
}