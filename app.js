const Gpio = require('onoff').Gpio
const redLight = new Gpio(16, "out")
const yellowLight = new Gpio(20, "out")
const greenLight = new Gpio(21, "out")

const express = require('express')

const app = express()

function setNormalLight() {
    //First go to green
    var lightInterval = setInterval(()=> {
        setGreenOnly()
        setTimeout(()=> {
            setYellowOnly()
            setTimeout(()=> {
                setRedOnly()
            }, 2000)
        }, 2000)   
    })

}

setNormalLight()
function setRedOnly() {
    redLight.write(1)
    yellowLight.write(0)
    greenLight.write(0)
}

function setYellowOnly() {
    redLight.write(0)
    yellowLight.write(1)
    greenLight.write(0)
}

function setGreenOnly() {
    redLight.write(0)
    yellowLight.write(0)
    greenLight.write(1)
}


app.listen(7890, () => {
    console.log(`Server is Listening on 7890`)
})