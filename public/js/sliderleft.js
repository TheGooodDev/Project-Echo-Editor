import {TabSlideLeft, drawLeft} from "./Waveform.js"


export class SliderLeft{
    constructor(parent,width,index,text,isclass){
        this.AllLine = ["linedra1","linedra2","linedra3","linedra4","linedra5"]
        this.index = index
        this.parent = parent

        this.container = document.createElement(`div`)
        this.container.innerHTML = text
        this.container.classList.toggle(isclass)
        this.container.style.width = `${width}px`

        this.line = document.createElement('div')


        this.value = 0


        
        this.container.appendChild(this.line)
        parent.appendChild(this.container)

        //slide
        this.activated = false
        this.rect = this.container.getBoundingClientRect();
        this.x =this.container.offsetLeft + this.container.offsetWidth/2
        this.y =this.container.offsetTop  + this.container.offsetHeight/2

        this.onclick()
    }

    onclick(){
        this.container.addEventListener("mousedown", ()=>{
            this.value++
            if(this.index != 0){
                let previous = TabSlideLeft[this.index-1].y
            }else{
                let previous = this.y
            }
            switch(this.value){
                case 1:
                    this.container.style.backgroundColor = "#DDFFF7"
                    this.container.innerHTML = "1"
                    this.activated = true
                    this.y = (this.container.offsetTop  + this.container.offsetHeight/2) * 1
                    break
                case 2:
                    this.container.style.backgroundColor = "#93E1D8"
                    this.container.innerHTML = "2"
                    break
                case 3:
                    this.container.style.backgroundColor = "#FFA69E"
                    this.container.innerHTML = "3"

                    break
                case 4:
                    this.container.style.backgroundColor = "#AA4465"
                    this.container.innerHTML = "4"

                    this.y =  this.container.offsetTop  + this.container.offsetHeight/2
                    break
                case 5:
                    this.container.style.backgroundColor = "#861657"
                    this.container.innerHTML = "5"

                    this.y =  this.container.offsetTop  - this.container.offsetHeight/2 + this.container.offsetHeight * 6
                    break
                default:
                    this.container.style.backgroundColor = ""
                    this.container.innerHTML = ""
                    this.y =this.container.offsetTop  + this.container.offsetHeight/2
                    this.activated = false
                    this.value = 0
            }

            drawLeft()
        })
    }


}
