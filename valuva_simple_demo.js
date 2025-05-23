// Valuva Simple Demo - Basic Animation Example
// A simpler demonstration of timeline-controlled animation
// Animation Duration: 10 seconds (loops automatically)

utils.animate((time) => {
    // Convert to seconds and create a 10-second loop
    const t = (time * 0.001) % 10;
    
    // Animated background gradient (completes cycle in 10 seconds)
    const gradient = utils.createGradient('linear', 0, 0, width, height);
    gradient.addColorStop(0, `hsl(${t * 36}, 60%, 20%)`);
    gradient.addColorStop(0.5, `hsl(${t * 36 + 60}, 50%, 15%)`);
    gradient.addColorStop(1, `hsl(${t * 36 + 120}, 40%, 10%)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Floating particles
    const particles = utils.createParticles(40);
    particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
    });
    
    // Orbiting shapes around center (complete orbit in 10 seconds)
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2 / 8) + (t * Math.PI * 2 / 10);
        const radius = 180;
        const x = width/2 + Math.cos(angle) * radius;
        const y = height/2 + Math.sin(angle) * radius;
        
        ctx.save();
        ctx.fillStyle = `hsl(${i * 45 + t * 36}, 70%, 60%)`;
        ctx.globalAlpha = 0.8;
        utils.drawShape(['triangle', 'hexagon'][i % 2], x, y, 30, t + i);
        ctx.fill();
        ctx.restore();
    }
    
    // Pulsing title (2-second pulse cycle)
    const pulse = Math.sin(t * Math.PI) * 0.3 + 1;
    utils.drawGlowText(
        'SIMPLE DEMO', 
        width/2, 
        height/2 - 80, 
        60 * pulse, 
        '#ffffff', 
        `hsl(${t * 36}, 80%, 60%)`
    );
    
    // Subtitle
    ctx.save();
    ctx.font = '24px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `hsl(${t * 36 + 180}, 70%, 80%)`;
    ctx.fillText('Timeline Controlled Animation • 10s Loop', width/2, height/2 + 40);
    ctx.restore();
    
    // Progress indicator (shows 10-second progress)
    const progress = t / 10;
    const barWidth = 300;
    const barX = (width - barWidth) / 2;
    const barY = height - 100;
    
    // Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(barX, barY, barWidth, 6);
    
    // Progress
    const progressGrad = utils.createGradient('linear', barX, 0, barX + barWidth * progress, 0);
    progressGrad.addColorStop(0, `hsl(${t * 36}, 80%, 60%)`);
    progressGrad.addColorStop(1, `hsl(${t * 36 + 120}, 70%, 70%)`);
    
    ctx.fillStyle = progressGrad;
    ctx.fillRect(barX, barY, barWidth * progress, 6);
    
    // Time display
    ctx.save();
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Time: ${t.toFixed(1)}s / 10.0s`, width/2, height - 50);
    ctx.restore();
}); 