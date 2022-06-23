class Minigame{
    diary_sections = ['mother', 'cancer', 'tokyo', 'DONT'];
    minigame_commands = {
        'systemctl': this.start,
        '--help': this.help,
        'ls': this.view,
        'less': this.read,
        'cd': this.move
    };
    fake_fs_arr = ['~', '/root', '/root/opt', '/root/reserved', '/root/reserved/personal.diary'];
    easy_mode_on = false;
    path = '~';
    env = 'localhost';
    
    constructor() {

    }
    
    easy_mode() {
        this.easy_mode_on = !this.easy_mode_on;
        document.querySelectorAll('.hint').forEach(x => x.classList.toggle('hint-easy'));
    }

    play() {
        let full_cmd = document.querySelector("#terminal_input").value;
        document.querySelector('.overlay').innerHTML = "";
        print_terminal_string(full_cmd);
        full_cmd = full_cmd.split(' ');
        const command = full_cmd[0];
        const args = full_cmd.slice(1, full_cmd.length + 1).join(' ');
        if (this.minigame_commands[command]) this.minigame_commands[command](args);
        else if(this.diary_sections.indexOf(command) != -1) change(command);
        else if(command.length != 0) print_terminal_string(command + " not found");
    }

    start(arg) {
        not_found = false;
        if (arg == "enable --now cockpit.socket") {
            this.env = 'remote';
            print_terminal_string("Connecting to socket.",200)
            setTimeout(()=>document.querySelector("#terminal_output").innerHTML += " . ", 350)
            setTimeout(()=>document.querySelector("#terminal_output").innerHTML += " . ", 400)
            setTimeout(()=>document.querySelector("#terminal_output").innerHTML += " . ", 650)
            setTimeout(()=>document.querySelector("#terminal_output").innerHTML += " OK ", 750)
            print_terminal_string("Logged in as root. Access audit registered.", 950)
            document.querySelector("env").innerHTML = this.env;
            print_terminal_string("Type ".concat(create_hint('--help')).concat("to view the list of commands"), 1000, this.easy_mode_on)
            ;
        } else {
            print_terminal_string("Not allowed");
        }
    }

    help() {
        print_terminal_string("ls -fs => to view all file system contents");
        print_terminal_string("cd path => to move inside the file system");
        print_terminal_string(create_hint("less path/to/file", "less /root/reserved/personal.diary", this.easy_mode_on)
            .concat(" => read a file")
        );
    }

    view(arg) {
        if (arg == '-fs') {
            print_terminal_string("view file system...");
            this.fake_fs_arr.forEach((e, i) => print_diary_string(e));
        } else {
            print_terminal_string("Not allowed");
        }
    }

    move(arg) {
        if (this.fake_fs_arr.indexOf(arg) != -1) {
            this.path = arg;
            print_terminal_string("");
        } else {
            print_terminal_string("Not allowed");
        }
    }

    read(arg) {
        if (arg == "/root/reserved/personal.diary") {
            print_terminal_string("Accessing file: personal.diary");
            print_terminal_string("A normal life.", 200, '<p class="terminal_text">%text</a></p>');
            const hint_text = 'A normal '.concat(create_tip("family", 0, this.easy_mode_on));
            print_terminal_string(hint_text, 350, '<p class="terminal_text">%text</a></p>');
        }
    }

    async print_terminal_string(text,delay=0,template='<p class="terminal_text">[root@%env %path]# %text</a></p>') {
        await new Promise(()=> {
            setTimeout(()=>{
                const line_template = template.replaceAll('%path', this.path).replaceAll('%text', text).replaceAll('%env', this.env);
                document.querySelector("#terminal_output").innerHTML += line_template;
            }, delay)});
    }
}

const minigame = new Minigame();