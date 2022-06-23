function change(arg) {
    clean_all_visible(".sector");
    select_section(arg);
}

function get_glitched_tip(e, i) {
    if (!this.easy_mode_on) {
        offset_x = i * getRandomInt(10, 640 / (i + 1));
        offset_y = getRandomInt(10, 490);
    } else {
        offset_x = 175 + (i * 50);
        offset_y = 220;
    }
    return glitched_hint_html_fn(e, offset_x, offset_y);
}

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

function create_tip(text, index, easy_mode_on) {
    return '<a onclick="load_tip('.concat("%index)").concat('" class="tip').concat(easy_mode_on ? '' : '').concat('">%text</a> ')
        .replaceAll('%text', text)
        .replaceAll('%index', index);
}

function create_hint(text, hint = text, easy_mode_on) {
    return '<a onclick="load_hint('.concat("'%hint')").concat('" class="hint').concat(easy_mode_on ? ' hint-easy' : '').concat('">%text</a> ')
        .replaceAll('%text', text)
        .replaceAll('%hint', hint);
}

function load_tip(arg, easy_mode_on) {
    const tip = [...this.diary_sections[arg]];
    let tip_html = '';
    tip.forEach((e, i) => tip_html += get_glitched_tip(e, i));
    document.querySelector('.overlay').innerHTML = tip_html;
    if (easy_mode_on) {
        document.querySelector('#terminal_input').value = tip.join('');
    }
}

function load_hint(hint, easy_mode_on) {
    if (easy_mode_on) {
        document.querySelector('#terminal_input').value = hint;
    }
}