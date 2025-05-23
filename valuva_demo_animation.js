// Valuva Demo Animation - Advanced Canvas Graphics
// This file demonstrates the full capabilities of the Valuva canvas system
// Animation Duration: 15 seconds (loops automatically)

// Create animated scene with timeline control
utils.animate((time) => {
    // Convert time to seconds and create a 15-second loop
    const t = (time * 0.001) % 15;
    
    // === ANIMATED BACKGROUND ===
    // Create a swirling gradient that changes over time
    const gradient = utils.createGradient('radial', 
        width/2 + Math.sin(t * 0.3) * 100, 
        height/2 + Math.cos(t * 0.4) * 100, 
        0,
        width/2, height/2, 
        Math.max(width, height) * 0.8
    );
    
    const hue1 = (t * 24) % 360;  // Complete hue cycle in 15 seconds
    const hue2 = (t * 24 + 120) % 360;
    const hue3 = (t * 24 + 240) % 360;
    
    gradient.addColorStop(0, `hsl(${hue1}, 70%, 15%)`);
    gradient.addColorStop(0.4, `hsl(${hue2}, 60%, 10%)`);
    gradient.addColorStop(0.8, `hsl(${hue3}, 50%, 8%)`);
    gradient.addColorStop(1, 'hsl(280, 40%, 5%)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // === FLOATING PARTICLES ===
    // Create dynamic particle system
    const particles = utils.createParticles(120);
    particles.forEach((particle, i) => {
        // Add wave motion to particles
        particle.x += Math.sin(t * 0.5 + particle.y * 0.005) * 1.5;
        particle.y += Math.cos(t * 0.3 + particle.x * 0.003) * 1.2;
        
        // Make particles pulse
        const pulse = Math.sin(t * 2 + i * 0.1) * 0.5 + 1;
        const originalSize = particle.size;
        particle.size = originalSize * pulse;
        
        // Create particle trails
        ctx.save();
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.fillStyle = `hsl(${particle.hue + t * 20}, 60%, 70%)`;
        
        // Trail effect
        for (let j = 1; j <= 5; j++) {
            ctx.globalAlpha = particle.opacity * (0.4 - j * 0.07);
            ctx.beginPath();
            ctx.arc(
                particle.x - particle.speedX * j * 3, 
                particle.y - particle.speedY * j * 3, 
                particle.size * (1 - j * 0.15), 
                0, Math.PI * 2
            );
            ctx.fill();
        }
        ctx.restore();
        
        // Draw main particle
        particle.draw(ctx);
        particle.size = originalSize; // Restore original size
    });
    
    // === ORBITING GEOMETRIC SHAPES ===
    const orbitCount = 16;
    for (let i = 0; i < orbitCount; i++) {
        const angle = (i * Math.PI * 2 / orbitCount) + t * 0.5;
        const radius = 200 + Math.sin(t * 1.5 + i * 0.5) * 150;
        const x = width/2 + Math.cos(angle) * radius;
        const y = height/2 + Math.sin(angle) * radius;
        
        const size = 25 + Math.sin(t * 2 + i) * 20;
        const rotation = t * 2 + i * 0.3;
        const shapeType = ['triangle', 'hexagon', 'star'][i % 3];
        
        ctx.save();
        ctx.globalAlpha = 0.8;
        
        // Glow effect for shapes
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${i * 22.5 + t * 40}, 80%, 60%)`;
        
        ctx.fillStyle = `hsl(${i * 22.5 + t * 40}, 70%, 60%)`;
        ctx.strokeStyle = `hsl(${i * 22.5 + t * 40}, 80%, 80%)`;
        ctx.lineWidth = 2;
        
        utils.drawShape(shapeType, x, y, size, rotation);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    
    // === ENERGY RINGS ===
    for (let ring = 0; ring < 4; ring++) {
        const ringTime = t + ring * 1.5;
        const ringRadius = (Math.sin(ringTime * 0.8) + 1) * 300 + 150;
        const segments = 24;
        
        ctx.save();
        ctx.globalAlpha = 0.4 - ring * 0.08;
        ctx.strokeStyle = `hsl(${ringTime * 60 + ring * 45}, 70%, 50%)`;
        ctx.lineWidth = 3;
        
        // Draw segmented ring
        for (let seg = 0; seg < segments; seg++) {
            if (seg % 3 !== 0) continue; // Skip some segments for effect
            
            const segAngle = (seg * Math.PI * 2 / segments) + ringTime * 0.3;
            const segStart = segAngle - 0.15;
            const segEnd = segAngle + 0.15;
            
            ctx.beginPath();
            ctx.arc(width/2, height/2, ringRadius, segStart, segEnd);
            ctx.stroke();
        }
        ctx.restore();
    }
    
    // === DYNAMIC TEXT EFFECTS ===
    // Main title with multiple effects
    const titlePulse = Math.sin(t * 1.5) * 0.4 + 1;
    const titleY = height/2 - 120;
    
    // Title shadow/glow layers
    for (let layer = 4; layer >= 0; layer--) {
        ctx.save();
        ctx.globalAlpha = 0.6 - layer * 0.12;
        
        const glowSize = 120 + layer * 8;
        const glowColor = `hsl(${t * 80 + layer * 20}, 80%, ${60 + layer * 5}%)`;
        
        ctx.font = `bold ${glowSize * titlePulse}px "Segoe UI", Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = glowColor;
        
        if (layer > 0) {
            ctx.shadowBlur = layer * 5;
            ctx.shadowColor = glowColor;
        }
        
        ctx.fillText('VALUVA', width/2, titleY);
        ctx.restore();
    }
    
    // Main title text
    ctx.save();
    ctx.font = `bold ${120 * titlePulse}px "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Create gradient text
    const textGradient = utils.createGradient('linear', 0, titleY - 60, 0, titleY + 60);
    textGradient.addColorStop(0, '#ffffff');
    textGradient.addColorStop(0.5, `hsl(${t * 100}, 70%, 90%)`);
    textGradient.addColorStop(1, `hsl(${t * 100 + 60}, 60%, 80%)`);
    
    ctx.fillStyle = textGradient;
    ctx.fillText('VALUVA', width/2, titleY);
    ctx.restore();
    
    // === ANIMATED SUBTITLE WITH TYPEWRITER EFFECT ===
    const subtitle = 'Advanced AI Graphics Engine • Real-time Canvas Animation';
    const typewriterSpeed = 0.8;
    const typewriterLength = Math.min(subtitle.length, Math.floor((t * typewriterSpeed * 10) % (subtitle.length + 30)));
    const displaySubtitle = subtitle.substring(0, Math.max(0, typewriterLength));
    
    ctx.save();
    ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `hsl(${t * 60 + 180}, 70%, 80%)`;
    ctx.fillText(displaySubtitle, width/2, height/2 + 50);
    
    // Blinking cursor
    if (typewriterLength < subtitle.length && Math.sin(t * 8) > 0) {
        const textWidth = ctx.measureText(displaySubtitle).width;
        ctx.fillStyle = `hsl(${t * 120}, 80%, 90%)`;
        ctx.fillRect(width/2 + textWidth/2 + 5, height/2 + 35, 3, 30);
    }
    ctx.restore();
    
    // === PROGRESS VISUALIZATION ===
    // Animated progress bars showing different timelines
    const progressY = height - 200;
    const progressWidth = 600;
    const progressHeight = 12;
    const progressX = (width - progressWidth) / 2;
    
    // Background bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
    
    // Multiple progress layers
    for (let layer = 0; layer < 3; layer++) {
        const layerProgress = (Math.sin(t * (1 + layer * 0.3)) + 1) / 2;
        const layerHeight = progressHeight - layer * 3;
        const layerY = progressY + layer * 1.5;
        
        const progressGradient = utils.createGradient('linear', progressX, 0, progressX + progressWidth * layerProgress, 0);
        progressGradient.addColorStop(0, `hsl(${t * 50 + layer * 60}, 80%, 60%)`);
        progressGradient.addColorStop(1, `hsl(${t * 50 + layer * 60 + 40}, 70%, 70%)`);
        
        ctx.fillStyle = progressGradient;
        ctx.fillRect(progressX, layerY, progressWidth * layerProgress, layerHeight);
    }
    
    // === CORNER DECORATIONS ===
    // Animated corner elements
    const cornerSize = 80;
    const corners = [
        { x: cornerSize, y: cornerSize },
        { x: width - cornerSize, y: cornerSize },
        { x: cornerSize, y: height - cornerSize },
        { x: width - cornerSize, y: height - cornerSize }
    ];
    
    corners.forEach((corner, index) => {
        const cornerTime = t + index * 0.5;
        const rotation = cornerTime * 0.7;
        const scale = Math.sin(cornerTime * 2) * 0.3 + 1;
        
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = `hsl(${cornerTime * 70 + index * 90}, 70%, 60%)`;
        ctx.lineWidth = 3;
        
        utils.drawShape(['triangle', 'hexagon', 'star', 'triangle'][index], corner.x, corner.y, cornerSize * scale, rotation);
        ctx.stroke();
        ctx.restore();
    });
    
    // === STATISTICS DISPLAY ===
    // Show animation stats
    ctx.save();
    ctx.font = '14px "Segoe UI", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    
    const stats = [
        `Time: ${t.toFixed(2)}s`,
        `Frame: ${Math.floor(t * 60)}`,
        `Particles: 120`,
        `Shapes: ${orbitCount + 4}`,
        `Effects: Active`
    ];
    
    stats.forEach((stat, i) => {
        ctx.fillText(stat, 20, height - 100 + i * 18);
    });
    ctx.restore();
    
    // === PERFORMANCE INDICATOR ===
    // Visual FPS indicator
    const fpsColor = `hsl(${Math.min(120, t * 10 % 120)}, 80%, 60%)`;
    ctx.save();
    ctx.fillStyle = fpsColor;
    ctx.beginPath();
    ctx.arc(width - 30, 30, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}); 