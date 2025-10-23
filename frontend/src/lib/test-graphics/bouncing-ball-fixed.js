// Bouncing Ball - STATELESS VERSION
// This version works perfectly with timeline scrubbing in both directions

const duration = 3;

utils.animate((time_ms) => {
	const t = (time_ms / 1000) % duration;
	const progress = t / duration;

	// Background
	ctx.fillStyle = "#F8F9FA";
	ctx.fillRect(0, 0, width, height);

	// Ball parameters
	const ballRadius = 50;
	const ballColor = "#FF4136";
	const floor = 900;
	const gravity = 0.5;

	// Calculate ball position PURELY from time 't'
	// Simulate physics by calculating where ball would be at time 't'
	const bounceTime = 1.5; // Time for one complete bounce cycle
	const bounceProgress = (t % bounceTime) / bounceTime;

	// Parabolic motion (y = -gravity * t^2 + initial_velocity * t)
	const initialVelocity = Math.sqrt(2 * gravity * (floor - 200));
	const timeSinceBounce = bounceProgress * bounceTime;
	const yVelocity = initialVelocity - gravity * timeSinceBounce * 100;
	const ballY = floor - (initialVelocity * timeSinceBounce * 100 - 0.5 * gravity * Math.pow(timeSinceBounce * 100, 2));

	// Calculate squash based on proximity to floor (pure function of position)
	const distanceToFloor = Math.max(0, floor - ballY - ballRadius);
	const squash = 1 + (50 - Math.min(distanceToFloor, 50)) / 50 * 0.5;

	// Draw ball with squash
	ctx.save();
	ctx.translate(960, ballY);
	ctx.scale(1 / squash, squash);
	ctx.fillStyle = ballColor;
	ctx.beginPath();
	ctx.arc(0, 0, ballRadius, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	// Draw floor
	ctx.fillStyle = "#CCCCCC";
	ctx.fillRect(0, floor, width, height - floor);

	// Timeline indicator
	ctx.fillStyle = "#000000";
	ctx.font = "24px Arial";
	ctx.fillText(`Time: ${t.toFixed(2)}s`, 50, 50);
	ctx.fillText(`Works with timeline scrubbing ✓`, 50, 80);
});

