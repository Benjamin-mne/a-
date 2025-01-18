export class Cell {
    i;
    j;
    neighbour = [];
    isStart = false;
    isGoal = false;
    isPath = false;
    isAvailable = true;
    g; 
    h;
    f;

    constructor(i, j){
        this.i = i;
        this.j = j;
    }
}

export class Grid {
    cells = [];
    start = {
        i: undefined,
        j: undefined
    };

    constructor(rows, columns){
        this.cells = this.createGrid(rows, columns)
        this.findNeighbours()
    }

    setStart(i, j){
        if(this.start.i && this.start.j){
            this.cells[this.start.i][this.start.j].isStart = false;
        }

        this.start.i = i;
        this.start.j = j;
        
        this.cells[this.start.i][this.start.j].isStart = true;
    }

    getStart(){
        return this.cells[this.start.i][this.start.j];
    }

    createGrid(rows, columns){
        let grid = [];
    
        for(let i = 0; i < rows; i++){
            let row = []; 
    
            for(let j = 0; j < columns; j++){
                const cell = new Cell(i, j);
    
                if(Math.random() > 0.8){
                    cell.isAvailable = false;
                }
    
                row.push(cell);
            }
    
            grid.push(row);
        }
    
        return grid;
    }

    findNeighbours(){
        for(let i = 0; i < this.cells.length; i++){
            const quantityColumns = this.cells[i].length - 1;
    
            for(let j = 0; j < quantityColumns + 1; j++){
                const cell = this.cells[i][j];
    
                if(cell.j > 0){
                    cell.neighbour.push(this.cells[i][j - 1])
                }
                if(cell.j < quantityColumns){
                    cell.neighbour.push(this.cells[i][j + 1])
                }
                if(cell.i > 0){
                    cell.neighbour.push(this.cells[i - 1][j])
                }
                if(cell.i < quantityColumns){
                    cell.neighbour.push(this.cells[i + 1][j])
                }
            }
        }
    }
}

export class Draw {

    static drawGrid($canvas, grid){
        const ctx = $canvas.getContext('2d');
        const cells = grid.cells;
        const CELL_EDGE = $canvas.width / cells.length;
    
        for(let i = 0; i < cells.length; i++){
            const quantityColumns = cells[i].length;
    
            for(let j = 0; j < quantityColumns; j++){
                ctx.fillStyle = 
                    cells[i][j].isStart ? "rgb(0, 0, 255)" :
                    (cells[i][j].isGoal | cells[i][j].isPath) ? "rgb(0, 255, 0)": 
                    !cells[i][j].isAvailable ? "rgb(0, 0, 0)" : 
                    "rgb(255, 255, 255)";
                ctx.fillRect(CELL_EDGE * j, CELL_EDGE * i, CELL_EDGE, CELL_EDGE);
                
                ctx.strokeStyle = "rgb(0, 0, 0)";
                ctx.strokeRect(CELL_EDGE * j, CELL_EDGE * i, CELL_EDGE, CELL_EDGE);
            }
        }
    }
}