function emitChange() {
    window.dispatchEvent(new Event('change'));
}

window.addEventListener('change', function (event) {
    if (window.V) {
        for (let i = 0; i < 16; i++) {
            document.getElementById(`V${numberToHexStringSimple(i)}`).textContent = window.V[i];
        }
    }
})