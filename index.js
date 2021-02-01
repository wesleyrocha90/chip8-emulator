// variables from screen
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var inputFile = document.getElementById('file');
var pauseButton = document.getElementById('pause');

// variables
var memory; // chip 8 internal memory
var V; // general registers including VF
var I; // address register
var keyboard; // keyboard registers
var video; // video screen
var PC; // program counter
var SP; // stack pointer
var stack; // the stack
var DT; // delay timer register
var ST; // sound timer register

// other variables
var needDrawing; // set to true if the draw function is called, indicating that the screen need to be drawn
var pauseGame = false;
var frameTime = 1000 / 240;
var startTime;


var fonts = [
    [0xF0, 0x90, 0x90, 0x90, 0xF0], // 0
    [0x20, 0x60, 0x20, 0x20, 0x70], // 1
    [0xF0, 0x10, 0xF0, 0x80, 0xF0], // 2
    [0xF0, 0x10, 0xF0, 0x10, 0xF0], // 3
    [0x90, 0x90, 0xF0, 0x10, 0x10], // 4
    [0xF0, 0x80, 0xF0, 0x10, 0xF0], // 5
    [0xF0, 0x80, 0xF0, 0x90, 0xF0], // 6
    [0xF0, 0x10, 0x20, 0x40, 0x40], // 7
    [0xF0, 0x90, 0xF0, 0x90, 0xF0], // 8
    [0xF0, 0x90, 0xF0, 0x10, 0xF0], // 9
    [0xF0, 0x90, 0xF0, 0x90, 0x90], // A
    [0xE0, 0x90, 0xE0, 0x90, 0xE0], // B
    [0xF0, 0x80, 0x80, 0x80, 0xF0], // C
    [0xE0, 0x90, 0x90, 0x90, 0xE0], // D
    [0xF0, 0x80, 0xF0, 0x80, 0xF0], // E
    [0xF0, 0x80, 0xF0, 0x80, 0x80], // F
];

pauseButton.addEventListener('click', function () {
    pauseGame = !pauseGame;
});

document.addEventListener('keydown', function (event) {
    // console.log(event.code);
    switch (event.code) {
        case 'Digit1': // 1
            keyboard[0x1] = 0x1;
            break;
        case 'Digit2': // 2
            keyboard[0x2] = 0x1;
            break;
        case 'Digit3': // 3
            keyboard[0x3] = 0x1;
            break;
        case 'Digit4': // C
            keyboard[0xC] = 0x1;
            break;
        case 'KeyQ': // 4
            keyboard[0x4] = 0x1;
            break;
        case 'KeyW': // 5
            keyboard[0x5] = 0x1;
            break;
        case 'KeyE': // 6
            keyboard[0x6] = 0x1;
            break;
        case 'KeyR': // D
            keyboard[0xD] = 0x1;
            break;
        case 'KeyA': // 7
            keyboard[0x7] = 0x1;
            break;
        case 'KeyS': // 8
            keyboard[0x8] = 0x1;
            break;
        case 'KeyD': // 9
            keyboard[0x9] = 0x1;
            break;
        case 'KeyF': // E
            keyboard[0xE] = 0x1;
            break;
        case 'KeyZ': // A
            keyboard[0xA] = 0x1;
            break;
        case 'KeyX': // 0
            keyboard[0x0] = 0x1;
            break;
        case 'KeyC': // B
            keyboard[0xB] = 0x1;
            break;
        case 'KeyV': // F
            keyboard[0xF] = 0x1;
            break;
    }
});

// code responsible for loading the rom into the memory and start the game
inputFile.addEventListener('change', (event) => {
    let startAddress = 0x200;
    let startFontAddress = 0x0
    let reader = new FileReader();
    reader.onloadend = () => {
        initialize();
        clearCanvas();

        let array = new Uint8Array(reader.result);
        //let array = [0xA2,0x0A,0x60,0x0A,0x61,0x05,0xD0,0x17,0x12,0x08,0x00,0x7C,0x00,0x40,0x00,0x40,0x00,0x7C,0x00,0x40,0x00,0x40,0x00,0x7C,];
        memory = new Array(4096);
        array.forEach(byte => {
            memory[startAddress++] = byte;
        });

        fonts.forEach(font => font.forEach(char => memory[startFontAddress++] = char));

        startTime = Date.now();
        requestAnimationFrame(gameLoop);
    };
    reader.readAsArrayBuffer(inputFile.files[0]);
});

function initialize() {
    memory = new Uint8Array(4096);
    V = new Uint8Array(16);
    I = null;
    keyboard = new Uint8Array(16);
    video = new Uint8Array(64 * 32).fill(0x0);
    PC = 0x200;
    SP = 0x0;
    stack = new Uint16Array(16);
}

function clearCanvas() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, 64, 32);
}

function drawCanvas() {
    this.clearCanvas();
    context.fillStyle = '#FFF';
    for (let row = 0; row < 32; row++) {
        for (let col = 0; col < 64; col++) {
            let spriteVideo = video[row * 64 + col];
            if (spriteVideo) {
                context.fillRect(col, row, 1, 1);
            }
        }
    }
    needDrawing = false;
}

function gameLoop() {
    if ((Date.now() - startTime) > frameTime) {
        if (!pauseGame) {
            for (let i = 0; i < 10; i++) {
                emulateCycle();
            }
            
            if (needDrawing)
                drawCanvas();
        }

        if (DT > 0) DT--;
        if (ST > 0) ST--;
        if (ST === 1) {
            new Audio('').play();
        }
    }
    requestAnimationFrame(gameLoop);
}

function emulateCycle() {
    // fetch opcode
    let opcode = memory[PC] << 8 | memory[PC + 1];
    PC += 2;
    
    // decode opcode
    switch(opcode & 0xF000) {
        case 0x0000:
            switch(opcode & 0x00FF) {
                case 0x0000:
                    OP_0nnn(opcode);
                    break;
                case 0x00E0:
                    OP_00E0(opcode);
                    break;
                case 0x00EE:
                    OP_00EE(opcode);
                    break;
            }
            break;
        case 0x1000:
            OP_1nnn(opcode);
            break;
        case 0x2000:
            OP_2nnn(opcode);
            break;
        case 0x3000:
            OP_3xkk(opcode);
            break;
        case 0x4000:
            OP_4xkk(opcode);
            break;
        case 0x5000:
            OP_5xy0(opcode);
            break;
        case 0x6000:
            OP_6xkk(opcode);
            break;
        case 0x7000:
            OP_7xkk(opcode);
            break;
        case 0x8000:
            switch(opcode & 0x000F) {
                case 0x0000:
                    OP_8xy0(opcode);
                    break;
                case 0x0001:
                    OP_8xy1(opcode);
                    break;
                case 0x0002:
                    OP_8xy2(opcode);
                    break;
                case 0x0003:
                    OP_8xy3(opcode);
                    break;
                case 0x0004:
                    OP_8xy4(opcode);
                    break;
                case 0x0005:
                    OP_8xy5(opcode);
                    break;
                case 0x0006:
                    OP_8xy6(opcode);
                    break;
                case 0x0007:
                    OP_8xy7(opcode);
                    break;
                case 0x000E:
                    OP_8xyE(opcode);
                    break;
            }
            break;
        case 0x9000:
            OP_9xy0(opcode);
            break;
        case 0xA000:
            OP_Annn(opcode);
            break;
        case 0xB000:
            OP_Bnnn(opcode);
            break;
        case 0xC000:
            OP_Cxkk(opcode);
            break;
        case 0xD000:
            OP_Dxyn(opcode);
            break;
        case 0xE000:
            switch(opcode & 0x00FF) {
                case 0x009E:
                    OP_Ex9E(opcode);
                    break;
                case 0x00A1:
                    OP_ExA1(opcode);
                    break;
            }
            break;
        case 0xF000:
            switch(opcode & 0x00FF) {
                case 0x0007:
                    OP_Fx07(opcode);
                    break;
                case 0x000A:
                    OP_Fx0A(opcode);
                    break;
                case 0x0015:
                    OP_Fx15(opcode);
                    break;
                case 0x0018:
                    OP_Fx18(opcode);
                    break;
                case 0x001E:
                    OP_Fx1E(opcode);
                    break;
                case 0x0029:
                    OP_Fx29(opcode);
                    break;
                case 0x0033:
                    OP_Fx33(opcode);
                    break;
                case 0x0055:
                    OP_Fx55(opcode);
                    break;
                case 0x0065:
                    OP_Fx65(opcode);
                    break;
            }
            break;
    }
}