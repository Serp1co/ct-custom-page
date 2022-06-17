function getRandomInt(min, max) {
    const m = Math.ceil(min);
    const M = Math.floor(max);
    return Math.floor(Math.random() * (M - m) + m);
}
function glitched_hint_html_fn(letter, offset_x, offset_y) {
    return '<p class="glitch" style="top:%s1px;left:%s2px"><span aria-hidden="true">%s0</span>%s0<span aria-hidden="true">%s0</span></p>'
        .replaceAll('%s0', letter)
        .replaceAll('%s1', offset_y)
        .replaceAll('%s2', offset_x);
}
function switch_visibility(domElement) {
    domElement.classList.toggle('visible');
    domElement.classList.toggle('hidden');
}
function clean_all_visible(arg = "") {
    document.querySelectorAll(arg.concat(".visible")).forEach((x) => switch_visibility(x));
}
function select_section(section_name) {
    const s_section_id = '#' + section_name + '_sector';
    const domElement = document.querySelector(s_section_id);
    switch_visibility(domElement);
}
function create_tip(text, index) {
    return '<a onclick="load_tip('.concat("%index)").concat('" class="tip').concat(easy_mode_on ? '' : '').concat('">%text</a> ')
        .replaceAll('%text', text)
        .replaceAll('%index', index);
}
function create_hint(text, hint = text) {
    return '<a onclick="load_hint('.concat("'%hint')").concat('" class="hint').concat(easy_mode_on ? ' hint-easy' : '').concat('">%text</a> ')
        .replaceAll('%text', text)
        .replaceAll('%hint', hint);
}
function load_hint(hint) {
    if (easy_mode_on) {
        document.querySelector('#terminal_input').value = hint;
    }
}
function print_diary_string(text) {
    const line_template = '<p class="terminal_text">%text</a></p>'.replaceAll('%path', path).replaceAll('%text', text);
    document.querySelector("#terminal_output").innerHTML += line_template;
}
async function print_terminal_string(text, delay=0) {
    await new Promise(()=> {
        setTimeout(()=>{
            const line_template = '<p class="terminal_text">[root@localhost %path]# %text</a></p>'
                .replaceAll('%path', path)
                .replaceAll('%text', text);
            document.querySelector("#terminal_output").innerHTML += line_template;
        }, delay)});
}
const diary_sections = ['mother', 'cancer', 'tokyo', 'DONT'];
const minigame_commands = {
    'systemctl': start,
    '--help': help,
    'ls': view,
    'less': read,
    'cd': move
};
const fake_fs_arr = ['~', '/root', '/root/opt', '/root/reserved', '/root/reserved/personal.diary'];
let easy_mode_on = false;
let path = '~';
function easy_mode() {
    easy_mode_on = !easy_mode_on;
    document.querySelectorAll('.hint').forEach(x => x.classList.toggle('hint-easy'));
}
function play() {
    let full_cmd = document.querySelector("#terminal_input").value;
    document.querySelector('.overlay').innerHTML = "";
    print_terminal_string(full_cmd);
    full_cmd = full_cmd.split(' ');
    const command = full_cmd[0];
    const args = full_cmd.slice(1, full_cmd.length + 1).join(' ');
    if (minigame_commands[command]) minigame_commands[command](args);
    else change(command)
}
function start(arg) {
    not_found = false;
    if (arg == "enable --now cockpit.socket") {
        print_terminal_string("Connecting to socket.",200)
            .then(()=>setTimeout(()=>document.querySelector("#terminal_output").innerHTML += ".", delay))
            .then(()=>document.querySelector("#terminal_output").innerHTML += ".. OK")
        print_terminal_string("Logged in as root. Access audit registered.");
        print_terminal_string("Type ".concat(create_hint('--help')).concat("to view the list of commands"));
    } else {
        print_terminal_string("Not allowed");
    }
}
function help() {
    print_terminal_string("ls -fs => to view all file system contents");
    print_terminal_string("cd path => to move inside the file system");
    print_terminal_string(create_hint("less path/to/file", "less /root/reserved/personal.diary").concat(" => read a file"));
}
function view(arg) {
    if (arg == '-fs') {
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
        print_diary_string("A normal life.");
        const hint_text = 'A normal '.concat(create_tip("family", 0));
        print_diary_string(hint_text);
    }
}
function change(arg) {
    clean_all_visible(".sector");
    select_section(arg);
}
function load_tip(arg) {
    const tip = [...diary_sections[arg]];
    let tip_html = '';
    tip.forEach((e, i) => tip_html += get_glitched_tip(e, i));
    document.querySelector('.overlay').innerHTML = tip_html;
    if (easy_mode_on) {
        document.querySelector('#terminal_input').value = tip.join('');
    }
}
function get_glitched_tip(e, i) {
    if (!easy_mode_on) {
        offset_x = i * getRandomInt(10, 640 / (i + 1));
        offset_y = getRandomInt(10, 490);
    } else {
        offset_x = 175 + (i * 50);
        offset_y = 220;
    }
    return glitched_hint_html_fn(e, offset_x, offset_y);
}