const diary_sections = ["mother", "cancer", "tokyo", "DONT"];
const minigame_commands = {
  systemctl: start,
  "--help": help,
  ls: view,
  less: read,
  cd: move,
};
const fake_fs_arr = [
  "~",
  "/root",
  "/root/opt",
  "/root/reserved",
  "/root/reserved/personal.diary",
];
let easy_mode_on = false;
let path = "~";
let env = "localhost";
function getRandomInt(min, max) {
  const m = Math.ceil(min);
  const M = Math.floor(max);
  return Math.floor(Math.random() * (M - m) + m);
}
function glitched_hint_html_fn(letter, offset_x, offset_y) {
  return '<p class="glitch" style="top:%s1px;left:%s2px"><span aria-hidden="true">%s0</span>%s0<span aria-hidden="true">%s0</span></p>'
    .replaceAll("%s0", letter)
    .replaceAll("%s1", offset_y)
    .replaceAll("%s2", offset_x);
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
function select_section(section_name) {
  const s_section_id = "#" + section_name + "_sector";
  const domElement = document.querySelector(s_section_id);
  switch_visibility(domElement);
}
function create_tip(text, index) {
  return '<a onclick="load_tip('
    .concat("%index)")
    .concat('" class="tip')
    .concat(easy_mode_on ? "" : "")
    .concat('">%text</a> ')
    .replaceAll("%text", text)
    .replaceAll("%index", index);
}
function create_hint(text, hint = text) {
  return '<a onclick="load_hint('
    .concat("'%hint')")
    .concat('" class="hint')
    .concat(easy_mode_on ? " hint-easy" : "")
    .concat('">%text</a> ')
    .replaceAll("%text", text)
    .replaceAll("%hint", hint);
}
function load_hint(hint) {
  if (easy_mode_on) {
    document.querySelector("#terminal_input").value = hint;
  }
}
async function print_terminal_string(
  text,
  delay = 0,
  template = '<p class="terminal_text">[root@%env %path]# %text</a></p>'
) {
  await new Promise(() => {
    setTimeout(() => {
      const line_template = template
        .replaceAll("%path", path)
        .replaceAll("%text", text)
        .replaceAll("%env", env);
      document.querySelector("#terminal_output").innerHTML += line_template;
    }, delay);
  });
}
function easy_mode() {
  easy_mode_on = !easy_mode_on;
  document
    .querySelectorAll(".hint")
    .forEach((x) => x.classList.toggle("hint-easy"));
}
function play() {
  let full_cmd = document.querySelector("#terminal_input").value;
  document.querySelector(".overlay").innerHTML = "";
  print_terminal_string(full_cmd);
  full_cmd = full_cmd.split(" ");
  const command = full_cmd[0];
  const args = full_cmd.slice(1, full_cmd.length + 1).join(" ");
  if (minigame_commands[command]) minigame_commands[command](args);
  else if (diary_sections.indexOf(command) != -1) change(command);
  else if (command.length != 0) print_terminal_string(command + " not found");
}
function start(arg) {
  not_found = false;
  if (arg == "enable --now cockpit.socket") {
    env = "remote";
    print_terminal_string("Connecting to socket.", 200);
    setTimeout(
      () => (document.querySelector("#terminal_output").innerHTML += " . "),
      350
    );
    setTimeout(
      () => (document.querySelector("#terminal_output").innerHTML += " . "),
      400
    );
    setTimeout(
      () => (document.querySelector("#terminal_output").innerHTML += " . "),
      650
    );
    setTimeout(
      () => (document.querySelector("#terminal_output").innerHTML += " OK "),
      750
    );
    print_terminal_string("Logged in as root. Access audit registered.", 950);
    document.querySelector("env").innerHTML = env;
    print_terminal_string(
      "Type "
        .concat(create_hint("--help"))
        .concat("to view the list of commands"),
      1000
    );
  } else {
    print_terminal_string("Not allowed");
  }
}
function help() {
  print_terminal_string("ls -fs => to view all file system contents");
  print_terminal_string("cd path => to move inside the file system");
  print_terminal_string(
    create_hint(
      "less path/to/file",
      "less /root/reserved/personal.diary"
    ).concat(" => read a file")
  );
}
function view(arg) {
  if (arg == "-fs") {
    print_terminal_string("view file system...");
    fake_fs_arr.forEach((e, i) => print_diary_string(e));
  } else {
    print_terminal_string("Not allowed");
  }
}
function move(arg) {
  if (fake_fs_arr.indexOf(arg) != -1) {
    path = arg;
    print_terminal_string("");
  } else {
    print_terminal_string("Not allowed");
  }
}
function read(arg) {
  if (arg == "/root/reserved/personal.diary") {
    print_terminal_string("Accessing file: personal.diary");
    print_terminal_string(
      "A normal life.",
      200,
      '<p class="terminal_text">%text</a></p>'
    );
    const hint_text = "A normal ".concat(create_tip("family", 0));
    print_terminal_string(
      hint_text,
      350,
      '<p class="terminal_text">%text</a></p>'
    );
  }
}
function change(arg) {
  clean_all_visible(".sector");
  select_section(arg);
}
function load_tip(arg) {
  const tip = [...diary_sections[arg]];
  let tip_html = "";
  tip.forEach((e, i) => (tip_html += get_glitched_tip(e, i)));
  document.querySelector(".overlay").innerHTML = tip_html;
  if (easy_mode_on) {
    document.querySelector("#terminal_input").value = tip.join("");
  }
}
function get_glitched_tip(e, i) {
  if (!easy_mode_on) {
    offset_x = i * getRandomInt(10, 640 / (i + 1));
    offset_y = getRandomInt(10, 490);
  } else {
    offset_x = 175 + i * 50;
    offset_y = 220;
  }
  return glitched_hint_html_fn(e, offset_x, offset_y);
}

function switch_audio(entry_loop_id) {
  exit_sound = document.querySelector(".audio.on");
  entry_sound = document.querySelector("#" + entry_loop_id);
  const fade_out = setInterval(() => {
    if (exit_sound.volume !== 0) {
      exit_sound.volume -= 0.15;
    }
    if (exit_sound.volume < 0.003) {
      clearInterval(fade_out);
      exit_sound.pause();
      exit_sound.classList.toggle("off");
      exit_sound.classList.toggle("on");
      exit_sound.volume = 0;
      entry_sound.volume = 1;
      entry_sound.play(0);
      entry_sound.classList.toggle("on");
      entry_sound.classList.toggle("off");
    }
  }, 125);
}

(function (window) {
  "use strict";

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
        data[i * 4 + 3] = 255;
      }

      context.putImageData(imageData, 0, 0);
    },
    function glitchWave(context, width, height) {
      const renderLineHeight = Math.random() * height;
      const cuttingHeight = 5;
      const imageData = context.getImageData(
        0,
        renderLineHeight,
        width,
        cuttingHeight
      );
      context.putImageData(imageData, 0, renderLineHeight - 10);
    },
    function glitchSlip(context, width, height) {
      const waveDistance = 100;
      const startHeight = height * Math.random();
      const endHeight = startHeight + 30 + Math.random() * 40;
      for (let h = startHeight; h < endHeight; h++) {
        if (Math.random() < 0.1) h++;
        let imageData = context.getImageData(0, h, width, 1);
        context.putImageData(
          imageData,
          Math.random() * waveDistance - waveDistance * 0.5,
          h
        );
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
          r = i + Math.floor((Math.random() - 0.5) * waveDistance);
          g = i + Math.floor((Math.random() - 0.5) * waveDistance);
          b = i + Math.floor((Math.random() - 0.5) * waveDistance);
        }

        data[i * 4] = data[r * 4];
        data[i * 4 + 1] = data[g * 4 + 1];
        data[i * 4 + 2] = data[b * 4 + 2];
      }

      context.putImageData(imageData, 0, startHeight);
    },
  ];

  function init() {
    const imageBoard = document.querySelector('[data-js="glitch-image"]');
    _image = imageBoard.querySelector("img");
    _canvas = document.createElement("canvas");
    _context = _canvas.getContext("2d");

    imageBoard.appendChild(_canvas);

    _imageData = new Image();
    _imageData.crossOrigin = "Anonymous";
    _imageData.onload = function (event) {
      window.addEventListener("resize", onResize, false);
      window.dispatchEvent(new Event("resize"));
      window.requestAnimationFrame(render);
    };
    _imageData.src = _image.getAttribute("src");
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

    if (0.5 < Math.random()) {
      getRandomValue(effectList)(_context, width, height);
    }

    window.requestAnimationFrame(render);
  }

  function getRandomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  document.addEventListener("DOMContentLoaded", init);
})(window);
