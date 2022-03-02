export class Export{
    constructor(line){
        this.export(line)
    }

    export(Line){
        let content = "";
        for(let i = 0; i < Line[0].length;i++){
            for(let l = 0; l < 4;l++){
                content += Line[l][i].value.toString;
            }
            content += "|00|\n"
        }
        fs.appendFile('export.txt', content, function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
    }
}