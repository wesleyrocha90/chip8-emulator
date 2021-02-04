function numberToHexString(number) {
    return '0x' + number.toString(16).toUpperCase().padStart(4, '0');
}

function numberToHexStringSimple(number) {
    return number.toString(16).toUpperCase();
}

function numberToBinString(number) {
    return '0b' + number.toString(2).padStart(8, '0');
}