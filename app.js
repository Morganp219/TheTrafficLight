const Gpio = require('onoff').Gpio
const redLight = new Gpio(12, "out")
const yellowLight = new Gpio(20, "out")
const greenLight = new Gpio(21, "out")
const { Server } = require("socket.io");

const server = createServer();
const io = new Server(server);

const express = require('express')

const app = express()
clearAll()

var greenLightLength = 20000
var redLightLength = 20000
var yellowLightLength = 4000

var redLightBlinkLength = 4000
var yellowLightBlinkLength = 4000

var isRunningNormal = false
var isRunningBlink = false

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.get('/timeconfig/:color/:length/:type', (request, response) => {
     if(request.params.type == "normal") {
        if(request.params.color.toLowerCase() == "red") {
            redLightLength = parseInt(request.params.length)
            response.sendStatus(200)
            return
         }
         if(request.params.color.toLowerCase() == "yellow") {
            yellowLightLength = parseInt(request.params.length)
            response.sendStatus(200)
            return 
         }
         if(request.params.color.toLowerCase() == "green") {
            greenLightLength = parseInt(request.params.length)
            response.sendStatus(200)
            return
         }
     }
     if(request.params.type == "blink") {
        if(request.params.color.toLowerCase() == "red") {
            redLightBlinkLength = parseInt(request.params.length)
            response.sendStatus(200)
            return
         }
         if(request.params.color.toLowerCase() == "yellow") {
            yellowLightLength = parseInt(request.params.length)
            yellowLightBlinkLength.sendStatus(200)
            return
         }
     }
     response.sendStatus(400)
    return
})
//color - red, yellow, green, none
app.get('/setLight/:color', (request, response)=> {
    isRunningNormal = false
    isRunningBlink = false // clearAll()
    if(request.params.color == "none") {
        clearAll()
        response.sendStatus(200)
    } else if(request.params.color == "green") {
        setGreenOnly()
        response.sendStatus(200)
        return
    } else if(request.params.color == "yellow") {
        setYellowOnly()
        response.sendStatus(200)
        return 
    } else if(request.params.color == "red") {
        setRedOnly()
        response.sendStatus(200)
        return
    }
    response.sendStatus(400)
    return
})
//Types = Normal, BlinkYellow, BlinkRed
app.get('/setFunction/:type', (request, response)=> {
    if(request.params.type == "normal") {
        isRunningNormal = false
        isRunningBlink = false
        setNormalLight()
        response.sendStatus(200)
        return
    } else if(request.params.type == "blinkyellow") {
        isRunningNormal = false
        isRunningBlink = false
        setBlink("yellow")
        response.sendStatus(200)
        return
    } else if(request.params.type == "blinkred") {
        isRunningNormal = false
        isRunningBlink = false
        setBlink("red")
        response.sendStatus(200)
        return
    }
})

function setBlink(color) {
    if(!isRunningBlink) {return}
    if(color == "yellow") {
        if(!isRunningBlink) {return}
        setYellowOnly()
        setTimeout(()=> {
            if(!isRunningBlink) {return}
            clearAll()
            setTimeout(()=> {
                if(!isRunningBlink) {return}
                setBlink(color)
            }, yellowLightBlinkLength)
        }, yellowLightBlinkLength)
    } else  if(color == "red") {
        if(!isRunningBlink) {return}
        setRedOnly()
        setTimeout(()=> {
            if(!isRunningBlink) {return}
            clearAll()
            setTimeout(()=> {
                if(!isRunningBlink) {return}
                setBlink(color)
            }, yellowLightBlinkLength)
        }, yellowLightBlinkLength)
    }
}


function setNormalLight() {
    //First go to green
    // var lightInterval = setInterval(()=> {
        if(!isRunningNormal) {return}
        isRunningNormal = true
        setGreenOnly()
        setTimeout(()=> {
            if(!isRunningNormal) {return}
            setYellowOnly()
            setTimeout(()=> {
                setRedOnly()
                if(!isRunningNormal) {return}
                setTimeout(()=> {
                    if(!isRunningNormal) {return}
                    setNormalLight()
                }, redLightLength)
            }, yellowLightLength)
        }, greenLightLength)   
}



setNormalLight()
function setRedOnly() {
    redLight.write(1)
    yellowLight.write(0)
    greenLight.write(0)
    io.emit("change", {
        "lightChange": "redOnly"
    })
}

function setYellowOnly() {
    redLight.write(0)
    yellowLight.write(1)
    greenLight.write(0)
    io.emit("change", {
        "lightChange": "yellowOnly"
    })
}

function setGreenOnly() {
    redLight.write(0)
    yellowLight.write(0)
    greenLight.write(1)
    io.emit("change", {
        "lightChange": "greenOnly"
    })
}

function clearAll() {
    redLight.write(0)
    yellowLight.write(0)
    greenLight.write(0)
    io.emit("change", {
        "lightChange": "allOff"
    })
}


app.listen(7890, () => {
    console.log(`Server is Listening on 7890`)
})
server.listen(7891)