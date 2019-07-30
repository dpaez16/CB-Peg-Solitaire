Array.prototype.randomChoice = function(){
	return this[Math.floor(Math.random()*this.length)];
};

Array.prototype.isEqual = function(other) {
	if (this.length != other.length)
		return false;

	for (let idx = 0; idx < this.length; idx++) {
		if (this[idx] != other[idx])
			return false;
	}

	return true;
};

class PegBoard {
	constructor(order, R) {
		this.order = order;
		this.R = R;
		this.board = this.createBoard();
	}

	createBoard() {
		let board = [];
		for (var r = 0; r < this.order; r++) {
			var row = [];
			var startingX = 2*this.R + (this.order - r)*3*R;
			for (var c = 0; c <= r; c++) {
				var y = 2*this.R + 3*this.R*r;
				var x = startingX + c*6*this.R;
				
				var temp_circle = new Circle(x, y, this.R, true);
				row.push(temp_circle);
			}
			board.push(row);
		}
		
		var randomCircle = [board[0][0], board[this.order - 1][0], board[this.order - 1][this.order - 1]].randomChoice();
		randomCircle.isPeg = false;

		return board;
	}

	reset() {
		this.board = this.createBoard();
	}

	renderTriangle() {
		fill(210, 105, 30, 255);
		triangle(this.board[this.order-1][0].x - 4*this.R, this.board[this.order-1][0].y + 1.5*this.R, this.board[this.order-1][this.order-1].x + 4*this.R, this.board[this.order-1][this.order-1].y + 1.5*this.R, this.board[0][0].x, this.board[0][0].y - 2*this.R);
	}

	renderCircles() {
		for (let r = 0; r < this.order; r++) {
			for (let c = 0; c <= r; c++)
				this.board[r][c].render();
		}
	}

	render() {
		this.renderTriangle();
		this.renderCircles();
	}

	checkGame() {
		var pegs = [];
		for (let r = 0; r < this.order; r++) {
			for (let c = 0; c <= r; c++) {
				var temp_circle = this.board[r][c];
				if (temp_circle.isPeg)
					pegs.push([r, c]);
			}
		}

		if (pegs.length == 1)
			return 0; // player wins

		for (let idx = 0; idx < pegs.length; idx++) {
			var r = pegs[idx][0];
			var c = pegs[idx][1];
			var neighbors = this.getNeighbors(r, c);
			if (neighbors.length > 0)
				return 1; // game not over yet
		}

		return 2; // player loses
	}

	movePeg(pegs) {
		var row = pegs[0][0];
		var col = pegs[0][1];
		var targetRow = pegs[1][0];
		var targetCol = pegs[1][1];
		
		if (!this.isValidMove(row, col, targetRow, targetCol)) {
			this.board[row][col].toggle();
			this.board[targetRow][targetCol].toggle();
			return;
		}

		var midPeg = this.computeMidPeg(row, col, targetRow, targetCol);
		this.board[row][col].isPeg = false;
		this.board[midPeg[0]][midPeg[1]].isPeg = false;
		this.board[targetRow][targetCol].isPeg = true;
		this.board[targetRow][targetCol].toggle();
	}

	isValidMove(row, col, targetRow, targetCol) {
		if (!this.isInsideBoard(row, col) || !this.isInsideBoard(targetRow, targetCol))
			return false;

		if (!this.board[row][col].isPeg || this.board[targetRow][targetCol].isPeg)
			return false;

		var case1 = (Math.abs(row - targetRow) == 2) && ((col == targetCol) || (Math.abs(col - targetCol) == 2));
		var case2 = (row == targetRow) && (Math.abs(col - targetCol) == 2);

		if (case1 || case2) {
			var midPeg = this.computeMidPeg(row, col, targetRow, targetCol);
			return this.board[midPeg[0]][midPeg[1]].isPeg;
		} else
			return false;
	}

	isInsideBoard(r, c) {
		return (0 <= r && r < this.order) && (0 <= c && c < this.board[r].length);
	}

	getNeighbors(r, c) {
		var neighbors = [[r, c - 2], [r, c + 2], [r - 2, c], [r - 2, c - 2], [r + 2, c], [r + 2, c + 2]];
		neighbors = neighbors.filter(t => this.isInsideBoard(t[0], t[1]));
		neighbors = neighbors.filter(t => !this.board[t[0]][t[1]].isPeg);
		neighbors = neighbors.filter(t => this.isValidMove(r, c, t[0], t[1]));

		return neighbors;
	}

	computeMidPeg(row, col, targetRow, targetCol) {
		var case1 = (Math.abs(row - targetRow) == 2) && ((col == targetCol) || (Math.abs(col - targetCol) == 2));
		var case2 = (row == targetRow) && (Math.abs(col - targetCol) == 2);

		if (case1) {
			var midpointRow = Math.min(row, targetRow) + 1;
			var midpointCol = Math.floor((col + targetCol)/2);
			return [midpointRow, midpointCol];
		} else if (case2) {
			var midpointRow = row;
			var midpointCol = Math.min(col, targetCol) + 1;
			return [midpointRow, midpointCol];
		} else
			return [-1, -1];
	}
}
