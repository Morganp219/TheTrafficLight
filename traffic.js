let redLightDoc = document.getElementById("red")
let yellowLightDoc = document.getElementById("yellow")
let greenLightDoc = document.getElementById("green")
let alertBarDoc = document.getElementById("status")
var url = window.location.hostname
var alertBar = ""
const socket = io(url)

socket.on("connect", () => {
 alertBar = "Connected"
 setTimeout(()=> {
    alertBar = ""
 }, 2000)   
})

socket.on("connect_error", (data)=> {
    console.log(data)
    if(data) {
        alertBar = "Connection Error"
    }
})
socket.on("change", (data) => {
    if(data.lightChange == "redOnly") {
        setRedOnly()
    } else if(data.lightChange == "yellowOnly") {
        setYellowOnly()
    } else if(data.lightChange == "greenOnly") {
        setGreenOnly()
    } else if(data.lightChange == "allOff") {
        clearAll()
    }
})


setInterval(()=> {
    alertBarDoc.innerHTML = alertBar
}, 500)


function setColor(color) {
    alertBar = "Setting Color " + color + ", Please Wait until end of Cycle for change."
    setTimeout(()=> {
       alertBar = ""
    }, 2000)
    fetch(`/setLight/${color}`).then((res) => {
        console.log(res)
    })
}

function setFunction(type) {
    alertBar = "Setting Color " + color + ", Please Wait until end of Cycle for change."
    setTimeout(()=> {
       alertBar = ""
    }, 2000)
    fetch(`/setFunction/${type}`).then((res) => {
        console.log(res)
    })
}


function setRedOnly() {
    redLightDoc.classList.remove("opacity-25")
    yellowLightDoc.classList.add("opacity-25")
    greenLightDoc.classList.add("opacity-25")
}

function setYellowOnly() {
    redLightDoc.classList.add("opacity-25")
    yellowLightDoc.classList.remove("opacity-25")
    greenLightDoc.classList.add("opacity-25")
}

function setGreenOnly() {
    redLightDoc.classList.add("opacity-25")
    yellowLightDoc.classList.add("opacity-25")
    greenLightDoc.classList.remove("opacity-25")
}

function clearAll() {
    redLightDoc.classList.add("opacity-25")
    yellowLightDoc.classList.add("opacity-25")
    greenLightDoc.classList.add("opacity-25")
}