$(document).ready(runProgram); 

function runProgram(){
  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  // Game Item Objects
  var walker = {
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0
  };

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);
  $(document).on('keydown', handleKeyDown);

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function newFrame() {
    repositionGameItem();
    redrawGameItem();
    wallCollision(); // Check for collision with walls
  }
  
  function handleKeyDown(event) {
    const KEY = {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40
    };
    
    // Set speed based on key pressed
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
    // Reset speed when key is released
    walker.speedX = 0;
    walker.speedY = 0;
  }

  function repositionGameItem() {
    // Update position based on speed
    walker.x += walker.speedX;
    walker.y += walker.speedY;
  }

  function redrawGameItem() {
    // Redraw the game item
    $('#walker').css({
      left: walker.x + 'px',
      top: walker.y + 'px'
    });
  }

  function wallCollision() {
    // Prevent the walker from leaving the board area
    var boardWidth = $('#board').width();
    var boardHeight = $('#board').height();
    
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

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Event handler for keyup event
  $(document).on('keyup', handleKeyUp);

  function endGame() {
    clearInterval(interval);
    $(document).off();
  }
}
