import { Note } from "./note.js"
import { SliderLeft } from "./SliderLeft.js";

export let Mousedown = false


var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#A8DBA8',
    progressColor: '#3B8686',
    skipLength: 1,
    scrollParent: true,
    minPxPerSec: 1024,
});

const jsmediatags = window.jsmediatags;

const waveform = document.getElementById('waveform');
const waveformchild = waveform.children[waveform.children.length - 1]
const progressbar = waveformchild.children[0]


const allCanvas = []
const allslide = document.getElementById('allslide')

function createCanvas(){
    for(let i = 1; i < width/ 32000; i ++){
        allCanvas.push(document.createElement("canvas"))
        allCanvas[i-1].width = 32000
        allCanvas[i-1].style.left = (i-1) * 32000
        allCanvas[i-1].height = allslide.offsetHeight
        allCanvas[i-1].style.zIndex = 10
        allCanvas[i-1].classList.add("canvas")
        allslide.appendChild(allCanvas[i-1])
    }
    allCanvas.push(document.createElement("canvas"))
    allCanvas[allCanvas.length-1].width = 32000*(width/32000 - Math.floor(width/32000))
    allCanvas[allCanvas.length-1].style.left = 32000* Math.floor(width/32000)
    allCanvas[allCanvas.length-1].height = allslide.offsetHeight
    allCanvas[allCanvas.length-1].style.zIndex = 10
    allCanvas[allCanvas.length-1].classList.add("canvas")
    allslide.appendChild(allCanvas[allCanvas.length-1])
    console.log()
}

// Canvas Properties


let width;

//Music Property
let music
let tile;
let BPM;
let beat;


//Music Detail
let Artist;
let SongName;
let FileName;

//Button & Container
const play = document.getElementById('iconplay')
const iexport = document.getElementById('iconexport')
const ValidButton = document.getElementById('validmusic')
const filebutton = document.getElementById('bfile')
const checkbox = document.getElementById('checkmap')
const test = document.getElementById("test")
const del = document.getElementById("del")

test.onclick = function () {
draw()
}

del.onclick = function (){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Tab for export
let Line = [[], [], [], []]

export let TabSlideLeft = []


//Setup
wavesurfer.zoom(1000);
wavesurfer.setVolume(0.75);






//Event on page
document.addEventListener("mousedown", () => {
    Mousedown = true
})

document.addEventListener("mouseup", () => {
    Mousedown = false
})

filebutton.onclick = function () {
    document.getElementById("loadmusic").style.display = "flex"
}

document.getElementById("quitmenu").onclick = function () {
    document.getElementById("loadmusic").style.display = "none"
}

wavesurfer.on('audioprocess', function () {
    document.getElementById("aline").scroll(parseInt(progressbar.style.width) - window.innerWidth / 2, 0)
})

checkbox.onchange = function () {
    let checked = document.getElementById("map").disabled;
    if (checked) {
        document.getElementById("map").disabled = false
        document.getElementById("BPM").disabled = true
        document.getElementById("select").disabled = true
    } else {
        document.getElementById("map").disabled = true
        document.getElementById("BPM").disabled = false
        document.getElementById("select").disabled = false
    }

}

play.onclick = function () {
    draw()
    console.log("test")
    Pause()
};

document.body.onkeyup = function (e) {

    let tile = Math.floor(wavesurfer.getCurrentTime()) * beat + (wavesurfer.getCurrentTime() - Math.floor(wavesurfer.getCurrentTime())) * beat - 1

    if (e.keyCode == 32) {
        Pause()
        wavesurfer.playPause();
        let tile = wavesurfer.getCurrentTime() * beat
        console.log(tile)
    }
    if (e.keyCode == 37) {
        wavesurfer.skipBackward()
        document.getElementById("aline").scroll(parseInt(progressbar.style.width) - window.innerWidth / 2, 0)
    }
    if (e.keyCode == 39) {
        wavesurfer.skipForward()
        document.getElementById("aline").scroll(parseInt(progressbar.style.width) - window.innerWidth / 2, 0)
    }
    if (e.keyCode == 83) {
        Line[0][Math.floor(tile) - 2].Toggle();
    }
    if (e.keyCode == 68) {
        Line[1][Math.floor(tile) - 2].Toggle();
    }
    if (e.keyCode == 76) {
        Line[2][Math.floor(tile) - 2].Toggle();
    }
    if (e.keyCode == 77) {
        Line[3][Math.floor(tile) - 2].Toggle();
    }
}

window.onbeforeunload = function (event) {
    return confirm("Confirm refresh");
};



//WaveSurfer

ValidButton.onclick = async function (e) {
    if (checkbox.checked) {
        const promise = new Promise((resolve) => {
            var reader = new FileReader();
            let onbpm = "";
            let ontile = "";
            reader.readAsText(document.getElementById("map").files[0]);
            reader.onload = function () {
                for (let i = reader.result.search("bpm=") + "bpm=".length; reader.result[i] != "\n"; i++) {
                    onbpm += reader.result[i]
                }
                BPM = parseInt(onbpm)
                console.log("BPM = ", BPM)

                for (let i = reader.result.search("div=") + "div=".length; reader.result[i] != "\n"; i++) {
                    ontile += reader.result[i]
                }
                tile = parseInt(ontile)
                resolve(reader.result)
            }
        })
        await promise

    } else if (valid()) {

    } else {
        return
    }
    beat = Math.ceil(BPM / 60 * tile)
    var file = document.getElementById("file").files[0];
    getFileTags(file)
    if (file) {


        DeleteTile(function () {
            console.log('done!');
        })
        var reader = new FileReader();

        reader.onload = function (evt) {
            // Create a Blob providing as first argument a typed array with the file buffer
            var blob = new window.Blob([new Uint8Array(evt.target.result)]);
            music = blob
            getBlobDuration(music).then(function (duration) {
                width = duration * 1024
                document.getElementById("waveform").style.width = `${width}px`
                document.getElementById("wave-timeline").style.width = `${width}px`

            });
            if (wavesurfer.isPlaying()) {
                play.classList.toggle("fa-pause")
            }

            wavesurfer.loadBlob(music);

        };

        reader.onerror = function (evt) {
            console.error("An error ocurred reading the file: ", evt);
        };

        // Read File as an ArrayBuffer
        reader.readAsArrayBuffer(file);


    }
};

wavesurfer.on('loading', function () {
    document.getElementById('loading').style.display = "block"
})
wavesurfer.on('ready', function () {
    document.getElementById("loadmusic").style.display = "none"
    document.getElementById('loading').style.display = "none"

    if (checkbox.checked) {
        importTile();
    } else {
        createTile();
    }

    createCanvas()
    // ctx = canvas.getContext('2d');
    var timeline = Object.create(WaveSurfer.Timeline);
    timeline.init({
        primaryColor: '#A8DBA8',
        secondaryColor: '#EE82EE',
        primaryFontColor: "#ffffff",
        secondaryFontColor: "#ffffff",
        scrollParent: true,
        wavesurfer: wavesurfer,
        container: '#wave-timeline'
    });

})

wavesurfer.on("scroll", function () {
    document.getElementById("aline").scroll(wavesurfer.drawer.getScrollX(), 0)
})


document.querySelector('#volume').oninput = function () {
    wavesurfer.setVolume(Number(this.value) / 1000);
};


//Utils

function getFileTags(file) { //Get metadata from audio file
    FileName = document.getElementById("file").value.split(/(\\|\/)/g).pop()

    jsmediatags.read(file, {
        onSuccess: function (tag) {
            // Output media tags
            Artist = tag.tags.artist
            SongName = tag.tags.title
            document.getElementById("working").innerHTML = `Working on : ${SongName} - ${Artist}`
        },
        onError: function (error) {
            console.log(error);
        }
    });
    
}


function valid() { // Check form entry
    BPM = parseInt(document.getElementById("BPM").value)
    tile = parseInt(document.getElementById("select").value)

    if (BPM < 1) {
        return false
    }
    return true
}

function Pause(){
    play.classList.toggle("fa-pause")
    play.classList.toggle("fa-play")
    wavesurfer.playPause();
}




//Export

iexport.onclick = function () {
    if (wavesurfer.isPlaying()) {
        Pause()
    }
    let content = "";
    let count = 0
    content += `title=${SongName}
artist=${Artist}
jacket=.jpg
difficulty=easy
bpm=${BPM}
file=${FileName}
vol=75
bg=
div=${tile}
--
`
    for (let i = 0; i < Line[0].length; i++) {
        count++
        for (let l = 0; l < 4; l++) {
            content += Line[l][i].value;
        }
        content += `|00\n`
        if (count % tile == 0) {
            content += "--\n"
        }


    }
    if (content != "") {
        
        var filename = `${SongName.replace(" ", "-")}_${Artist.replace(" ", "-")}.pe`;
        download(filename, content);
    }
};

function download(file, text) {
    var element = document.createElement('a');
    element.setAttribute('href',
        'data:text/plain;charset=utf-8,'
        + encodeURIComponent(text));
    element.setAttribute('download', file);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


//Tile Relative Function

function createTile() {
    let line = document.querySelectorAll('.line');
    let countline = 0;
    line.forEach(e => {
        e.style.width = width
        
        for (let i = 0; i < wavesurfer.getDuration() * beat; i++) {
            if ((i + 1) % beat == 0) {
                Line[countline].push(new Note(e, (width / wavesurfer.getDuration()) / beat - 3, ((i + 1) / beat).toString(), "lastnote"))
            } else {
                Line[countline].push(new Note(e, (width / wavesurfer.getDuration()) / beat - 1, "", "note"))
            }
        }
        countline++;
    })
    document.querySelectorAll('.slider').forEach(e=>{
        e.style.width = width
        for (let i = 0; i < wavesurfer.getDuration() * beat; i++) {
            if ((i + 1) % beat == 0) {
            TabSlideLeft.push(new SliderLeft(e,(width / wavesurfer.getDuration()) / beat - 1,i,((i + 1) / beat).toString(),"slideleftlastnote"))
            }else{
                TabSlideLeft.push(new SliderLeft(e,(width / wavesurfer.getDuration()) / beat - 1,i,"","slideleftnote"))
            }
        }
    })
}


function importTile() {
    var reader = new FileReader();
    reader.readAsText(document.getElementById("map").files[0]);
    reader.onload = function () {
        console.log(beat)
        let line = document.querySelectorAll('.line');
        let countline = 0;
        let tileCount = 0;
        let read = true
        let test = ""
        line[0].style.width = width
        line[1].style.width = width
        line[2].style.width = width
        line[3].style.width = width
        for (let i = reader.result.search("--") + "--\n".length; i < reader.result.length; i++) {

            if (reader.result[i] == "|" || reader.result[i] == "-") {
                read = false
            }
            if (read) {
                let note
                if (countline >= 4) {
                    tileCount++
                    countline = 0
                }
                if ((tileCount + 1) % beat == 0) {
                    note = new Note(line[countline], (width / wavesurfer.getDuration()) / beat - 3, ((tileCount + 1) / beat).toString(), "lastnote")
                    Line[countline].push(note)
                } else {
                    note = new Note(line[countline], (width / wavesurfer.getDuration()) / beat - 1, "", "note")
                    Line[countline].push(note)
                }
                if (reader.result[i] == "1") {
                    note.Toggle()
                }


                countline++
            }
            if (reader.result[i] == "\n") {
                test = ""
                read = true
            }

        }
    }
}


function DeleteTile(_callback) {
    Line = [[], [], [], []]
    let line = document.querySelectorAll('.note');
    line.forEach(e => {
        e.remove()
    })
    line = document.querySelectorAll('.lastnote');
    line.forEach(e => {
        e.remove()
    })
    _callback();
}


//Blop relative Function

async function getBlobDuration(blob) {

    const tempAudioEl = document.createElement('audio')
    const durationP = new Promise((resolve, reject) => {
        tempAudioEl.addEventListener('loadedmetadata', () => {
            if (tempAudioEl.duration === Infinity) {
                tempAudioEl.currentTime = Number.MAX_SAFE_INTEGER
                tempAudioEl.ontimeupdate = () => {
                    tempAudioEl.ontimeupdate = null
                    resolve(tempAudioEl.duration)
                    tempAudioEl.currentTime = 0
                }
            }
            // Normal behavior
            else
                resolve(tempAudioEl.duration)
        })
        tempAudioEl.onerror = (event) => reject(event.target.error)
    })

    tempAudioEl.src = typeof blob === 'string' || blob instanceof String
        ? blob
        : window.URL.createObjectURL(blob)
    return durationP
}

export function drawLeft() {
    // set line stroke and line width

    clearcanvas()

    // ctx.lineWidth = 5;

    // // draw a red line
    // ctx.strokeStyle = 'blue';
    // ctx.beginPath();
    // let first = TabSlideLeft[0]
    // ctx.moveTo(first.x, first.y);
    TabSlideLeft.forEach(e =>{
        if((width / wavesurfer.getDuration() / beat - 1)%32000 == 0){
            console.log("succ")
        }
        if(e.activated){
            ctx.lineTo(e.x,e.y)
            ctx.strokeStyle = 'red';
        }else{
            ctx.moveTo(e.x , e.y);
            ctx.strokeStyle = 'blue';
        }
    })
    ctx.stroke();
}

// Canvas

function clearcanvas(){
    allCanvas.forEach(e=>{
        let ctx = e.getContext('2d');
        ctx.clearRect(0, 0, e.width, e.height);
    })
}