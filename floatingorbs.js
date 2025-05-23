const duration = 8;

function drawFloatingOrbs(t) {
  const orbCount = 5;
  for (let i = 0; i < orbCount; i++) {
    const phase = (i / orbCount) * Math.PI * 2;
    const x = width/2 + Math.sin(t * 2 + phase) * 200;
    const y = height/2 + Math.cos(t * 3 + phase) * 100;
    const radius = 20 + Math.sin(t * 4 + phase) * 10;
    
    const gradient = utils.createGradient('radial', x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(100, 200, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

utils.animate((time_ms) => {
  const t = (time_ms * 0.001) % duration / duration;
  ctx.clearRect(0, 0, width, height);
  drawFloatingOrbs(t);
});