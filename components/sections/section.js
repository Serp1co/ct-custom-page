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
  offset_x = i * getRandomInt(10, 640 / (i + 1));
  offset_y = getRandomInt(10, 490);
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

function play() {
  document.querySelector("#login_section").classList.toggle("visible");
  document.querySelector("#login_section").classList.toggle("hidden");
  setTimeout(()=> {
    document.querySelector("#login_section").style.display = 'none';
    document.querySelector("#welcome_section").classList.toggle("visible");
    document.querySelector("#welcome_section").classList.toggle("hidden");
    
  }, 400);
  setTimeout(()=> {
    document.querySelector("#welcome_section").classList.toggle("visible");
    document.querySelector("#welcome_section").classList.toggle("hidden");
  }, 2400);
  setTimeout(()=> {
    switch_audio("loop_1")
  }, 2800);
}


document.querySelector("#login_button").addEventListener('click', function(e) {
  play();
},false)