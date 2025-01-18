import { Draw, Grid } from "./clases.js";
import { aStarSearch } from "./pathFinding.js";

const $canvas = document.getElementById('canvas');
$canvas.width = 500;
$canvas.height = 500;

const grid = new Grid(30, 30);
grid.setStart(1, 1);

Draw.drawGrid($canvas, grid);

const CELL_EDGE = $canvas.width / grid.cells.length;

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

    const offSetX = x % CELL_EDGE;
    const offSetY = y % CELL_EDGE;

    const i = (y - offSetY) / CELL_EDGE;
    const j = (x - offSetX) / CELL_EDGE;

    goal = grid.cells[i][j];
    goal.isGoal = true;

    path = aStarSearch(grid.getStart(), goal)

    for(let i = 0; i < path.length; i++){
        path[i].isPath = true;
    }

    Draw.drawGrid($canvas, grid);
})