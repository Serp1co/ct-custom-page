const diary_sections = ["home", "cancer", "tokyo", "C0RRUP73D"];

function getRandomInt(min, max) {
  const m = Math.ceil(min);
  const M = Math.floor(max);
  return Math.floor(Math.random() * (M - m) + m);
}

function switch_visibility(domElement) {
  domElement.classList.toggle("visible");
  domElement.classList.toggle("hidden");
}

function clean_all_visible(arg = "") {
  document
    .querySelectorAll(arg.concat(".visible"))
    .forEach((x) => switch_visibility(x));
}

function load_tip(tip) {
  let tip_html = "";
  [...tip].forEach((e, i) => (tip_html += get_glitched_tip(e, i)));
  document.querySelector(".overlay").innerHTML = tip_html;
}

function get_glitched_tip(e, i) {
  offset_x = 10 + i;
  offset_y = 250 + i * 50;
  return glitched_tip_html_fn(e, offset_x, offset_y);
}

function glitched_tip_html_fn(letter, offset_x, offset_y) {
  return '<p class="glitch" style="top:%s1px;left:%s2px"><span aria-hidden="true">%s0</span>%s0<span aria-hidden="true">%s0</span></p>'
    .replaceAll("%s0", letter)
    .replaceAll("%s1", offset_y)
    .replaceAll("%s2", offset_x);
}

async function change(arg) {
  clean_all_visible(".sector");
  select_section(arg);
}

function login() {
  return new Promise(function () {
    document.querySelector("#login_section").classList.toggle("visible");
    document.querySelector("#login_section").classList.toggle("hidden");
    document.querySelector(".ritratto_avatar_immagine").classList.toggle("hidden");
    setTimeout(() => {
    document.querySelector("#home_section").classList.toggle("none");
    document.querySelector("#login_section").classList.toggle("none");
    document.querySelector(".ritratto_avatar_immagine").src = "https://i.postimg.cc/yd2PVk5H/ashwill3-v2.png";
    },300)
    setTimeout(() => {
      document.querySelector("#home_section").classList.toggle("visible");
      document.querySelector(".ritratto_avatar_immagine").classList.toggle("hidden");
      document.querySelector(".ritratto_avatar_immagine").classList.toggle("visible");
      document.querySelector("#home_section").classList.toggle("hidden");
    },400);
  });
}

document.querySelector("#login_button").addEventListener(
  "click",
  function (e) {
    login();
  },
  false
);

document.addEventListener("build-complete", function() {

  'use strict';

  let _canvas, _context;
  let _image, _imageData;

  const effectList = [
  function glitch(context, width, height) {

    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    const length = width * height;
    const factor = Math.random() * 10;

    let randR = Math.floor(Math.random() * factor);
    let randG = Math.floor(Math.random() * factor) * 3;
    let randB = Math.floor(Math.random() * factor);

    for (let i = 0; i < length; i++) {

      let r = data[(i + randR) * 4];
      let g = data[(i + randG) * 4 + 1];
      let b = data[(i + randB) * 4 + 2];
      if (r + g + b == 0) r = g = b = 255;

      data[i * 4] = r;
      data[i * 4 + 1] = g;
      data[i * 4 + 2] = b;
      //data[i * 4 + 3] = 255;

    }

    context.putImageData(imageData, 0, 0);

  },
  function glitchWave(context, width, height) {

    const renderLineHeight = Math.random() * height;
    const cuttingHeight = 5;
    const imageData = context.getImageData(0, renderLineHeight, width, cuttingHeight);
    context.putImageData(imageData, 0, renderLineHeight - 10);

  },
  function glitchSlip(context, width, height) {

    const waveDistance = 100;
    const startHeight = height * Math.random();
    const endHeight = startHeight + 30 + Math.random() * 40;
    for (let h = startHeight; h < endHeight; h++) {

      if (Math.random() < .1) h++;
      let imageData = context.getImageData(0, h, width, 1);
      context.putImageData(imageData, Math.random() * waveDistance - waveDistance * .5, h);

    }

  },
  function glitchColor(context, width, height) {

    const waveDistance = 30;
    const startHeight = height * Math.random();
    const endHeight = startHeight + 30 + Math.random() * 40;
    const imageData = context.getImageData(0, startHeight, width, endHeight);
    const length = width * height;
    let data = imageData.data;

    let r = 0;
    let g = 0;
    let b = 0;

    for (let i = 0; i < length; i++) {

      if (i % width === 0) {
        r = i + Math.floor((Math.random() - .5) * waveDistance);
        g = i + Math.floor((Math.random() - .5) * waveDistance);
        b = i + Math.floor((Math.random() - .5) * waveDistance);
      }

      data[i * 4] = data[r * 4];
      data[i * 4 + 1] = data[g * 4 + 1];
      data[i * 4 + 2] = data[b * 4 + 2];

    }

    context.putImageData(imageData, 0, startHeight);

  }];


  function init() {

    const imageBoard = document.querySelector('[data-js="glitch-image"]');
    _image = imageBoard.querySelector('img');
    _canvas = document.createElement('canvas');
    _context = _canvas.getContext('2d');

    imageBoard.appendChild(_canvas);

    _imageData = new Image();
    _imageData.crossOrigin = "Anonymous";
    _imageData.onload = function (event) {

      window.addEventListener('resize', onResize, false);
      window.dispatchEvent(new Event('resize'));
      window.requestAnimationFrame(render);

    };
    _imageData.src = _image.getAttribute('src');

  }

  function onResize() {

    _canvas.width = _image.width;
    _canvas.height = _image.height;

  }

  function render(timestamp) {

    let width = _canvas.width;
    let height = _canvas.height;

    _context.clearRect(0, 0, width, height);
    _context.drawImage(_imageData, 0, 0, _image.width, _image.height);

    if (.5 < Math.random()) {
      getRandomValue(effectList)(_context, width, height);
    }

    setTimeout(() => window.requestAnimationFrame(render), 45);

  }

  function getRandomValue(array) {

    return array[Math.floor(Math.random() * array.length)];

  }

  document.addEventListener('glitch', init);
  document.dispatchEvent(new Event("glitch"));
});

function add_glitch_mask() {
  let mask_img = document.createElement('img');
  mask_img.src = 'https://i.ibb.co/4j5MZyX/mask-bio.png';
  mask_img.classList.add('mask-image');
  let mask_img2 = document.createElement('img');
  mask_img2.src = 'https://i.ibb.co/4j5MZyX/mask-bio.png';
  mask_img2.classList.add('mask-image');
  document.querySelector('[data-js="glitch-image"]').appendChild(mask_img);
  document.querySelector('[data-js="glitch-image"]').appendChild(mask_img2);
}
