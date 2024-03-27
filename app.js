const Gpio = require('onoff').Gpio
const led = new Gpio(16, "out")
setInterval(()=> {
    led.writeSync(1)
}, 1000)