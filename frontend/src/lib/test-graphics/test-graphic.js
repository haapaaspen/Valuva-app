// Valuva AI Generated Canvas Graphics
// Generated at: 22/10/2025, 17:38:27
// Duration: 3 seconds

// This code is designed to run with the Valuva canvas utilities
// Pre-provided variables: ctx, canvas, width (1920), height (1080), utils

// Set up constants
const duration = 3; // 3 second loop
const ballRadius = 50;
const ballColor = "#FF4136"; // A vibrant red
const backgroundColor = "#F8F9FA"; // Light gray background
const gravity = 0.25;
const damping = 0.8; // Energy loss on bounce
const floor = 900; // Floor position

// Animation variables
let position, velocity, squash;

// Initialize animation variables
function init() {
    position = { x: 960, y: 200 }; // Start position (center-top)
    velocity = { x: 0, y: 0 }; // Initial velocity
    squash = 1; // No initial squash
}

// Draw the ball with squash and stretch
function drawBall() {
    ctx.save();
    ctx.fillStyle = ballColor;
    
    // Translate to ball position
    ctx.translate(position.x, position.y);
    
    // Apply squash and stretch
    ctx.scale(1 / squash, squash);
    
    // Draw the ball
    ctx.beginPath();
    ctx.arc(0, 0, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Update ball physics
function updateBall(progress) {
    // Apply gravity
    velocity.y += gravity;
    
    // Update position
    position.y += velocity.y;
    
    // Check floor collision
    if (position.y + ballRadius > floor) {
        position.y = floor - ballRadius;
        velocity.y *= -damping; // Reverse and reduce velocity
        
        // Apply squash on impact
        squash = 1.5;
    }
    
    // Gradually return to normal shape
    squash = 1 + (squash - 1) * 0.8;
}

// Clear canvas and draw background
function clearCanvas() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
}

// Main animation loop
init();
utils.animate((time_ms) => {
    // Reset animation at the end of duration
    const loopProgress = (time_ms / 1000) % duration;
    if (loopProgress < 0.05) {
        init();
    }
    
    clearCanvas();
    updateBall(loopProgress);
    drawBall();
});
