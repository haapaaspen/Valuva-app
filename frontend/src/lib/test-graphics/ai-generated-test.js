// Test file to debug the AI-generated code issue
// Simplified version of the Polar Night Films animation

const duration = 8;

// Helper function that uses ctx
function drawCircle(centerX, centerY, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
}

utils.animate((time_ms) => {
  const t = (time_ms / 1000) % duration;
  const progress = t / duration;
  
  // Clear canvas
  ctx.fillStyle = "#050A14";
  ctx.fillRect(0, 0, width, height);
  
  // Test if helper function works
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 100 + Math.sin(progress * Math.PI * 2) * 50;
  
  drawCircle(centerX, centerY, radius, "#7EB8FF");
  
  // Draw text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Testing Helper Functions", centerX, centerY);
});

