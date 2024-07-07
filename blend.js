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
  return a == 0 && b == 0 ? 0.5 : b / (a + b);
}

function blend_colors(rgb1, rgb2, t) {
  const rgbs = zip(rgb1, rgb2);
  return rgbs.map(vals => blend_color_value(vals[0], vals[1], t));
}


document.addEventListener('DOMContentLoaded', function(){
  const sliders = Array.from(document.getElementsByClassName('slider'));
  const text_inputs = Array.from(document.getElementsByClassName('text-input'));

  function update_background() {
    const colors = text_inputs
      .map(text_input => text_input.value)
      .map(color_hex => string_rgb_split(color_hex))
      .map(hex_arr => hex_arr.map(h => hex_to_num(h)));

    const t = calc_t_from_nums(Number(sliders[0].value), Number(sliders[1].value));

    const blend = blend_colors(colors[0], colors[1], t)
      .map(n => num_to_hex(n))
      .map(h => h.length == 1 ? '0' + h : h);
    const new_hex = '#' + blend[0] + blend[1] + blend[2];

    document.body.style.backgroundColor = new_hex;
  }

  sliders.forEach(slider => {
    slider.addEventListener('input', () => {
      update_background();
    });
  });

  text_inputs.forEach(text_input => {
    text_input.addEventListener('input', () => {
      if (text_input.value.length == 6) update_background();
    });
  });
})