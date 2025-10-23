// Timeline Control Test Graphic
// This demonstrates proper timeline-controlled animation

const duration = 5; // 5 second animation loop

utils.animate((time_ms) => {
	// Convert to seconds and loop
	const t = (time_ms / 1000) % duration;
	const progress = t / duration; // 0 to 1

	// Clear canvas
	ctx.fillStyle = "#0a0a0f";
	ctx.fillRect(0, 0, width, height);

	// Animated gradient background
	const gradient = ctx.createLinearGradient(0, 0, width, height);
	gradient.addColorStop(0, `hsl(${progress * 360}, 60%, 10%)`);
	gradient.addColorStop(1, `hsl(${progress * 360 + 180}, 60%, 5%)`);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// Moving circle across screen
	const circleX = width * progress;
	const circleY = height / 2 + Math.sin(progress * Math.PI * 4) * 150;
	const circleRadius = 40 + Math.sin(progress * Math.PI * 2) * 20;

	ctx.fillStyle = "#ff6b6b";
	ctx.beginPath();
	ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
	ctx.fill();

	// Rotating squares
	const centerX = width / 2;
	const centerY = height / 2;
	const numSquares = 8;

	for (let i = 0; i < numSquares; i++) {
		const angle = (i / numSquares) * Math.PI * 2 + progress * Math.PI * 2;
		const distance = 200;
		const x = centerX + Math.cos(angle) * distance;
		const y = centerY + Math.sin(angle) * distance;
		const size = 30;

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(angle + progress * Math.PI * 4);
		ctx.fillStyle = `hsl(${(i / numSquares) * 360 + progress * 360}, 70%, 60%)`;
		ctx.fillRect(-size / 2, -size / 2, size, size);
		ctx.restore();
	}

	// Time display
	ctx.fillStyle = "#ffffff";
	ctx.font = "bold 48px Arial";
	ctx.textAlign = "center";
	ctx.fillText(`${t.toFixed(2)}s / ${duration.toFixed(0)}s`, width / 2, 80);

	// Progress bar
	const barWidth = 600;
	const barHeight = 8;
	const barX = (width - barWidth) / 2;
	const barY = height - 100;

	// Background
	ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
	ctx.fillRect(barX, barY, barWidth, barHeight);

	// Progress
	ctx.fillStyle = "#4ecdc4";
	ctx.fillRect(barX, barY, barWidth * progress, barHeight);

	// Progress percentage
	ctx.fillStyle = "#ffffff";
	ctx.font = "24px Arial";
	ctx.textAlign = "center";
	ctx.fillText(`${Math.round(progress * 100)}%`, width / 2, height - 50);
});

