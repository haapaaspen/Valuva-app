// Valuva AI Generated Canvas Graphics
// Generated at: 22/10/2025, 19:56:12
// Duration: 8 seconds

// This code is designed to run with the Valuva canvas utilities
// Pre-provided variables: ctx, canvas, width (1920), height (1080), utils

// Animation constants
const duration = 8; // Animation duration in seconds
const particleCount = 150; // Number of stars/particles

utils.animate((time_ms) => {
    // Time calculations
    const t = (time_ms / 1000) % duration; // Time in seconds, looping
    const progress = t / duration; // Normalized progress (0 to 1)
    
    // Helper functions
    function drawStar(x, y, radius, opacity, color) {
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Star glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Star core
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Clear canvas with a dark background
    const bgProgress = Math.min(1, t / 1.5); // Background fades in over 1.5 seconds
    ctx.fillStyle = `rgba(2, 7, 30, ${bgProgress})`;
    ctx.fillRect(0, 0, width, height);
    
    // Draw aurora effect (northern lights)
    if (t > 1) {
        const auroraProgress = Math.min(1, (t - 1) / 2); // Aurora appears after 1s, builds over 2s
        
        ctx.save();
        ctx.globalAlpha = 0.3 * auroraProgress;
        
        for (let i = 0; i < 3; i++) {
            const wavePhase = t * 0.5 + i * 0.7;
            const yBase = height * 0.4 + i * 60;
            
            ctx.beginPath();
            ctx.moveTo(0, yBase + Math.sin(wavePhase) * 50);
            
            for (let x = 0; x < width; x += 20) {
                const y = yBase + Math.sin(wavePhase + x * 0.003) * 50;
                ctx.lineTo(x, y);
            }
            
            const gradient = ctx.createLinearGradient(0, yBase - 100, 0, yBase + 100);
            
            if (i === 0) {
                gradient.addColorStop(0, 'rgba(0, 200, 255, 0)');
                gradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(0, 200, 255, 0)');
            } else if (i === 1) {
                gradient.addColorStop(0, 'rgba(120, 0, 255, 0)');
                gradient.addColorStop(0.5, 'rgba(120, 0, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(120, 0, 255, 0)');
            } else {
                gradient.addColorStop(0, 'rgba(0, 255, 200, 0)');
                gradient.addColorStop(0.5, 'rgba(0, 255, 200, 0.8)');
                gradient.addColorStop(1, 'rgba(0, 255, 200, 0)');
            }
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 80;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // Draw stars/particles
    for (let i = 0; i < particleCount; i++) {
        const seed = i * 987.654;
        
        // Determine if this particle will be part of the logo formation
        const isLogoParticle = i < 100;
        
        // Random initial positions across the entire canvas
        const initialX = (seed * 743.5211) % width;
        const initialY = (seed * 547.3457) % height;
        
        // Logo formation positions (centered text)
        const logoX = width / 2 + (Math.cos(seed) * 300) - 150;
        const logoY = height / 2 + (Math.sin(seed) * 80);
        
        // Timing for this particle
        const particleDelay = isLogoParticle ? (seed % 2) : 0;
        const particleStart = 2 + particleDelay; // Start after 2-4 seconds
        const particleFormation = 5; // Formation complete by 5 seconds
        
        // Calculate particle properties based on time
        let x, y, radius, opacity, color;
        
        if (t < particleStart) {
            // Before particle appears
            x = initialX;
            y = initialY;
            radius = 0;
            opacity = 0;
            color = 'rgba(255, 255, 255, 0)';
        } else if (t < particleFormation && isLogoParticle) {
            // During logo formation (for logo particles)
            const formationProgress = (t - particleStart) / (particleFormation - particleStart);
            const easing = 1 - Math.pow(1 - formationProgress, 3); // Cubic ease-out
            
            x = initialX + (logoX - initialX) * easing;
            y = initialY + (logoY - initialY) * easing;
            radius = 1 + (seed % 1.5);
            opacity = Math.min(1, (t - particleStart) * 2);
            
            // Different colors for different particles
            const hue = (seed * 100) % 60 + 180; // Blues and purples (180-240)
            color = `hsla(${hue}, 100%, 70%, ${opacity})`;
        } else {
            // After formation or for background stars
            if (isLogoParticle) {
                // Logo particles stay in formation
                x = logoX;
                y = logoY;
                radius = 1 + (seed % 1.5);
                
                // Subtle pulsing effect for logo particles
                const pulse = 0.7 + Math.sin(t * 2 + seed) * 0.3;
                opacity = pulse;
                
                const hue = (seed * 100) % 60 + 180; // Blues and purples
                color = `hsla(${hue}, 100%, 70%, ${opacity})`;
            } else {
                // Background stars twinkle
                x = initialX;
                y = initialY;
                radius = 0.5 + (seed % 1);
                opacity = 0.3 + Math.sin(t * 1 + seed) * 0.3;
                color = 'rgba(255, 255, 255, 0.8)';
            }
        }
        
        // Draw the star/particle
        drawStar(x, y, radius, opacity, color);
    }
    
    // Draw the text
    if (t > 5) {
        const textProgress = Math.min(1, (t - 5) / 1); // Text appears after 5s, completes by 6s
        
        ctx.save();
        ctx.globalAlpha = textProgress;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw "POLAR NIGHT" text
        ctx.font = 'bold 80px Arial, Helvetica, sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('POLAR NIGHT', width / 2, height / 2);
        
        // Draw "FILMS" text
        ctx.font = '40px Arial, Helvetica, sans-serif';
        ctx.fillStyle = 'rgba(200, 220, 255, 0.9)';
        ctx.fillText('FILMS', width / 2, height / 2 + 70);
        
        // Draw lens flare effect
        if (textProgress > 0.5) {
            const flareProgress = (textProgress - 0.5) * 2;
            const flareX = width / 2;
            const flareY = height / 2;
            
            const flareGradient = ctx.createRadialGradient(
                flareX, flareY, 0,
                flareX, flareY, 400 * flareProgress
            );
            
            flareGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            flareGradient.addColorStop(0.1, 'rgba(100, 180, 255, 0.2)');
            flareGradient.addColorStop(0.3, 'rgba(70, 120, 255, 0.1)');
            flareGradient.addColorStop(1, 'rgba(0, 0, 100, 0)');
            
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = flareGradient;
            ctx.beginPath();
            ctx.arc(flareX, flareY, 400 * flareProgress, 0, Math.PI * 2);
            ctx.fill();
            
            // Add some lens flare artifacts
            ctx.globalCompositeOperation = 'screen';
            for (let i = 0; i < 5; i++) {
                const artifactSize = (20 + i * 15) * flareProgress;
                const distance = (100 + i * 60) * flareProgress;
                const angle = i * Math.PI / 3;
                
                const artifactX = flareX + Math.cos(angle) * distance;
                const artifactY = flareY + Math.sin(angle) * distance;
                
                const artifactGradient = ctx.createRadialGradient(
                    artifactX, artifactY, 0,
                    artifactX, artifactY, artifactSize
                );
                
                artifactGradient.addColorStop(0, 'rgba(200, 220, 255, 0.3)');
                artifactGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
                
                ctx.fillStyle = artifactGradient;
                ctx.beginPath();
                ctx.arc(artifactX, artifactY, artifactSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }
});
