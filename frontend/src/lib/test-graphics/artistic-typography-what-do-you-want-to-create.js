// Set up variables for animation
const duration = 8; // Animation duration in seconds
const t = (current_time_ms / 1000) % duration; // Current time in seconds (0 to duration)
const progress = t / duration; // Progress from 0 to 1

// Clear canvas with gradient background
const bgGradient = ctx.createRadialGradient(
  width * 0.5, height * 0.5, 0,
  width * 0.5, height * 0.5, width * 0.7
);

// Soft, dreamy color palette
bgGradient.addColorStop(0, 'rgba(25, 25, 40, 1)');
bgGradient.addColorStop(0.7, 'rgba(15, 15, 30, 1)');
bgGradient.addColorStop(1, 'rgba(5, 5, 15, 1)');

ctx.fillStyle = bgGradient;
ctx.fillRect(0, 0, width, height);

// Create luminous particles (representing creative potential)
const numParticles = 100;
ctx.globalCompositeOperation = 'screen';

for (let i = 0; i < numParticles; i++) {
  const particleProgress = (progress + i / numParticles) % 1;
  const angle = i * Math.PI * 2 / numParticles + t * 0.2;
  
  // Particle movement follows a spiral pattern
  const radius = Math.sin(particleProgress * Math.PI) * width * 0.3;
  const x = width / 2 + Math.cos(angle) * radius;
  const y = height / 2 + Math.sin(angle) * radius;
  
  // Particle size and opacity changes with time
  const size = 2 + Math.sin(t * 2 + i * 0.1) * 2;
  const opacity = 0.2 + 0.8 * Math.sin(particleProgress * Math.PI);
  
  // Color shifts subtly over time
  const hue = (220 + i % 40 + t * 5) % 360;
  ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${opacity})`;
  
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

// Reset composite operation
ctx.globalCompositeOperation = 'source-over';

// Draw flowing lines (representing the flow of creative thought)
ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
ctx.lineWidth = 0.5;

for (let i = 0; i < 5; i++) {
  const offset = i * 0.2;
  ctx.beginPath();
  
  for (let x = 0; x < width; x += 10) {
    const y = height * 0.5 + 
              Math.sin(x * 0.01 + t + offset) * 50 * 
              Math.sin(t * 0.5 + offset);
    
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
}

// Text animation
const text = "what do you want to create?";
const fontSize = width * 0.04;
ctx.font = `${fontSize}px 'Helvetica', sans-serif`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Calculate text metrics for positioning
const textWidth = ctx.measureText(text).width;

// Animate each letter individually
for (let i = 0; i < text.length; i++) {
  const char = text[i];
  
  // Calculate the timing for each character
  const charDelay = i * 0.05;
  const charTime = Math.max(0, Math.min(1, (t - 1 - charDelay) * 0.8));
  
  if (charTime <= 0) continue;
  
  // Position each character with slight movement
  const charX = width * 0.5 - textWidth * 0.5 + 
                ctx.measureText(text.substring(0, i)).width + 
                ctx.measureText(char).width * 0.5;
  
  const charY = height * 0.5 + 
                Math.sin(t * 2 + i * 0.2) * fontSize * 0.1;
  
  // Opacity animation
  const opacity = Math.min(1, charTime * 2);
  
  // Color animation - subtle shift in hue
  const hue = (220 + i * 3 + t * 5) % 360;
  ctx.fillStyle = `hsla(${hue}, 70%, 80%, ${opacity})`;
  
  // Draw the character with slight rotation
  ctx.save();
  ctx.translate(charX, charY);
  ctx.rotate(Math.sin(t + i * 0.1) * 0.05);
  ctx.fillText(char, 0, 0);
  ctx.restore();
}

// Draw a subtle circular indicator that pulses
const pulseSize = 0.2 + Math.sin(t * 3) * 0.05;
ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.arc(width * 0.5, height * 0.5, width * pulseSize, 0, Math.PI * 2);
ctx.stroke();

// Add subtle light rays (sfumato technique)
ctx.save();
ctx.globalCompositeOperation = 'lighter';
const rayGradient = ctx.createRadialGradient(
  width * 0.5, height * 0.5, 0,
  width * 0.5, height * 0.5, width * 0.7
);
rayGradient.addColorStop(0, 'rgba(100, 120, 255, 0.1)');
rayGradient.addColorStop(0.5, 'rgba(100, 120, 255, 0.02)');
rayGradient.addColorStop(1, 'rgba(100, 120, 255, 0)');

ctx.fillStyle = rayGradient;
ctx.fillRect(0, 0, width, height);
ctx.restore();

// Add subtle vignette for depth
ctx.save();
const vignetteGradient = ctx.createRadialGradient(
  width * 0.5, height * 0.5, height * 0.3,
  width * 0.5, height * 0.5, height * 0.8
);
vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');

ctx.fillStyle = vignetteGradient;
ctx.fillRect(0, 0, width, height);
ctx.restore();