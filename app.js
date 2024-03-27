const Gpio = require('onoff').Gpio
const led = new Gpio(16, "out")

led.write(0)