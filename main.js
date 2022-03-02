class Cell {
    div = document.createElement('div');
    borderSize = 1;
    borderColor = '#1c4976';
    color = '#11273d';
    activeColor = '#c397fa';
    visitedColor = '#606bba';

    active = false;
    visited = false;

    leftWall = true;
    topWall = true;
    rightWall = true;
    bottomWall = true;

    constructor(x,y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
    }


    show(){
        grid.div.appendChild(this.div);
        this.div.style.height = this.w+'px';
        this.div.style.width = this.w+'px';
        this.div.style.position = 'absolute';
        this.div.style.left = this.x*this.w+'px';
        this.div.style.top = this.y*this.w+'px';
        this.div.style.boxSizing = 'border-box';
    }

    update(){
        if(this.leftWall){
            this.div.style.borderLeft = this.borderSize+'px solid '+this.borderColor;
        }else{
            this.div.style.borderLeft = 0+'px solid '+this.borderColor;
        }
        if(this.topWall){
            this.div.style.borderTop = this.borderSize+'px solid '+this.borderColor;
        }else{
            this.div.style.borderTop = 0+'px solid '+this.borderColor;
        }
        if(this.rightWall){
            this.div.style.borderRight = this.borderSize+'px solid '+this.borderColor;
        }else{
            this.div.style.borderRight = 0+'px solid '+this.borderColor;
        }
        if(this.bottomWall){
            this.div.style.borderBottom = this.borderSize+'px solid '+this.borderColor;
        }else{
            this.div.style.borderBottom = 0+'px solid '+this.borderColor;
        }
        if(this.active){
            this.div.style.background = this.activeColor;
        }else if(this.visited){
            this.div.style.background = this.visitedColor;
        }else{
            this.div.style.background = this.color;
        }
    }
}

class Grid {
    cells = [];
    div = document.createElement('div');
    rows = parseInt(document.getElementById('rows').value);
    cols = parseInt(document.getElementById('cols').value);
    cellWidth = parseInt(document.getElementById('size').value);

    show(){
        document.getElementById('target').appendChild(this.div);
        this.div.style.position = 'absolute';
        this.div.style.width = this.rows*this.cellWidth+'px';
        this.div.style.height = this.cols*this.cellWidth+'px';
        this.div.style.left = (window.innerWidth/2)-(this.rows*this.cellWidth/2)+'px';
        this.div.style.top = (window.innerHeight/2)-(this.cols*this.cellWidth/2)+'px';
        this.cells.forEach(cell => {
            cell.show();
        });
    }

    init(){
        this.cells = [];
        const randomX = Math.floor(Math.random()*this.rows);
        const randomY = Math.floor(Math.random()*this.cols);
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                const cell = new Cell(x,y,this.cellWidth);
                if(x === randomX && y === randomY){
                    cell.active = true;
                    cell.visited = true;
                    mazeMaker.activeCell = cell;
                    mazeMaker.stack.push(cell);
                }
                this.cells.push(cell);
            }
        }
        this.show();
    }
}

class MazeMaker{
    stack = [];
    activeCell;

    next(){
        if(this.stack.length){
            this.activeCell.active = false;
            const neighbours = this.neighbours(this.activeCell);
            if(neighbours.length){
                let index = Math.floor(Math.random()*neighbours.length);
                this.removeWalls(this.activeCell, neighbours[index]);
                this.activeCell = neighbours[index];
                this.activeCell.active = true;
                this.activeCell.visited = true;
                this.stack.push(this.activeCell);
            }else{
                this.activeCell = this.stack.pop();
                this.activeCell.active = true;
            }
        }
    }

    removeWalls(c1,c2){
        if(c1.x === c2.x){
            if(c1.y > c2.y){
                //c1 top c2 bottom
                c1.topWall = false;
                c2.bottomWall = false;
            }else{
                //c2 bottom c1 top
                c2.topWall = false;
                c1.bottomWall = false;
            }
        }else{
            if(c1.x > c2.x){
                //c1 left c2 right
                c1.leftWall = false;
                c2.rightWall = false;
            }else{
                //c1 right c2 left
                c2.leftWall = false;
                c1.rightWall = false;
            }
        }
    }

    neighbours(cell){
        const neighbours = [];
        grid.cells.forEach(c => {
            if(
                c.x+1 === cell.x && c.y === cell.y ||
                c.x-1 === cell.x && c.y === cell.y ||
                c.x === cell.x && c.y+1 === cell.y ||
                c.x === cell.x && c.y-1 === cell.y
            ){
                if(!c.visited){
                    neighbours.push(c);
                }
            }
        });
        return neighbours;
    }
}

let maxTic = 1001;
let tic = maxTic - parseInt(document.getElementById('speed').value);
let grid = new Grid();
let mazeMaker = new MazeMaker();
let keepGoing = true;

function main(){
    mazeMaker.next();
    grid.cells.forEach(cell => {
        cell.update();
    });
    if(keepGoing){
        setTimeout(main, tic);
    }
}

grid.init();
main();

document.getElementById('start').addEventListener('click', function (){
    keepGoing = false;
    document.getElementById('target').innerHTML = '';
    grid = new Grid();
    mazeMaker = new MazeMaker();
    grid.init();
    setTimeout(function (){
        keepGoing = true;
        main();
    }, 1000)
});

const inputs = Array.from(document.getElementsByTagName('input'));

inputs.forEach(input => {
   input.addEventListener('change', function (){
       let amount = parseInt(input.value);
       switch (input.id){
           case 'rows':
               grid.rows = amount;
               document.getElementById('rowSpan').innerText = amount+'';
               break;
           case 'cols':
               grid.cols = amount;
               document.getElementById('colSpan').innerText = amount+'';
               break;
           case 'speed':
               tic = maxTic - amount;
               document.getElementById('speedSpan').innerText = amount+'';
               break;
           case 'size':
               grid.cellWidth = amount;
               document.getElementById('sizeSpan').innerText = amount+'';
               break;
       }
   });
});
