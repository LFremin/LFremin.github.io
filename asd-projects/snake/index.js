var board = $("#board");
var scoreElement = $("#score");
var highScoreElement = $("#highScore");

var snake = {}; 
var apple = {}; 
var score = 0; 
var ROWS = 20;
var COLUMNS = 20;
var SQUARE_SIZE = 20;
var KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

var updateInterval;

var activeKey;
$("body").on("keydown", handleKeyDown);

init();

function init() {
  snake.body = [];
  makeSnakeSquare(10, 10);
  snake.head = snake.body[0];

  makeApple();

  updateInterval = setInterval(update, 100);
}


function update() {
  moveSnake();

  if (hasHitWall() || hasCollidedWithSnake()) {
    endGame();
  }

  if (hasCollidedWithApple()) {
    handleAppleCollision();
  }
}

function checkForNewDirection(event) {
  if (activeKey === KEY.LEFT && snake.head.direction !== "right") {
    snake.head.direction = "left";
  } else if (activeKey === KEY.RIGHT && snake.head.direction !== "left") {
    snake.head.direction = "right";
  } else if (activeKey === KEY.UP && snake.head.direction !== "down") {
    snake.head.direction = "up";
  } else if (activeKey === KEY.DOWN && snake.head.direction !== "up") {
    snake.head.direction = "down";
  }
}

function moveSnake() {
  checkForNewDirection();

  for (var i = snake.body.length -1; i >= 1; i--) {
    var snakeSquare = snake.body[i]
    var nextSnakeSquare = snake.body[i-1]

    var nextRow = nextSnakeSquare.row
    var nextColumn = nextSnakeSquare.column
    var nextDirection = nextSnakeSquare.direction

    snakeSquare.direction = nextDirection;
    snakeSquare.row = nextRow;
    snakeSquare.column = nextColumn;
    repositionSquare(snakeSquare);
  }

  var nextRow = snake.head.row;
  var nextColumn = snake.head.column;

  if (snake.head.direction === "left") {
    snake.head.column = snake.head.column - 1;
  } else if (snake.head.direction === "right") {
    snake.head.column = snake.head.column + 1;
  } else if (snake.head.direction === "up") {
    snake.head.row = snake.head.row - 1;
  } else if (snake.head.direction === "down") {
    snake.head.row = snake.head.row + 1;
  }
  repositionSquare(snake.head);
}

function hasHitWall() {
  if (snake.head.row === ROWS + 1) {
    return true
  } if (snake.head.row === -1) {
    return true
  } if (snake.head.column === COLUMNS + 1) {
    return true
  } if (snake.head.column === -1) {
    return true
  }else {
    return false
  }
}


  for (var i = snake.body.length - 1; i > 0; i--) {
    var currentSquare = snake.body[i];
    var nextSquare = snake.body[i - 1];

    var nextRow = nextSquare.row;
    var nextColumn = nextSquare.column;

    currentSquare.row = nextRow;
    currentSquare.column = nextColumn;
    repositionSquare(currentSquare);
  }


function hasHitWall() {
  return (
    snake.head.row < 0 ||
    snake.head.row >= ROWS ||
    snake.head.column < 0 ||
    snake.head.column >= COLUMNS
  );
}

function hasCollidedWithApple() {
  
 if ((snake.head.row === apple.row) && (snake.head.column === apple.column)) {
  return true
 }

  return false;
}

function handleAppleCollision() {
  score++;
  scoreElement.text("Score: " + score);

  apple.element.remove();
  makeApple();

  var row = 0;
  var column = 0;

  row = snake.tail.row;
  column = snake.tail.column;
  if (snake.tail.direction === "left") { 
    column++
  } else if (snake.tail.direction === "right") { 
    column--
  } else if (snake.tail.direction === "up") { 
    row++
  } else if (snake.tail.direction === "down") {
    row--
  }

  makeSnakeSquare(nextRow, nextColumn);
}

function hasCollidedWithSnake() {
  for (let i = 1; i < snake.body.length; i++) {
    if (snake.head.row === snake.body[i].row && snake.head.column === snake.body[i].column) {
      return true;
    }
  }

  return false;
}

function endGame() {
  clearInterval(updateInterval);
  board.empty();
  highScoreElement.text("High Score: " + calculateHighScore());
  scoreElement.text("Score: 0");
  score = 0;
  setTimeout(init, 500);
}

function makeApple() {
  apple.element = $("<div>").addClass("apple").appendTo(board);

  var randomPosition = getRandomAvailablePosition();

  apple.row = randomPosition.row;
  apple.column = randomPosition.column;

  repositionSquare(apple);
}

function makeSnakeSquare(row, column) {
  var snakeSquare = {};

  snakeSquare.element = $("<div>").addClass("snake").appendTo(board);

  snakeSquare.row = row;
  snakeSquare.column = column;

  repositionSquare(snakeSquare);

  if (snake.body.length === 0) {
    snakeSquare.element.attr("id", "snake-head");
  }

  snake.body.push(snakeSquare);
  snake.tail = snakeSquare;
}



function handleKeyDown(event) {
  activeKey = event.which;
}

function repositionSquare(square) {
  var squareElement = square.element;
  var row = square.row;
  var column = square.column;

  var buffer = 20;

  squareElement.css("left", column * SQUARE_SIZE + buffer);
  squareElement.css("top", row * SQUARE_SIZE + buffer);
}

function getRandomAvailablePosition() {
  var spaceIsAvailable;
  var randomPosition = {};

  while (!spaceIsAvailable) {
    randomPosition.column = Math.floor(Math.random() * COLUMNS);
    randomPosition.row = Math.floor(Math.random() * ROWS);
    spaceIsAvailable = true;

    for (var i = 0; i < snake.body.length; i++) {
      if (
        randomPosition.row === snake.body[i].row &&
        randomPosition.column === snake.body[i].column
      ) {
        spaceIsAvailable = false;
        break;
      }
    }
  }

  return randomPosition;
}

function calculateHighScore() {
  var highScore = sessionStorage.getItem("highScore") || 0;

  if (score > highScore) {
    sessionStorage.setItem("highScore", score);
    highScore = score;
    alert("New High Score!");
  }

  return highScore;
}