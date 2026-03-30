const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 20;
let cellSize;

const COLORS = ["red", "yellow", "lime", "cyan", "magenta", "orange"];

let grid = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
);

let tickInterval = 300;

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    cellSize = canvas.width / GRID_SIZE;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let piece = createPiece();

function createPiece() {
    return {
        x: Math.floor(GRID_SIZE / 2),
        y: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        orientation: 0
    };
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid[y][x]) {
                drawTriangle(x, y, grid[y][x][0].color, grid[y][x][0].orientation);
                if (grid[y][x][1]) drawTriangle(x, y, grid[y][x][1].color, grid[y][x][1].orientation);
            }
        }
    }

    drawTriangle(piece.x, piece.y, piece.color, piece.orientation);
}

function drawTriangle(x, y, color, orientation) {
    const px = x * cellSize;
    const py = y * cellSize;

    ctx.fillStyle = color;
    ctx.beginPath();

    switch (orientation) {
        case 0:
            ctx.moveTo(px, py);
            ctx.lineTo(px + cellSize, py);
            ctx.lineTo(px, py + cellSize);
            break;

        case 1:
            ctx.moveTo(px, py);
            ctx.lineTo(px + cellSize, py + cellSize);
            ctx.lineTo(px, py + cellSize);
            break;

        case 2:
            ctx.moveTo(px + cellSize, py + cellSize);
            ctx.lineTo(px + cellSize, py);
            ctx.lineTo(px, py + cellSize);
            break;

        case 3:
            ctx.moveTo(px, py);
            ctx.lineTo(px + cellSize, py + cellSize);
            ctx.lineTo(px + cellSize, py);
            break;
    }

    ctx.closePath();
    ctx.fill();
}

function collision(x, y) {
    if (x < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return true;
    if (y<0) return false;
    if (grid[y][x] === null) return false;
    if (grid[y][x].length === 2) return true;
    return (grid[y][x][0].orientation + piece.orientation) % 2 !== 0;
}

function fixPiece() {
    if (piece.y >= 0) {
        if (grid[piece.y][piece.x] == null) {
            grid[piece.y][piece.x] = [];
        }
        grid[piece.y][piece.x].push({
            color: piece.color,
            orientation: piece.orientation
        });
    }
    piece = createPiece();
}

function gameLoop() {
    if (!collision(piece.x, piece.y + 1)) {
        piece.y++;
    } else {
        fixPiece();
    }

    drawGrid();
}

setInterval(gameLoop, tickInterval);

// Contrôles clavier
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && !collision(piece.x - 1, piece.y)) {
        piece.x--;
    }
    if (e.key === "ArrowRight" && !collision(piece.x + 1, piece.y)) {
        piece.x++;
    }
    if (e.key === "ArrowUp") {
        piece.orientation = (piece.orientation + 1) % 4;
    }
});
