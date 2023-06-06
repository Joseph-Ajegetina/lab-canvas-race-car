window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };


  function startGame() {
    myGameArea.start();
  }


  // Defining the game area
  const myGameArea = {
    canvas: document.getElementById('canvas'),
    frames: 0,
    start: function () {
      this.context = this.canvas.getContext('2d');
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.drawBackground();
      this.interval = setInterval(updateGameArea, 20);
    },
    drawBackground: function () {
      const backgroundImage = createImage('road');
      this.context.drawImage(backgroundImage, 0, 0, this.width, this.height);
    },
    stop: function () {
      clearInterval(this.interval);
    },
    clear: function () {
      this.context.clearRect(0, 0, this.width, this.height)
    },
    score: function(){
      this.context.font = '24px Arial';
      this.context.fillStyle = 'white';
      this.context.fillText(`Score: ${new Number(this.frames / 5)}`, 60, 30)
    }
  }

  class Component {
    constructor(width, height, x, y) {
      this.ctx = getCanvasContext()
      this.width = width;
      this.height = height
      this.x = x;
      this.y = y;
      this.speedX = 0;
      this.speedY = 0;
    }

    left(){
      return this.x;
    }
  
    right(){
      return this.x + this.width;
    }
  
    top(){
      return this.y;
    }
  
    bottom(){
      return this.y + this.height;
    }

    redraw() {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    newPos() {
      this.x += this.speedX;
      this.y += this.speedY;
    }
  }
  class Car extends Component {
    constructor(width, height, x, y) {
      super(width, height, x, y);
    }

    drawCar() {
      const carImage = createImage('car');
      this.ctx.drawImage(carImage, this.x, this.y, this.width, this.height);

    }

    crashWith(obstacle) {
      return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
    }
  }

  class Obstacle extends Component {
    constructor(width, height, color, x, y) {
      super(width, height, x, y);
      this.color = color;
    }
  }



  //utility functions 
  function createImage(path) {
    const img = new Image();
    img.src = `../images/${path}.png`;

    return img;
  }

  function getCanvasContext() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    return context;
  }

  // update the game area 
  function updateGameArea() {
    myGameArea.clear();
    myGameArea.drawBackground();
    car.newPos();
    car.drawCar();
    updateObstacles();
    checkGameOver();

  }

  function updateObstacles(){
    for (i = 0; i < myObstacles.length; i++) {
      myObstacles[i].y += 2;
      myObstacles[i].redraw();
    }
    
    myGameArea.frames += 1;
  
    if(myGameArea.frames % 120 === 0){
      let x = myGameArea.canvas.width;
      let minWidth = 20;
      let maxWidth = 200;
      let width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
      let minGap = 80;
      let maxGap = 200;
      let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      myObstacles.push(new Obstacle(width, 30, 'red', gap, 0));
      myObstacles.push(new Obstacle(x - width - gap, 30, 'red', x, width + gap, 0));
    }
  }

  function checkGameOver(){
    const crashed = myObstacles.some(function(obstacle){
      return car.crashWith(obstacle);
    })
  
    if(crashed){
      myGameArea.stop();
      myGameArea.score();
    }
  }

  const myObstacles = [];
  const car = new Car(30, 60, 234, 630)


  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'a':
      case "ArrowLeft":
        car.speedX -= 1;
        break;

      case 'd':
      case "ArrowRight":
        car.speedX += 1;
        break;
    }
  });

  document.addEventListener('keyup', (e) => {
    car.speedX = 0;
    car.speedY = 0;
  });
}