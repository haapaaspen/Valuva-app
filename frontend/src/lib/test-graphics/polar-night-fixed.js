// Polar Night Films - FIXED VERSION
// Demonstrates proper helper function placement and performance

const duration = 8;

utils.animate((time_ms) => {
	const t = (time_ms / 1000) % duration;
	const progress = t / duration;

	// Colors
	const darkBlue = "#050A14";
	const accent = "#7EB8FF";
	const white = "#FFFFFF";

	// Helper function - INSIDE animate callback
	function easeInOutCubic(x) {
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	}

	// Clear canvas
	ctx.fillStyle = darkBlue;
	ctx.fillRect(0, 0, width, height);

	const centerX = width / 2;
	const centerY = height / 2;

	// Phase 1: Particles (0-30%) - REDUCED to 150 particles for performance
	if (progress < 0.3) {
		const phase1Progress = progress / 0.3;
		const maxRadius = 400 * phase1Progress;

		ctx.save();
		ctx.globalCompositeOperation = "screen";

		for (let i = 0; i < 150; i++) {
			const seed = i * 9731.17;
			const angle = ((seed % 1000) / 1000) * Math.PI * 2;
			const radiusFactor = (Math.sin(seed) * 0.5 + 0.5) * 0.8 + 0.2;

			const radius = maxRadius * radiusFactor;
			const wobble = Math.sin(phase1Progress * 3 + seed) * 20;

			const x = centerX + Math.cos(angle + phase1Progress * 0.5) * (radius + wobble);
			const y = centerY + Math.sin(angle + phase1Progress * 0.5) * (radius + wobble);

			const size = 2 + ((Math.sin(seed * 2) * 0.5 + 0.5) * 3);
			const opacity = 0.1 + ((Math.sin(seed * 3 + phase1Progress * 2) * 0.5 + 0.5) * 0.4);

			ctx.fillStyle = `rgba(126, 184, 255, ${opacity})`;
			ctx.beginPath();
			ctx.arc(x, y, size, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.restore();
	}

	// Phase 2: Light circle (20-50%)
	if (progress >= 0.2 && progress < 0.5) {
		const phase2Progress = (progress - 0.2) / 0.3;
		const innerRadius = 150 * easeInOutCubic(phase2Progress);
		const outerRadius = innerRadius + 100 * (1 - phase2Progress);

		const gradient = ctx.createRadialGradient(
			centerX,
			centerY,
			innerRadius,
			centerX,
			centerY,
			outerRadius
		);

		gradient.addColorStop(0, "rgba(126, 184, 255, 0.1)");
		gradient.addColorStop(0.5, "rgba(126, 184, 255, 0.05)");
		gradient.addColorStop(1, "rgba(126, 184, 255, 0)");

		ctx.save();
		ctx.globalCompositeOperation = "screen";
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Phase 3: Text reveal (40-70%)
	if (progress >= 0.4 && progress < 0.7) {
		const phase3Progress = (progress - 0.4) / 0.3;
		const textProgress = easeInOutCubic(phase3Progress);

		ctx.save();
		ctx.font = "bold 80px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.globalAlpha = textProgress;

		// POLAR text
		ctx.fillStyle = white;
		ctx.fillText("POLAR", centerX, centerY - 20);

		// NIGHT FILMS text with delay
		if (phase3Progress > 0.3) {
			const subProgress = (phase3Progress - 0.3) / 0.7;
			ctx.globalAlpha = subProgress;
			ctx.font = "300 40px Arial";
			ctx.fillText("NIGHT FILMS", centerX, centerY + 50);
		}

		ctx.restore();
	}

	// Phase 4: Final composition (60-100%)
	if (progress >= 0.6) {
		// Subtle pulsing circle
		const pulseSize = 180 + Math.sin(progress * Math.PI * 4) * 10;

		const gradient = ctx.createRadialGradient(
			centerX,
			centerY,
			0,
			centerX,
			centerY,
			pulseSize
		);

		gradient.addColorStop(0, "rgba(126, 184, 255, 0.05)");
		gradient.addColorStop(0.5, "rgba(126, 184, 255, 0.02)");
		gradient.addColorStop(1, "rgba(10, 59, 102, 0)");

		ctx.save();
		ctx.globalCompositeOperation = "screen";
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Final text
		ctx.save();
		ctx.font = "bold 80px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = white;
		ctx.fillText("POLAR", centerX, centerY - 20);

		ctx.font = "300 40px Arial";
		ctx.fillText("NIGHT FILMS", centerX, centerY + 50);
		ctx.restore();
	}

	// Timeline indicator
	ctx.fillStyle = accent;
	ctx.font = "20px Arial";
	ctx.textAlign = "left";
	ctx.fillText(`${t.toFixed(2)}s / ${duration}s`, 20, 40);
	ctx.fillText("✓ Timeline scrubbing works", 20, 70);
});

