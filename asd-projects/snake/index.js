// HTML jQuery Objects
var board = $("#board");
var scoreElement = $("#score");
var highScoreElement = $("#highScore");

// Game Variables
var snake = {}; // Declaration of snake object
var apple = {}; // Declaration of apple object
var score = 0; // Declaration of score variable

// Constant Variables
var ROWS = 20;
var COLUMNS = 20;
var SQUARE_SIZE = 20;
var KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

// interval variable required for stopping the update function when the game ends
var updateInterval;

// variable to keep track of the key (keycode) last pressed by the user
var activeKey;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////// GAME SETUP //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// turn on keyboard inputs
$("body").on("keydown", handleKeyDown);

// start the game
init();

function init() {
  // initialize the snake
  snake.body = [];
  makeSnakeSquare(10, 10);
  snake.head = snake.body[0];

  // initialize the apple
  makeApple();

  // Initialize the interval
  updateInterval = setInterval(update, 100);
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////// PROGRAM FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

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
  } else if (activeKey === KEY.UP && snake.head.direction !== "down") {
    snake.head.direction = "up";
  } else if (activeKey === KEY.RIGHT && snake.head.direction !== "left") {
    snake.head.direction = "right";
  } else if (activeKey === KEY.DOWN && snake.head.direction !== "up") {
    snake.head.direction = "down";
  }
}

function moveSnake() {
  checkForNewDirection();

  var nextRow = snake.head.row;
  var nextColumn = snake.head.column;

  if (snake.head.direction === "left") {
    nextColumn--;
  } else if (snake.head.direction === "up") {
    nextRow--;
  } else if (snake.head.direction === "right") {
    nextColumn++;
  } else if (snake.head.direction === "down") {
    nextRow++;
  }

  makeSnakeSquare(nextRow, nextColumn);
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
  return (
    snake.head.row === apple.row && snake.head.column === apple.column
  );
}

function handleAppleCollision() {
  score++;
  scoreElement.text("Score: " + score);

  apple.element.remove();
  makeApple();

  var nextRow = snake.tail.row;
  var nextColumn = snake.tail.column;

  if (snake.tail.direction === "left") {
    nextColumn++;
  } else if (snake.tail.direction === "up") {
    nextRow++;
  } else if (snake.tail.direction === "right") {
    nextColumn--;
  } else if (snake.tail.direction === "down") {
    nextRow--;
  }

  makeSnakeSquare(nextRow, nextColumn);
}

function hasCollidedWithSnake() {
  for (var i = 1; i < snake.body.length; i++) {
    if (
      snake.head.row === snake.body[i].row &&
      snake.head.column === snake.body[i].column
    ) {
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

////////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

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

  snake.body.unshift(snakeSquare);
  snake.head = snake.body[0];
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