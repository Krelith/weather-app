function Cloud(x, y, v){
    this.x = x;
    this.y = y;
    this.v = v;
    this.show = () => {
        fill(255);
        noStroke();
        ellipse(this.x, this.y, 100, 100);
        ellipse(this.x + 50, this.y - 40, 100, 100);
        ellipse(this.x + 100, this.y, 100, 100);
        ellipse(this.x + 50, this.y, 100, 100);
    }
    
    this.move = () => {
        this.x -= this.v; // cloud move speed
    }
}

function Sun(){
    this.x = 30;
    this.y = 30;
    
    this.show = () => {
        fill(255, 255, 0);
        ellipse(this.x, this.y, 300, 300);
    }
}

let clouds = [];
let sun = new Sun();

function setup(){
    createCanvas(screen.width, screen.height);
}

function draw(){
    background(52, 152, 219);
    sun.show();
    if (frameCount % 20 == 0) clouds.push(new Cloud(2000, Math.floor(Math.random() * screen.height), Math.floor(Math.random() * 5)));
    for (let i = 0; i < clouds.length; i++){
        clouds[i].show();
        clouds[i].move();
    }
}