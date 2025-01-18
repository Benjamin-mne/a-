export class Cell {
    i;
    j;
    neighbour = [];
    isStart = false;
    isGoal = false;
    isPath = false;
    isHover = false;
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
        i: null,
        j: null
    };

    constructor(rows, columns){
        this.cells = this.createGrid(rows, columns);
        this.findNeighbours();
    }

    setStart(i, j, restore = false){
        if(restore){
            this.cells[this.start.i][this.start.j].isStart = false;
            return
        }

        const solicitedCell = this.cells[i][j];

        if(solicitedCell.isAvailable){
            if(this.start.i || this.start.j){
                this.cells[this.start.i][this.start.j].isStart = false;
            }

            this.start.i = i;
            this.start.j = j;

            this.cells[this.start.i][this.start.j].isStart = true;
        }
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

    findNeighbours() {
        const rows = this.cells.length;
        const columns = this.cells[0].length;
    
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const cell = this.cells[i][j];
    
                if (j > 0) {
                    cell.neighbour.push(this.cells[i][j - 1]);
                }
    
                if (j < columns - 1) {
                    cell.neighbour.push(this.cells[i][j + 1]);
                }
    
                if (i > 0) {
                    cell.neighbour.push(this.cells[i - 1][j]);
                }
    
                if (i < rows - 1) {
                    cell.neighbour.push(this.cells[i + 1][j]);
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
                    (cells[i][j].isStart && cells[i][j].isAvailable) ? "rgb(0, 0, 255)" :
                    (cells[i][j].isHover && cells[i][j].isAvailable) ? "rgb(255, 255, 0)" :
                    ((cells[i][j].isGoal | cells[i][j].isPath) && cells[i][j].isAvailable) ? "rgb(0, 255, 0)": 
                    !cells[i][j].isAvailable ? "rgb(0, 0, 0)" : 
                    "rgb(255, 255, 255)";
                ctx.fillRect(CELL_EDGE * j, CELL_EDGE * i, CELL_EDGE, CELL_EDGE);
                
                ctx.strokeStyle = "rgb(0, 0, 0)";
                ctx.strokeRect(CELL_EDGE * j, CELL_EDGE * i, CELL_EDGE, CELL_EDGE);
            }
        }
    }
}