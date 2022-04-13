
export class SliderLeft{
    constructor(parent,width,index,text,isclass){
        this.AllLine = ["linedra1","linedra2","linedra3","linedra4","linedra5"]
        this.index = index
        this.parent = parent

        this.container = document.createElement(`div`)

        this.container.innerHTML = text
        this.width = width
        this.container.classList.toggle(isclass)
        this.container.style.width = `${width}px`

        this.line = document.createElement('div')


        this.value = 0
        
        this.container.appendChild(this.line)
        parent.appendChild(this.container)

        this.onclick()
    }

    onclick(){
        this.container.addEventListener("mousedown", ()=>{
            if(this.value + 1 > 4){
                this.line.classList.toggle(this.AllLine[this.value])
                this.value = 0
                return
            }
            this.line.classList.toggle(this.AllLine[this.value])
            this.value++
            this.line.classList.toggle(this.AllLine[this.value])
        })
    }


}
