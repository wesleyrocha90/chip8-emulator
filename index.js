(function gameLoop() {

    // variables
    var memory = new Array(4096);
    var V = new Array(16);
    var I;
    var keyboard = new Array(16);
    var screen = new Array(64 * 32);

    // delay timer register
    var DT;
    // sound timer register
    var ST;

    function loadGame() {
        let inputFile = document.getElementById('file');
        let address = 512;

        inputFile.addEventListener('change', (event) => {
            var reader = new FileReader();
            reader.onloadend = () => {
                var data = reader.result;
                
                var array = new Uint8Array(data);

                array.forEach(byte => memory[address++]);

                console.log(fileByteArray);
            };
            reader.readAsArrayBuffer(inputFile.files[0]);
        });
    }

    function gameLoop() {

        emulateCycle();

        // draw graphics

        // read inputs

    }

    function emulateCycle() {
        // fetch opcode
        // decode opcode
        // execute opcode
    }
})()