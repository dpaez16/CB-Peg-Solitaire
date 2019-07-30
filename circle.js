class Circle {
	constructor(x, y, r, isPeg) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.clicked = false;
		this.alpha = 255;
		this.isPeg = isPeg;
	}

	render() {
		if (this.isPeg)
			fill(255, 0, 0, this.alpha);
		else
			fill(255, 255, 255, 255);
		
		stroke(0, 0, 0);
		circle(this.x, this.y, this.r); 
	}

	isClickedOn(x, y) {
		let d = dist(x, y, this.x, this.y);
		return d <= this.r;
	}

	toggle() {
		if (this.clicked)
			this.alpha = 255;
		else
			this.alpha = 125;

		this.clicked = !this.clicked;
		return this.clicked;
	}
}