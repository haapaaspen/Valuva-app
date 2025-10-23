// Modern Default Animation
// Pure time-based rendering - no state, perfect for timeline scrubbing

// Animation parameters
const DURATION = 8; // seconds
const t = (current_time_ms / 1000) % DURATION;
const progress = t / DURATION;

// Clear canvas with dark background
ctx.fillStyle = "#0a0a0f";
ctx.fillRect(0, 0, width, height);

// Animated gradient background
const gradient = ctx.createRadialGradient(
	width / 2 + Math.cos(progress * Math.PI * 2) * 200,
	height / 2 + Math.sin(progress * Math.PI * 2) * 200,
	100,
	width / 2,
	height / 2,
	Math.max(width, height)
);
gradient.addColorStop(0, `hsla(${progress * 360}, 70%, 20%, 0.8)`);
gradient.addColorStop(0.5, `hsla(${(progress * 360 + 120) % 360}, 60%, 15%, 0.6)`);
gradient.addColorStop(1, "#0a0a0f");
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Grid of animated circles
const centerX = width / 2;
const centerY = height / 2;
const gridSize = 5;
const spacing = 120;

for (let i = 0; i < gridSize; i++) {
	for (let j = 0; j < gridSize; j++) {
		const x = centerX + (i - gridSize / 2 + 0.5) * spacing;
		const y = centerY + (j - gridSize / 2 + 0.5) * spacing;
		
		// Staggered animation based on position
		const stagger = (i + j) / (gridSize * 2);
		const localProgress = (progress + stagger) % 1;
		
		// Pulsing size
		const pulse = Math.sin(localProgress * Math.PI * 2) * 0.5 + 0.5;
		const radius = 20 + pulse * 15;
		
		// Color based on position and time
		const hue = (i / gridSize * 60 + j / gridSize * 60 + progress * 360) % 360;
		
		// Opacity pulse
		const opacity = 0.4 + pulse * 0.6;
		
		ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${opacity})`;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
		
		// Glow effect
		ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${opacity * 0.2})`;
		ctx.beginPath();
		ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
		ctx.fill();
	}
}

// Orbiting particles
const numParticles = 12;
const orbitRadius = 300;

for (let i = 0; i < numParticles; i++) {
	const angle = (i / numParticles) * Math.PI * 2 + progress * Math.PI * 2;
	const x = centerX + Math.cos(angle) * orbitRadius;
	const y = centerY + Math.sin(angle) * orbitRadius;
	
	const size = 12 + Math.sin(progress * Math.PI * 4 + i) * 6;
	const hue = (i / numParticles * 360 + progress * 180) % 360;
	
	// Trail effect
	ctx.shadowBlur = 20;
	ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
	
	ctx.fillStyle = `hsl(${hue}, 80%, 70%)`;
	ctx.beginPath();
	ctx.arc(x, y, size, 0, Math.PI * 2);
	ctx.fill();
	
	ctx.shadowBlur = 0;
}

// Central rotating shape
ctx.save();
ctx.translate(centerX, centerY);
ctx.rotate(progress * Math.PI * 2);

const sides = 6;
const shapeRadius = 100 + Math.sin(progress * Math.PI * 4) * 30;

ctx.beginPath();
for (let i = 0; i <= sides; i++) {
	const angle = (i / sides) * Math.PI * 2;
	const x = Math.cos(angle) * shapeRadius;
	const y = Math.sin(angle) * shapeRadius;
	if (i === 0) ctx.moveTo(x, y);
	else ctx.lineTo(x, y);
}
ctx.closePath();

const shapeGradient = ctx.createLinearGradient(-shapeRadius, -shapeRadius, shapeRadius, shapeRadius);
shapeGradient.addColorStop(0, `hsla(${progress * 360}, 70%, 60%, 0.9)`);
shapeGradient.addColorStop(1, `hsla(${(progress * 360 + 180) % 360}, 70%, 60%, 0.9)`);
ctx.fillStyle = shapeGradient;
ctx.fill();

ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 3;
ctx.stroke();

ctx.restore();

// Time display
ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
ctx.font = "bold 32px Arial, sans-serif";
ctx.textAlign = "center";
ctx.shadowBlur = 10;
ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
ctx.fillText(`${t.toFixed(2)}s / ${DURATION}s`, width / 2, 80);
ctx.shadowBlur = 0;

// Progress indicator
const barWidth = 400;
const barHeight = 6;
const barX = (width - barWidth) / 2;
const barY = height - 80;

// Background bar
ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
ctx.fillRect(barX, barY, barWidth, barHeight);

// Progress bar with gradient
const progressGradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
progressGradient.addColorStop(0, `hsl(${progress * 360}, 70%, 60%)`);
progressGradient.addColorStop(1, `hsl(${(progress * 360 + 120) % 360}, 70%, 60%)`);
ctx.fillStyle = progressGradient;
ctx.fillRect(barX, barY, barWidth * progress, barHeight);

// Progress indicator dot
ctx.fillStyle = "#ffffff";
ctx.beginPath();
ctx.arc(barX + barWidth * progress, barY + barHeight / 2, 8, 0, Math.PI * 2);
ctx.fill();

// Percentage text
ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
ctx.font = "20px Arial, sans-serif";
ctx.textAlign = "center";
ctx.fillText(`${Math.round(progress * 100)}%`, width / 2, height - 45);

