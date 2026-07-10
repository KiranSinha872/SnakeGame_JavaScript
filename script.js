// Get canvas and drawing context elements
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Grid settings: 20x20 grid
var gridSize = 20; 
// Calculate size of each cell in pixels (400px / 20 = 20px)
var cellSize = canvas.width / gridSize; 

// Game variables
var snake = []; // Array to store snake parts {x, y}
var foodX = 0;  // Food X coordinate
var foodY = 0;  // Food Y coordinate

// Score tracking
var score = 0;

// Current direction the snake is moving
var dx = 1; // 1 = right, -1 = left, 0 = no horizontal movement
var dy = 0; // 1 = down, -1 = up, 0 = no vertical movement

// Store next direction chosen by the player (prevents instant reversal)
var nextDx = 1;
var nextDy = 0;

// Game state variables
var isGameOver = false;
var gameInterval; // Stores the interval timer

// Function to start a new game or restart an old one
function restartGame() {
    // Hide game over message
    document.getElementById("game-over-message").style.display = "none";
    
    // Set starting position for the snake (length 3, placed horizontally in center)
    // Index 0 is the head of the snake
    snake = [
        { x: 10, y: 10 }, // Head
        { x: 9, y: 10 },  // Body 1
        { x: 8, y: 10 }   // Body 2
    ];
    
    // Reset starting direction to move Right
    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    
    // Reset score
    score = 0;
    document.getElementById("score").textContent = score;
    
    // Reset game state
    isGameOver = false;
    
    // Generate the first food item
    generateFood();
    
    // Clear any previous running interval to avoid duplicates
    clearInterval(gameInterval);
    
    // Start game loop running every 100 milliseconds (10 frames per second)
    gameInterval = setInterval(gameLoop, 100);
}

// Main game loop function that runs repeatedly
function gameLoop() {
    // 1. Move the snake first
    moveSnake();
    
    // 2. Check if the snake collided with walls or itself
    if (checkCollision()) {
        isGameOver = true;
        clearInterval(gameInterval); // Stop the game loop
        
        // Show final score and game over text
        document.getElementById("final-score").textContent = score;
        document.getElementById("game-over-message").style.display = "block";
        return; // Exit game loop
    }
    
    // 3. Clear canvas to redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 4. Draw food and snake
    drawFood();
    drawSnake();
}

// Function to move the snake forward
function moveSnake() {
    // Update current direction with the next allowed direction
    dx = nextDx;
    dy = nextDy;
    
    // Calculate new position for the snake's head
    var headX = snake[0].x + dx;
    var headY = snake[0].y + dy;
    
    // Create new head segment object
    var newHead = { x: headX, y: headY };
    
    // Add new head segment to front of the snake array
    snake.unshift(newHead);
    
    // Check if snake ate the food
    if (headX === foodX && headY === foodY) {
        // Increase score
        score++;
        document.getElementById("score").textContent = score;
        
        // Generate new random food position
        generateFood();
    } else {
        // Remove tail block if food wasn't eaten (maintains length)
        snake.pop();
    }
}

// Function to draw the snake on the canvas
function drawSnake() {
    for (var i = 0; i < snake.length; i++) {
        // Use green for the snake
        ctx.fillStyle = "green";
        // Fill square at position
        ctx.fillRect(snake[i].x * cellSize, snake[i].y * cellSize, cellSize, cellSize);
        
        // Draw white border around each block to make snake segments visible
        ctx.strokeStyle = "white";
        ctx.strokeRect(snake[i].x * cellSize, snake[i].y * cellSize, cellSize, cellSize);
    }
}

// Function to draw the food on the canvas
function drawFood() {
    // Use red for food
    ctx.fillStyle = "red";
    // Fill square at food position
    ctx.fillRect(foodX * cellSize, foodY * cellSize, cellSize, cellSize);
}

// Function to place food at a random grid coordinate
function generateFood() {
    // Pick a random spot between 0 and 19 for X and Y
    foodX = Math.floor(Math.random() * gridSize);
    foodY = Math.floor(Math.random() * gridSize);
    
    // Check if food coordinates overlap with any snake segment
    for (var i = 0; i < snake.length; i++) {
        if (snake[i].x === foodX && snake[i].y === foodY) {
            // Re-generate if there is a collision
            generateFood();
            return;
        }
    }
}

// Function to check if snake hit a wall or itself
function checkCollision() {
    var headX = snake[0].x;
    var headY = snake[0].y;
    
    // 1. Wall Collisions: check if head coordinates are outside grid bounds
    if (headX < 0 || headX >= gridSize || headY < 0 || headY >= gridSize) {
        return true;
    }
    
    // 2. Self Collision: check if head coordinates match any of the body segment coordinates
    // Start index at 1 to check body segments, excluding the head itself
    for (var i = 1; i < snake.length; i++) {
        if (snake[i].x === headX && snake[i].y === headY) {
            return true;
        }
    }
    
    return false; // No collisions detected
}

// Event listener for arrow key inputs
document.addEventListener("keydown", function(event) {
    var keyPressed = event.key;
    
    // Prevent default scrolling keys from moving the browser window
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(keyPressed) > -1) {
        event.preventDefault();
    }
    
    // Only accept new inputs if game is not over
    if (isGameOver) {
        return;
    }
    
    // Check key inputs and prevent instant reversal (180 degree turns)
    // If moving horizontally, user can only turn vertically.
    // If moving vertically, user can only turn horizontally.
    if (keyPressed === "ArrowUp" && dy !== 1) {
        nextDx = 0;
        nextDy = -1;
    } else if (keyPressed === "ArrowDown" && dy !== -1) {
        nextDx = 0;
        nextDy = 1;
    } else if (keyPressed === "ArrowLeft" && dx !== 1) {
        nextDx = -1;
        nextDy = 0;
    } else if (keyPressed === "ArrowRight" && dx !== -1) {
        nextDx = 1;
        nextDy = 0;
    }
});

// Event listener for the Restart button
var restartButton = document.getElementById("restartBtn");
restartButton.addEventListener("click", restartGame);

// Run when file loads to start the game
restartGame();
