# AI Graphics Code - Common Errors & Solutions

## Overview
This document outlines common mistakes the AI makes when generating canvas graphics code and shows the correct patterns to use. All graphics must support **bidirectional timeline scrubbing**.

---

## Error #1: Mutable State Outside `utils.animate()`

### ❌ WRONG - Breaks Timeline Scrubbing
```javascript
// State gets mutated and only moves forward
let position = { x: 0, y: 0 };
let velocity = { x: 5, y: 2 };

utils.animate((time_ms) => {
    // This only increments - can't scrub backwards!
    position.x += velocity.x;
    position.y += velocity.y;
    
    ctx.fillRect(position.x, position.y, 50, 50);
});
```

**Problem:** When user scrubs timeline backwards, `position` doesn't reset. Animation only works forward.

### ✅ CORRECT - Pure Calculation from Time
```javascript
const duration = 5;

utils.animate((time_ms) => {
    const t = (time_ms / 1000) % duration;
    const progress = t / duration;
    
    // Calculate position directly from time
    const x = width * progress;
    const y = height / 2 + Math.sin(progress * Math.PI * 2) * 100;
    
    ctx.fillRect(x, y, 50, 50);
});
```

**Why it works:** Everything is calculated from `t` or `progress`. Scrubbing to any time always produces the same result.

---

## Error #2: Stateful Particle Systems

### ❌ WRONG - Particles with Update Methods
```javascript
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.z = 1000;
        this.speed = Math.random() * 2;
    }
    
    update() {
        this.z -= this.speed; // ❌ State mutation
        if (this.z < 1) this.reset();
    }
}

const particles = Array(300).fill().map(() => new Particle());

utils.animate((time_ms) => {
    particles.forEach(p => {
        p.update(); // ❌ Only moves forward!
        p.draw();
    });
});
```

**Problem:** 
- Particles can't go backwards in time
- Timeline scrubbing fails completely
- Each particle maintains state between frames

### ✅ CORRECT - Stateless Particles
```javascript
const duration = 5;

utils.animate((time_ms) => {
    const t = (time_ms / 1000) % duration;
    
    // Generate particles based on time
    for (let i = 0; i < 150; i++) {
        const seed = i * 9731.17; // Unique seed per particle
        
        // Calculate position purely from time
        const x = ((t * 100 + seed) % width);
        const y = (Math.sin(t * 2 + seed) * 0.5 + 0.5) * height;
        const size = 2 + (Math.sin(seed) * 0.5 + 0.5) * 3;
        const opacity = 0.3 + Math.sin(t + seed) * 0.2;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
});
```

**Why it works:**
- No classes, no state
- Each particle position calculated from `t + seed`
- Same `t` value always produces same frame
- Timeline scrubbing works perfectly

---

## Error #3: Helper Functions Outside `utils.animate()`

### ❌ WRONG - Functions Can't Access `ctx`
```javascript
// Helper defined outside
function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color; // ❌ ctx may not be accessible!
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

utils.animate((time_ms) => {
    const t = (time_ms / 1000) % duration;
    
    drawCircle(width/2, height/2, 100, "#ff0000"); // ❌ May crash!
});
```

**Problem:** 
- `ctx` is a global but scope chain breaks with `new Function()`
- Helper functions outside may not have proper access
- Causes runtime errors or nothing renders

### ✅ CORRECT - Helpers Inside `utils.animate()`
```javascript
const duration = 5;

utils.animate((time_ms) => {
    const t = (time_ms / 1000) % duration;
    const progress = t / duration;
    
    // Helper function INSIDE animate callback
    function drawCircle(x, y, radius, color) {
        ctx.fillStyle = color; // ✓ Has access to ctx
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    
    // Use helper safely
    drawCircle(width * progress, height/2, 50, "#ff0000");
});
```

**Why it works:** Helper functions defined inside the callback have proper access to all globals (`ctx`, `canvas`, `width`, `height`).

---

## Error #4: Physics Simulations with State

### ❌ WRONG - Stateful Bouncing Ball
```javascript
let position = { x: 960, y: 200 };
let velocity = { x: 0, y: 0 };
const gravity = 0.25;

function init() {
    position = { x: 960, y: 200 };
    velocity = { x: 0, y: 0 };
}

init();

utils.animate((time_ms) => {
    const loopProgress = (time_ms / 1000) % 3;
    
    // Reset on loop
    if (loopProgress < 0.05) init(); // ❌ Only works forward!
    
    // Update physics
    velocity.y += gravity; // ❌ State mutation
    position.y += velocity.y; // ❌ State mutation
    
    ctx.fillRect(position.x, position.y, 50, 50);
});
```

**Problem:** Can't scrub backwards. Timeline position and ball position are disconnected.

### ✅ CORRECT - Calculate Physics from Time
```javascript
const duration = 3;

utils.animate((time_ms) => {
    const t = (time_ms / 1000) % duration;
    
    // Constants
    const gravity = 0.5;
    const floor = 900;
    const bounceTime = 1.5;
    
    // Calculate where ball should be at time 't'
    const bounceProgress = (t % bounceTime) / bounceTime;
    const initialVelocity = Math.sqrt(2 * gravity * (floor - 200));
    const timeSinceBounce = bounceProgress * bounceTime;
    
    // Pure physics calculation
    const ballY = floor - (
        initialVelocity * timeSinceBounce * 100 - 
        0.5 * gravity * Math.pow(timeSinceBounce * 100, 2)
    );
    
    ctx.fillRect(960, ballY, 50, 50);
});
```

**Why it works:** Ball position is a pure function of time `t`. Any time value produces the correct ball position.

---

## Error #5: Too Many Particles (Performance Issues)

### ❌ WRONG - Excessive Particle Count
```javascript
utils.animate((time_ms) => {
    // Drawing 800+ particles every frame
    for (let i = 0; i < 800; i++) { // ❌ Too many!
        // Complex calculations per particle
        const x = /* complex math */;
        const y = /* complex math */;
        ctx.fillRect(x, y, 2, 2);
    }
});
```

**Problem:** Performance degrades, especially during timeline scrubbing. Can freeze the UI.

### ✅ CORRECT - Reasonable Particle Count
```javascript
utils.animate((time_ms) => {
    const t = (time_ms / 1000) % duration;
    
    // Maximum 150-200 particles
    for (let i = 0; i < 150; i++) { // ✓ Performant
        const seed = i * 9731.17;
        const x = ((t * 100 + seed) % width);
        const y = Math.sin(t + seed) * height/2 + height/2;
        
        ctx.fillRect(x, y, 2, 2);
    }
});
```

**Rule:** Keep particle count ≤ 200 for smooth performance.

---

## Error #6: Missing Canvas Clear

### ❌ WRONG - No Canvas Clear
```javascript
utils.animate((time_ms) => {
    const t = (time_ms / 1000) % duration;
    
    // Drawing without clearing
    ctx.fillRect(t * 100, height/2, 50, 50); // ❌ Trails everywhere!
});
```

**Problem:** Previous frames remain visible, creating trails.

### ✅ CORRECT - Always Clear First
```javascript
utils.animate((time_ms) => {
    const t = (time_ms / 1000) % duration;
    
    // ALWAYS clear/fill canvas first
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    
    // Now draw
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(t * 100, height/2, 50, 50);
});
```

**Rule:** First line in `utils.animate()` should always clear the canvas.

---

## Complete Correct Template

```javascript
// 1. Declare duration
const duration = 5;

// 2. Wrap everything in utils.animate()
utils.animate((time_ms) => {
    // 3. Calculate time variables
    const t = (time_ms / 1000) % duration;
    const progress = t / duration; // 0 to 1
    
    // 4. Define helper functions INSIDE (if needed)
    function drawStar(x, y, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        // ... star drawing code
        ctx.fill();
    }
    
    // 5. ALWAYS clear canvas first
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    
    // 6. Calculate ALL values from 't' or 'progress'
    const x = width * progress;
    const y = height/2 + Math.sin(progress * Math.PI * 2) * 100;
    const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
    
    // 7. Draw based on calculated values
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(x, y, 50 * scale, 50 * scale);
    
    // 8. Particles: loop with calculated positions
    for (let i = 0; i < 150; i++) {
        const seed = i * 1234.5;
        const px = ((t * 50 + seed) % width);
        const py = Math.sin(t + seed) * height/2 + height/2;
        drawStar(px, py, 3, "#ffffff");
    }
});
```

---

## Critical Rules Checklist

✅ **DO:**
- Calculate everything from `t` or `progress`
- Define helper functions INSIDE `utils.animate()`
- Clear canvas at start of every frame
- Use Math.sin/cos with `t` for periodic motion
- Use modulo (%) with `t` for repeating patterns
- Keep particle counts ≤ 200
- Use `const` for duration and other constants

❌ **DON'T:**
- Create mutable state outside `utils.animate()`
- Use classes with update() methods
- Define helper functions outside `utils.animate()`
- Mutate variables between frames (+=, -=, etc.)
- Create 500+ particles
- Forget to clear the canvas
- Use `let` for accumulating values

---

## Testing Timeline Scrubbing

To verify your animation works correctly:

1. **Load the animation**
2. **Drag timeline forward** - should animate normally
3. **Drag timeline backward** - should animate in reverse
4. **Jump to middle** - should show correct frame instantly
5. **Scrub quickly back/forth** - should be smooth

If any of these fail, you have stateful code that needs to be fixed.

