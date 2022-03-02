import { Note } from "./note.js"
import { SliderLeftNote } from "./sliderleft.js"
import { SliderRightNote } from "./sliderright.js"
import { Export } from "./Export.js"


export let Mousedown = false


var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#A8DBA8',
    progressColor: '#3B8686',
    skipLength: 1,
    scrollParent: true,
    minPxPerSec: 1024,
});

const waveform = document.getElementById('waveform');
const waveformchild = waveform.children[waveform.children.length-1]
const progressbar = waveformchild.children[0]
let width;
let music
let tile;
let BPM;
let beat;
const play = document.getElementById('iconplay')
const iexport = document.getElementById('iconexport')
const ValidButton = document.getElementById('validmusic')
const filebutton = document.getElementById('bfile')
const checkbox = document.getElementById('checkmap')




let Line = [[],[],[],[]]
let Slider = [[],[]]

document.addEventListener("mousedown", ()=>{
    Mousedown = true
})

document.addEventListener("mouseup", ()=>{
    Mousedown = false
})

wavesurfer.zoom(1000);
wavesurfer.setVolume(0.75);
// wavesurfer.load('../audio/freestyle-funk.mp3');
wavesurfer.on('loading', function() {
    document.getElementById('loading').style.display = "block"
})
wavesurfer.on('ready', function() {
    document.getElementById("loadmusic").style.display = "none"
    document.getElementById('loading').style.display = "none"

    if(checkbox.checked){
        importTile();
    }else{
        createTile();
    }
    var timeline = Object.create(WaveSurfer.Timeline);
    timeline.init({
        primaryColor: '#A8DBA8',
        secondaryColor:'#EE82EE',
        primaryFontColor:"#ffffff",
        secondaryFontColor:"#ffffff",
        scrollParent: true,
        wavesurfer: wavesurfer,
        container: '#wave-timeline'
    });
})

document.getElementById("quitmenu").onclick = function (){
    document.getElementById("loadmusic").style.display = "none"
}

filebutton.onclick = function(){
    document.getElementById("loadmusic").style.display = "flex"
}




checkbox.onchange = function(){
    let checked =document.getElementById("map").disabled;
    if(checked){
        document.getElementById("map").disabled = false
        document.getElementById("BPM").disabled = true
        document.getElementById("select").disabled = true
    }else{
        document.getElementById("map").disabled = true
        document.getElementById("BPM").disabled = false
        document.getElementById("select").disabled = false
    }
    
}

document.getElementById("testmap").onclick = function(){
    var reader = new FileReader();
    reader.readAsText(document.getElementById("map").files[0]);
    reader.onload = function(){
        console.log(reader.result.search("--"))
    }
}

ValidButton.onclick = async function(e) {
        if(checkbox.checked){
            const promise = new Promise((resolve) => {
                var reader = new FileReader();
                let onbpm = "";
                let ontile = "";
                reader.readAsText(document.getElementById("map").files[0]);
                    reader.onload = function(){
                    for(let i = reader.result.search("bpm=") + "bpm=".length; reader.result[i] != "\n";i++){
                        onbpm += reader.result[i]
                    }
                    BPM = parseInt(onbpm)
                    console.log("BPM = ", BPM)
                
                    for(let i = reader.result.search("div=") + "div=".length; reader.result[i] != "\n";i++){
                        ontile += reader.result[i]
                    }
                    tile = parseInt(ontile)
                    resolve(reader.result)
                }
            })
            await promise

        }else if(valid()){

        }else{
            return
        }
        beat = Math.ceil(BPM/60 * tile)
        var file = document.getElementById("file").files[0];
        if (file) {
            document.getElementById("working").innerHTML = "Working on : " + document.getElementById("file").value.split(/(\\|\/)/g).pop()
            
            DeleteTile(function() {
                console.log('done!');
            })
            var reader = new FileReader();
            
            reader.onload = function(evt) {
                // Create a Blob providing as first argument a typed array with the file buffer
                var blob = new window.Blob([new Uint8Array(evt.target.result)]);
                music = blob
                getBlobDuration(music).then(function(duration) {
                    width = duration * 1024
                    console.log(duration)
                    document.getElementById("waveform").style.width = `${width}px`
                    document.getElementById("wave-timeline").style.width = `${width}px`
                });
                if(wavesurfer.isPlaying()){
                    play.classList.toggle("fa-pause")
                }
                
                wavesurfer.loadBlob(music);
                
            };
            
            reader.onerror = function(evt) {
                console.error("An error ocurred reading the file: ", evt);
            };
            
            // Read File as an ArrayBuffer
            reader.readAsArrayBuffer(file);
            
        }
};

function valid(){
    BPM = parseInt(document.getElementById("BPM").value)
    tile = parseInt(document.getElementById("select").value)

    if(BPM < 1){
        return false
    }
    return true
}

wavesurfer.on("scroll",function(){
    document.getElementById("aline").scroll(wavesurfer.drawer.getScrollX(),0)
})

play.onclick = function() {
    this.classList.toggle("fa-pause")
    wavesurfer.playPause();
};

iexport.onclick = function() {
    if(wavesurfer.isPlaying()){
        this.classList.toggle("fa-pause")
        wavesurfer.playPause();
    }
    let content = "";
    let count = 0
    let titleonwork = document.getElementById("file").value.split(/(\\|\/)/g).pop().replace("_"," ")
    let title = titleonwork.split("-")[1].replace(".mp3","")
    let artist = titleonwork.split("-")[0]
    content += `title=${title}
artist=${artist}
jacket=.jpg
difficulty=easy
bpm=${BPM}
file=${titleonwork}
vol=75
bg=
div=${tile}
--
`
    for(let i = 0; i < Line[0].length;i++){
        count++
        for(let l = 0; l < 4;l++){
            content += Line[l][i].value;
        }
        content += `|00\n`
        if(count%tile == 0){
            content += "--\n"
        }


    }
    if(content != ""){
        title.replace(" ", "-")
        var filename = `${title}-${artist}.pe`;
        download(filename, content);
    }
};

document.body.onkeyup = function(e){
    
    let tile = Math.floor(wavesurfer.getCurrentTime()) * beat + (wavesurfer.getCurrentTime() - Math.floor(wavesurfer.getCurrentTime())) * beat -1

    if(e.keyCode == 32){
        play.classList.toggle("fa-pause")
        wavesurfer.playPause();
        let tile = wavesurfer.getCurrentTime() * beat
        console.log(tile)
    }
    if(e.keyCode == 37){
        wavesurfer.skipBackward()
        document.getElementById("aline").scroll(parseInt(progressbar.style.width)-window.innerWidth/2,0)
    }
    if(e.keyCode == 39){
        wavesurfer.skipForward()
        document.getElementById("aline").scroll(parseInt(progressbar.style.width)-window.innerWidth/2,0)
    }
    if(e.keyCode == 83){
        Line[0][Math.floor(tile)-2].Toggle();
    }
    if(e.keyCode == 68){
        Line[1][Math.floor(tile)-2].Toggle();
    }
    if(e.keyCode == 76){
        Line[2][Math.floor(tile)-2].Toggle();
    }
    if(e.keyCode == 77){
        Line[3][Math.floor(tile)-2].Toggle();
    }
}

document.body.onkeypress = function(e){

}


document.querySelector('#volume').oninput = function() {
    wavesurfer.setVolume(Number(this.value) / 1000);
};


wavesurfer.on('audioprocess',function(){
    document.getElementById("aline").scroll(parseInt(progressbar.style.width)-window.innerWidth/2, 0)
})

function createTile(){
    let line = document.querySelectorAll('.line');
    let countline = 0;
    line.forEach(e=>{
        e.style.width = width
        for( let i = 0; i <wavesurfer.getDuration()*beat;i++){
            if ((i+1)%beat == 0){
                Line[countline].push(new Note(e, (width/wavesurfer.getDuration())/beat-3, ((i+1)/beat).toString(),"lastnote"))
            }else{
                Line[countline].push(new Note(e, (width/wavesurfer.getDuration())/beat-1,"", "note"))
            }
        }
        countline++;
    })
    // let slider = document.querySelectorAll('.slider');
    // slider[0].style.width = width
    // slider[1].style.width = width
    // for( let i = 0; i <wavesurfer.getDuration()*beat;i++){
    //     if ((i+1)%beat == 0){
    //         Slider[0].push(new SliderLeftNote(slider[0], (width/wavesurfer.getDuration())/beat-3, ((i+1)/beat).toString(),"slideleftlastnote"))
    //         Slider[1].push(new SliderRightNote(slider[1], (width/wavesurfer.getDuration())/beat-3, ((i+1)/beat).toString(),"sliderightlastnote"))
    //     }else{
    //         Slider[0].push(new SliderLeftNote(slider[0], (width/wavesurfer.getDuration())/beat-1,"", "slideleftnote"))
    //         Slider[1].push(new SliderRightNote(slider[1], (width/wavesurfer.getDuration())/beat-1,"", "sliderightnote"))
    //     }
    // }
}

function importTile(){
    var reader = new FileReader();
    reader.readAsText(document.getElementById("map").files[0]);
    reader.onload = function(){
        console.log(beat)
        let line = document.querySelectorAll('.line');
        let countline = 0;
        let tileCount = 0;
        let read = true
        let test = ""
        console.log(line[0])
        console.log(line[1])
        console.log(line[2])
        console.log(line[3])
        line[0].style.width = width
        line[1].style.width = width
        line[2].style.width = width
        line[3].style.width = width
        for(let i = reader.result.search("--") + "--\n".length;i<reader.result.length;i++){
            
            if (reader.result[i] == "|" ||reader.result[i] == "-"){
                read = false
            }
            if (read){
                let note 
                if(countline>=4){
                    tileCount++
                    countline = 0
                }
                if ((tileCount+1)%beat == 0){
                    note = new Note(line[countline], (width/wavesurfer.getDuration())/beat-3, ((tileCount+1)/beat).toString(),"lastnote")
                    Line[countline].push(note)
                }else{
                    note = new Note(line[countline], (width/wavesurfer.getDuration())/beat-1,"", "note")
                    Line[countline].push(note)
                }
                if(reader.result[i] == "1"){
                    note.Toggle()
                }


                countline++
            }
            if(reader.result[i] == "\n"){
                test = ""
                read = true
            }

        }
    }
}


function DeleteTile(_callback){
    Line = [[],[],[],[]]
    let line = document.querySelectorAll('.note');
    line.forEach(e=>{
        e.remove()
    })
    line = document.querySelectorAll('.lastnote');
    line.forEach(e=>{
        e.remove()
    })
    _callback();
}


async function getBlobDuration(blob) {
    const tempVideoEl = document.createElement('video')
  
    const durationP = new Promise((resolve, reject) => {
      tempVideoEl.addEventListener('loadedmetadata', () => {
        if(tempVideoEl.duration === Infinity) {
          tempVideoEl.currentTime = Number.MAX_SAFE_INTEGER
          tempVideoEl.ontimeupdate = () => {
            tempVideoEl.ontimeupdate = null
            resolve(tempVideoEl.duration)
            tempVideoEl.currentTime = 0
          }
        }
        // Normal behavior
        else
          resolve(tempVideoEl.duration)
      })
      tempVideoEl.onerror = (event) => reject(event.target.error)
    })
  
    tempVideoEl.src = typeof blob === 'string' || blob instanceof String
      ? blob
      : window.URL.createObjectURL(blob)
  
    return durationP
  }

  window.onbeforeunload = function(event)
  {
      return confirm("Confirm refresh");
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