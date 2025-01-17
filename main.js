const $canvas = document.getElementById('canvas')
$canvas.width = 500;
$canvas.height = 500;

const ctx = $canvas.getContext("2d");

class Cell {
    i;
    j;
    neighbour = [];
    isStart = false;
    isGoal = false;
    isPath = false;
    isAvailable = true;

    constructor(i, j){
        this.i = i;
        this.j = j;
    }
}

function createGrid(rows, columns){
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

function findNeighbours(grid){

    for(let i = 0; i < grid.length; i++){
        const quantityColumns = grid[i].length - 1;

        for(let j = 0; j < quantityColumns + 1; j++){
            const cell = grid[i][j];

            if(cell.j > 0){
                cell.neighbour.push(grid[i][j - 1])
            }
            if(cell.j < quantityColumns){
                cell.neighbour.push(grid[i][j + 1])
            }
            if(cell.i > 0){
                cell.neighbour.push(grid[i - 1][j])
            }
            if(cell.i < quantityColumns){
                cell.neighbour.push(grid[i + 1][j])
            }
        }
    }
}

function drawGrid(grid, ctx){
    const cellEdge = $canvas.width / grid.length;

    for(let i = 0; i < grid.length; i++){
        const quantityColumns = grid[i].length;

        for(let j = 0; j < quantityColumns; j++){
            ctx.fillStyle = 
                grid[i][j].isStart ? "rgb(0, 0, 255)" :
                (grid[i][j].isGoal | grid[i][j].isPath) ? "rgb(0, 255, 0)": 
                !grid[i][j].isAvailable ? "rgb(0, 0, 0)" : 
                "rgb(255, 255, 255)";
            ctx.fillRect(cellEdge * j, cellEdge * i, cellEdge, cellEdge);
            
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(cellEdge * j, cellEdge * i, cellEdge, cellEdge);
        }
    }
}

const grid = createGrid(30, 30);
const start = grid[1][1]

start.isStart = true;

findNeighbours(grid);
drawGrid(grid, ctx);

mouseListener();

function aStarSearch(start, goal) {
    start.g = 0;
    start.h = Math.abs(goal.i - start.i) + Math.abs(goal.j - start.j);
    start.f = start.g + start.h;

    let openList = [start];
    let closedList = [];

    while (openList.length > 0) {
        openList.sort((a, b) => a.f - b.f);
        let current = openList.shift();
        
        if (current.i === goal.i && current.j === goal.j) {
            let path = [];
            while (current) {
                path.push(current);
                current = current.parent;
            }
            return path.reverse();
        }

        closedList.push(current);

        current.neighbour
            .filter(neighbour => neighbour.isAvailable && !closedList.includes(neighbour))
            .forEach(neighbour => {
                let tentativeG = current.g + 1;

                if (!openList.includes(neighbour) || tentativeG < neighbour.g) {
                    neighbour.g = tentativeG;
                    neighbour.h = Math.abs(goal.i - neighbour.i) + Math.abs(goal.j - neighbour.j);
                    neighbour.f = neighbour.g + neighbour.h;
                    neighbour.parent = current;

                    if (!openList.includes(neighbour)) {
                        openList.push(neighbour);
                    }
                }
            });
    }

    return [];
}

function mouseListener(){
    const cellEdge = $canvas.width / grid.length;
    let goal = undefined;
    let path = [];

    $canvas.addEventListener('mousemove', function(e){
        if(goal){
            goal.isGoal = false;
        }

        if(path.length > 0){
            for(let i = 0; i < path.length; i++){
                path[i].isPath = false;
            }
        }

        const { offsetX: x, offsetY: y } = e;
    
        const offSetX = x % cellEdge;
        const offSetY = y % cellEdge;

        const i = (y - offSetY) / cellEdge;
        const j = (x - offSetX) / cellEdge;

        goal = grid[i][j];
        goal.isGoal = true;

        path = aStarSearch(start, goal)

        for(let i = 0; i < path.length; i++){
            path[i].isPath = true;
        }

        drawGrid(grid, ctx);

        $canvas.addEventListener('click', function() {
            goal.isGoal = false;
            goal.path = true;

            dragMode = false;
            startMode = true;

            return
        })
    }        
)}
