import { Mousedown } from "./Waveform.js"


export class Note{
    constructor(parent,width,text,isclass){
        this.parent = parent
        this.container = document.createElement(`div`)
        this.width = width
        this.container.classList.toggle(isclass)
        this.container.style.width = `${width}px`
        this.container.innerHTML = text
        this.value = 0

        parent.appendChild(this.container)

        this.onclick()
    }


    onclick(){
        this.container.addEventListener('mouseover', event =>{
            if(Mousedown){
                if (this.value == 0){
                    this.value = 1
                }else{
                    this.value = 0
                }
                this.container.classList.toggle("pressnote")
            }
        })
        this.container.addEventListener("mousedown", ()=>{
            if (this.value == 0){
                this.value = 1
            }else{
                this.value = 0
            }
            this.container.classList.toggle("pressnote")
        })
    }

    Toggle(){
        if (this.value == 0){
            this.value = 1;
            this.container.classList.toggle("pressnote")
        }
    }
}