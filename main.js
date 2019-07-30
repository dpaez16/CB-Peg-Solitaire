let WIDTH = 1000;
let HEIGHT = 500;
let R = 20;
let order = 5;

let pegBoard;
let selectedPegs = [[-1, -1], [-1, -1]];
let numSelected = 0;
let tX;
let tY;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function mean(a, b) {
	return (a + b) / 2;
}

function preload() {
	pegBoard = new PegBoard(order, R);
	tX = WIDTH/2 - pegBoard.board[0][0].x;
	tY = HEIGHT/2 - (mean(pegBoard.board[order - 1][0].y, pegBoard.board[0][0].y - 2*R));
}

function setup() {
	var canvas = createCanvas(WIDTH, HEIGHT);
	canvas.parent('sketch-holder');
}

function draw() {
	background(220);
	translate(tX, tY);
	pegBoard.render();
}

async function mousePressed() {
	for (let r = 0; r < pegBoard.order; r++) {
		for (let c = 0; c <= r; c++) {
			if (pegBoard.board[r][c].isClickedOn(mouseX - tX, mouseY - tY)) {
				var selected = pegBoard.board[r][c].toggle();
				if (selected)
					selectedPegs[numSelected++] = [r, c];
				else if (!selected && numSelected == 1 && selectedPegs[0].isEqual([r, c]))
					numSelected = 0;
			} 
		}
	}

	if (numSelected == 2) {
		pegBoard.movePeg(selectedPegs);
		numSelected = 0;
	}

	var gameStatus = pegBoard.checkGame();
	if (gameStatus == 1)
		return;
	
	var message = (gameStatus == 0) ? "You won!" : "You lost!";
	await sleep(100);
	alert(message);
	pegBoard.reset();
}