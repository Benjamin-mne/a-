export function aStarSearch(start, goal) {
    start.g = 0;
    start.h = Math.abs(goal.i - start.i) + Math.abs(goal.j - start.j);
    start.f = start.g + start.h;

    let openList = [start];   
    let closedSet = new Set(); 
    start.parent = null;     

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

        closedSet.add(current);

        current.neighbour.forEach(neighbour => {
            if (!neighbour.isAvailable || closedSet.has(neighbour)) {
                return;
            }

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
