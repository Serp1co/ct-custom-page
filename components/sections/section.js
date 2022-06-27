const diary_sections = ["home", "cancer", "tokyo", "C0RRUP73D"];
const fake_fs_arr = [
  "~",
  "/root",
  "/root/opt",
  "/root/reserved",
  "/root/reserved/personal.diary",
];
let path = "~";
let env = "localhost";

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

function play() {
  document.querySelector(".overlay").innerHTML = "";
  connect();
  help();
  view("/private");
  view("-fs");
  move("/root/reserved/");
  load_tip("STOP");
  read("/root/reserved/personal.diary");
}

function connect() {
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
function load_tip(tip) {
  let tip_html = "";
  tip.forEach((e, i) => (tip_html += get_glitched_tip(e, i)));
  document.querySelector(".overlay").innerHTML = tip_html;
}
function get_glitched_tip(e, i) {
  offset_x = i * getRandomInt(10, 640 / (i + 1));
  offset_y = getRandomInt(10, 490);
  return glitched_hint_html_fn(e, offset_x, offset_y);
}

function create_tip(text) {
  return '<a'
    .concat('" class="tip')
    .concat('">%text</a> ')
    .replaceAll("%text", text)
}
function create_hint(text) {
  return '<a'
    .concat('" class="hint')
    .concat(" hint-easy")
    .concat('">%text</a> ')
    .replaceAll("%text", text)
}
