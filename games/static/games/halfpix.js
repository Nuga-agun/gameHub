// Game variables
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const triangleHeight = 10;

const playButton = document.getElementById('play-button');
const container = document.getElementById('game-container');

const container_pos = container.getBoundingClientRect();
const limit_bottom = container_pos.bottom - 3;
const limit_top = container_pos.top;
const limit_left = container_pos.left + 3;
const limit_right = container_pos.right - 2*triangleHeight;

let currentTriangle = null;
let placedTriangles = [];
let gameInterval = null;
let speed = 5;
let isGameRunning = false;

function createTriangle(color) {
	const triangle = document.createElement('div');
	triangle.style.width = '0';
	triangle.style.height = '0';
	triangle.style.borderLeft = triangleHeight + 'px solid transparent';
	triangle.style.borderRight = triangleHeight + 'px solid transparent';
	triangle.style.borderBottom = (2*triangleHeight) + 'px solid ' + color;
	triangle.style.position = 'absolute';
	triangle.style.top = limit_top + "px";
	triangle.style.left = (limit_left + limit_right)/2 + "px";
	return triangle;
}

function moveDown() {
	if (!currentTriangle) return;
	const currentTop = parseInt(currentTriangle.style.top) || 0;
	const currentBottom = currentTop + triangleHeight;
	if (currentBottom + speed >= limit_bottom) {
		currentTriangle.style.top = (limit_bottom - 2*triangleHeight) + 'px';
		placedTriangles.push(currentTriangle.cloneNode());
		stopTriangle();
	} else {
		currentTriangle.style.top = (currentTop + speed) + 'px';
	}
}

function stopTriangle(pos) {
	clearInterval(gameInterval);
	currentTriangle = null;
	if (isGameRunning) {
		spawnTriangle();
	}
}

function spawnTriangle() {
	const color = colors[Math.floor(Math.random() * colors.length)];
	currentTriangle = createTriangle(color);
	container.appendChild(currentTriangle);
	gameInterval = setInterval(moveDown, 50);
}

document.addEventListener('keydown', (e) => {
	if (!currentTriangle) return;

	const currentLeft = parseInt(currentTriangle.style.left) || 0;
	const currentRight = currentLeft + triangleHeight;
	const containerWidth = container.offsetWidth;

	if (e.key === 'ArrowLeft' || e.key === 'a') {
		currentTriangle.style.left = Math.max(currentLeft - 10, limit_left) + 'px';
	} else if (e.key === 'ArrowRight' || e.key === 'd') {
		currentTriangle.style.left = Math.min(currentRight + 10, limit_right) + 'px';
	} else if (e.key === 'ArrowUp' || e.key === 'w') {
		const borderBottom = currentTriangle.style.borderBottom;
		currentTriangle.style.borderBottom = currentTriangle.style.borderTop;
		currentTriangle.style.borderTop = borderBottom;
	} else if (e.key === 'ArrowDown' || e.key === 's') {
		speed = 20;
	}
});

document.addEventListener('keyup', (e) => {
	if (e.key === 'ArrowDown' || e.key === 's') {
		speed = 5;
	}
});

playButton.addEventListener('click', () => {
	isGameRunning = !isGameRunning;
	playButton.textContent = isGameRunning ? 'Pause' : 'Resume';
	container.innerHTML = '';
	if (isGameRunning && !currentTriangle) {
		spawnTriangle();
	}
});

playButton.textContent = 'Play';
