import { Draw, Grid } from "./clases.js";
import { aStarSearch } from "./pathFinding.js";

const $canvas = document.getElementById('canvas');
$canvas.width = 500;
$canvas.height = 500;

const grid = new Grid(30, 30);
const CELL_EDGE = $canvas.width / grid.cells.length;

let start = false;
let goal = null;
let hoverPath = [];
let hover = null;
let prevCell = null;
let i = null;
let j = null;

let mouseX = null;
let mouseY = null;
let isMouseMoving = false;

$canvas.addEventListener('mousemove', function (e) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    isMouseMoving = true;
});

$canvas.addEventListener('click', function () {
    if (!start) {
        grid.setStart(i, j);
        start = true;
    } else if (start && goal) {
        if (hoverPath.length > 0) {
            for (let cell of hoverPath) {
                cell.isHover = false;
                cell.isPath = true;
            }
        }

        start = false;
        grid.setStart(null, null, true);

        goal = null;
        hoverPath = [];
        hover = null;
        prevCell = null;
        i = null;
        j = null;
    }
});

function update() {
    if (isMouseMoving) {
        const offSetX = mouseX % CELL_EDGE;
        const offSetY = mouseY % CELL_EDGE;

        const isAvailableI = Math.floor((mouseY - offSetY) / CELL_EDGE);
        const isAvailableJ = Math.floor((mouseX - offSetX) / CELL_EDGE);

        const isAvailableCell = grid.cells[isAvailableI][isAvailableJ]
        if(!isAvailableCell.isAvailable){
            return
        }

        i = isAvailableI;
        j = isAvailableJ;

        const currentCell = grid.cells[i][j];

        if (!start) {
            if (hover) hover.isHover = false;
            hover = currentCell;
            hover.isHover = true;
        } else {
            if (goal) goal.isGoal = false;

            if (currentCell !== prevCell) {
                if (goal) goal.isGoal = false;

                for (let cell of hoverPath) {
                    cell.isHover = false;
                }

                goal = currentCell;
                goal.isGoal = true;

                hoverPath = aStarSearch(grid.getStart(), goal);

                for (let cell of hoverPath) {
                    cell.isHover = true;
                }

                prevCell = currentCell;
            }
        }

        isMouseMoving = false;
    }
}

function render() {
    Draw.drawGrid($canvas, grid);
}

function gameLoop() {
    update(); 
    render(); 
    requestAnimationFrame(gameLoop);
}

gameLoop();
