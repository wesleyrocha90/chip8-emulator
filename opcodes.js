// OPCODES

// SYS addr
// Jump to a machine code routine at nnn.
// This instruction is only used on the old computers on which Chip-8 was originally implemented. It is ignored by modern interpreters.
function OP_0nnn(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - SYS addr`);
}

// CLS
// Clear the display.
function OP_00E0(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - 00E0 - CLS`);
    video = new Uint8Array(64 * 32).fill(0x0);
    needDrawing = true;
}

// RET
// Return from a subroutine.
// The interpreter sets the program counter to the address at the top of the stack, then subtracts 1 from the stack pointer.
function OP_00EE(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - 00EE - RET`);
    PC = stack[--SP];
}

// JP addr
// Jump to location nnn.
// The interpreter sets the program counter to nnn.
function OP_1nnn(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - JP addr`);
    PC = opcode & 0x0FFF;
}

// CALL addr
// Call subroutine at nnn.
// The interpreter increments the stack pointer, then puts the current PC on the top of the stack. The PC is then set to nnn.
function OP_2nnn(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - CALL addr`);
    stack[SP++] = PC;
    PC = opcode & 0x0FFF;
}

// SE Vx, byte
// Skip next instruction if Vx = kk.
// The interpreter compares register Vx to kk, and if they are equal, increments the program counter by 2.
function OP_3xkk(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - SE Vx, byte`);
    if (V[(opcode & 0x0F00) >> 8] === (opcode & 0x00FF))
        PC += 2;
}

// SNE Vx, byte
// Skip next instruction if Vx != kk.
// The interpreter compares register Vx to kk, and if they are not equal, increments the program counter by 2.
function OP_4xkk(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - SNE Vx, byte`);
    if (V[(opcode & 0x0F00) >> 8] !== (opcode & 0x00FF))
        PC += 2;
}

// SE Vx, Vy
// Skip next instruction if Vx = Vy.
// The interpreter compares register Vx to register Vy, and if they are equal, increments the program counter by 2.
function OP_5xy0(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - SE Vx, Vy`);
    if (V[(opcode & 0x0F00) >> 8] === V[(opcode & 0x00F0) >> 4])
        PC += 2;
}

// LD Vx, byte
// Set Vx = kk.
// The interpreter puts the value kk into register Vx.
function OP_6xkk(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - LD Vx, byte`);
    V[(opcode & 0x0F00) >> 8] = opcode & 0x00FF;
}

// ADD Vx, byte
// Set Vx = Vx + kk.
// Adds the value kk to the value of register Vx, then stores the result in Vx.
function OP_7xkk(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - ADD Vx, byte`);
    V[(opcode & 0x0F00) >> 8] += opcode & 0x00FF;
}

// LD Vx, Vy
// Set Vx = Vy.
// Stores the value of register Vy in register Vx.
function OP_8xy0(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - LD Vx, Vy`);
    V[(opcode & 0x0F00) >> 8] = V[(opcode & 0x00F0) >> 4];
}

// OR Vx, Vy
// Set Vx = Vx OR Vy.
// Performs a bitwise OR on the values of Vx and Vy, then stores the result in Vx.
function OP_8xy1(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - OR Vx, Vy`);
    V[(opcode & 0x0F00) >> 8] |= V[(opcode & 0x00F0) >> 4];
}

// AND Vx, Vy
// Set Vx = Vx AND Vy.
// Performs a bitwise AND on the values of Vx and Vy, then stores the result in Vx.
function OP_8xy2(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - AND Vx, Vy`);
    V[(opcode & 0x0F00) >> 8] &= V[(opcode & 0x00F0) >> 4];
}

// XOR Vx, Vy
// Set Vx = Vx XOR Vy.
// Performs a bitwise exclusive OR on the values of Vx and Vy, then stores the result in Vx.
function OP_8xy3(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - XOR Vx, Vy`);
    V[(opcode & 0x0F00) >> 8] ^= V[(opcode & 0x00F0) >> 4];
}

// ADD Vx, Vy
// Set Vx = Vx + Vy, set VF = carry.
// The values of Vx and Vy are added together. If the result is greater than 8 bits (i.e., > 255,) VF is set to 1, otherwise 0. Only the lowest 8 bits of the result are kept, and stored in Vx.
function OP_8xy4(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - ADD Vx, Vy`);
    V[0xF] = (V[(opcode & 0x0F00) >> 8] > 0xFF - V[(opcode & 0x00F0) >> 4]) ? 1 : 0;
    V[(opcode & 0x0F00) >> 8] += V[(opcode & 0x00F0) >> 4];
}

// SUB Vx, Vy
// Set Vx = Vx - Vy, set VF = NOT borrow.
// If Vx > Vy, then VF is set to 1, otherwise 0. Then Vy is subtracted from Vx, and the results stored in Vx.
function OP_8xy5(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - SUB Vx, Vy`);
    V[0xF] = (V[(opcode & 0x0F00) >> 8] > V[(opcode & 0x00F0) >> 4]) ? 1 : 0;
    V[(opcode & 0x0F00) >> 8] -= V[(opcode & 0x00F0) >> 4];
}

// SHR Vx {, Vy}
// Set Vx = Vx SHR 1.
// If the least-significant bit of Vx is 1, then VF is set to 1, otherwise 0. Then Vx is divided by 2.
function OP_8xy6(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - SHR Vx {, Vy}`);
    V[0xF] = (V[(opcode & 0x0F00) >> 8] & 0x0001 == 0x1) ? 1 : 0;
    V[(opcode & 0x0F00) >> 8] >>= 1;
}

// SUBN Vx, Vy
// Set Vx = Vy - Vx, set VF = NOT borrow.
// If Vy > Vx, then VF is set to 1, otherwise 0. Then Vx is subtracted from Vy, and the results stored in Vx.
function OP_8xy7(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - SUBN Vx, Vy`);
    V[0xF] = (V[(opcode & 0x00F0) >> 4] > V[(opcode & 0x0F00) >> 8]) ? 1 : 0;
    V[(opcode & 0x0F00) >> 8] = V[(opcode & 0x00F0) >> 4] - V[(opcode & 0x0F00) >> 8];
}

// SHL Vx {, Vy}
// Set Vx = Vx SHL 1.
// If the most-significant bit of Vx is 1, then VF is set to 1, otherwise to 0. Then Vx is multiplied by 2.
function OP_8xyE(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - SHL Vx {, Vy}`);
    V[0xF] = (V[(opcode & 0x0F00) >> 8] >> 7 == 0x1) ? 1 : 0;
    V[(opcode & 0x0F00) >> 8] <<= 1;
}

// SNE Vx, Vy
// Skip next instruction if Vx != Vy.
// The values of Vx and Vy are compared, and if they are not equal, the program counter is increased by 2.
function OP_9xy0(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - SNE Vx, Vy`);
    if (V[(opcode & 0x0F00) >> 8] != V[(opcode & 0x00F0) >> 4])
        PC += 2;
}

// LD I, addr
// Set I = nnn.
// The value of register I is set to nnn.
function OP_Annn(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - LD I, addr`);
    I = opcode & 0x0FFF;
}

// JP V0, addr
// Jump to location nnn + V0.
// The program counter is set to nnn plus the value of V0.
function OP_Bnnn(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - JP V0, addr`);
    PC = (opcode & 0x0FFF) + V[0x0];
}

// RND Vx, byte
// Set Vx = random byte AND kk.
// The interpreter generates a random number from 0 to 255, which is then ANDed with the value kk. The results are stored in Vx. See instruction 8xy2 for more information on AND.
function OP_Cxkk(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - RND Vx, byte`);
    V[(opcode & 0x0F00) >> 8] = getRandom() & (opcode & 0x00FF);
}

// DRW Vx, Vy, nibble
// Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
// The interpreter reads n bytes from memory, starting at the address stored in I. These bytes are then displayed as sprites on screen at coordinates (Vx, Vy). Sprites are XORed onto the existing screen. If this causes any pixels to be erased, VF is set to 1, otherwise it is set to 0. If the sprite is positioned so part of it is outside the coordinates of the display, it wraps around to the opposite side of the screen. See instruction 8xy3 for more information on XOR, and section 2.4, Display, for more information on the Chip-8 screen and sprites.
function OP_Dxyn(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - DRW Vx, Vy, nibble`);
    let x = V[(opcode & 0x0F00) >> 8];
    let y = V[(opcode & 0x00F0) >> 4];
    let n = (opcode & 0x000F);

    for (let i = 0; i < n; i++) {
        let sprite = memory[I + i];

        for (let j = 0; j < 8; j++) {
            if ((sprite & (0x80 >> j)) != 0) {
                V[0xF] = (video[((y + i) * 64 + (x + j))]) ? 1 : 0;
                video[((y + i) * 64 + (x + j))] ^= 1;
            }
        }
    }
    needDrawing = true;
}

// SKP Vx
// Skip next instruction if key with the value of Vx is pressed.
// Checks the keyboard, and if the key corresponding to the value of Vx is currently in the down position, PC is increased by 2.
function OP_Ex9E(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - SKP Vx`);
    if (keyboard[V[(opcode & 0x0F00) >> 8]] === 0x1) {
        PC += 2;
        keyboard.fill(0);
    }
}

// SKNP Vx
// Skip next instruction if key with the value of Vx is not pressed.
// Checks the keyboard, and if the key corresponding to the value of Vx is currently in the up position, PC is increased by 2.
function OP_ExA1(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - SKNP Vx`);
    if (keyboard[V[(opcode & 0x0F00) >> 8]] !== 0x1) {
        PC += 2;
    } else {
        keyboard.fill(0);
    }
}

// LD Vx, DT
// Set Vx = delay timer value.
// The value of DT is placed into Vx.
function OP_Fx07(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - LD Vx, DT`);
    V[(opcode & 0x0F00) >> 8] = DT;
}

// LD Vx, K
// Wait for a key press, store the value of the key in Vx.
// All execution stops until a key is pressed, then the value of that key is stored in Vx.
function OP_Fx0A(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - LD Vx, K`);
    if (keyboard.every(key => key === 0x0))
        PC -= 2;
    else {
        V[(opcode & 0x0F00) >> 8] = keyboard.findIndex(item => item === 0x1);
        keyboard.fill(0);
    }
}

// LD DT, Vx
// Set delay timer = Vx.
// DT is set equal to the value of Vx.
function OP_Fx15(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - LD DT, Vx`);
    DT = V[(opcode & 0x0F00) >> 8];
}

// LD ST, Vx
// Set sound timer = Vx.
// ST is set equal to the value of Vx.
function OP_Fx18(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - LD ST, Vx`);
    ST = V[(opcode & 0x0F00) >> 8];
}

// ADD I, Vx
// Set I = I + Vx.
// The values of I and Vx are added, and the results are stored in I.
function OP_Fx1E(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - ADD I, Vx`);
    V[0xF] = (I + V[(opcode & 0x0F00) >> 8]) > 0xFFF ? 1 : 0;
    I += V[(opcode & 0x0F00) >> 8];
}

// LD F, Vx
// Set I = location of sprite for digit Vx.
// The value of I is set to the location for the hexadecimal sprite corresponding to the value of Vx.
function OP_Fx29(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - LD F, Vx`);
    I = (opcode & 0x0F00) * 5;
}

// LD B, Vx
// Store BCD representation of Vx in memory locations I, I+1, and I+2.
// The interpreter takes the decimal value of Vx, and places the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.
function OP_Fx33(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - LD B, Vx`);
    memory[I] = Math.floor(V[(opcode & 0x0F00) >> 8] / 100);
    memory[I + 1] = Math.floor((V[(opcode & 0x0F00) >> 8] % 100) / 10);
    memory[I + 2] = Math.floor(V[(opcode & 0x0F00) >> 8] % 10);
}

// LD [I], Vx
// Store registers V0 through Vx in memory starting at location I.
// The interpreter copies the values of registers V0 through Vx into memory, starting at the address in I.
function OP_Fx55(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - LD [I], Vx`);
    for (let i = 0; i <= ((opcode & 0x0F00) >> 8); i++)
        memory[I + i] = V[i];
    I += ((opcode & 0x0F00) >> 8) + 1;
}

// LD Vx, [I]
// Read registers V0 through Vx from memory starting at location I.
// The interpreter reads values from memory starting at location I into registers V0 through Vx.
function OP_Fx65(opcode) {
    console.log((PC-2).toString(16).padStart(3,'0').toUpperCase() + ' - ', numberToHexString(opcode), ` - LD Vx, [I]`);
    for (let i = 0; i <= ((opcode & 0x0F00) >> 8); i++)
        V[i] = memory[I + i];
    I += ((opcode & 0x0F00) >> 8) + 1;
}

function getRandom() {
    return Math.floor(Math.random() * (255 + 1));
}

function numberToHexString(number) {
    return '0x' + number.toString(16).toUpperCase().padStart(4, '0');
}