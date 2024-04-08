$(document).ready(runProgram);

function runProgram(){
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  var walker = {
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0
  };

  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);
  $(document).on('keydown', handleKeyDown);


  function newFrame() {
    repositionGameItem();
    redrawGameItem();
    wallCollision();
  }
 
  function handleKeyDown(event) {
    const KEY = {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40
    };
   
    if (event.which === KEY.LEFT) {
      walker.speedX = -5;
    } else if (event.which === KEY.UP) {
      walker.speedY = -5;
    } else if (event.which === KEY.RIGHT) {
      walker.speedX = 5;
    } else if (event.which === KEY.DOWN) {
      walker.speedY = 5;
    }
  }

  function handleKeyUp(event) {
    walker.speedX = 0;
    walker.speedY = 0;
  }

  function repositionGameItem() {
    walker.x += walker.speedX;
    walker.y += walker.speedY;
  }

  function redrawGameItem() {
    $('#walker').css({
      left: walker.x + 'px',
      top: walker.y + 'px'
    });
  }

  function wallCollision() {
    var boardWidth = $('#board').width()-51;
    var boardHeight = $('#board').height()-51;
   
    if (walker.x < 0) {
      walker.x = 0;
    } else if (walker.x > boardWidth) {
      walker.x = boardWidth;
    }

    if (walker.y < 0) {
      walker.y = 0;
    } else if (walker.y > boardHeight) {
      walker.y = boardHeight;
    }
  }

  $(document).on('keyup', handleKeyUp);

  function endGame() {
    clearInterval(interval);
    $(document).off();
  }
}

