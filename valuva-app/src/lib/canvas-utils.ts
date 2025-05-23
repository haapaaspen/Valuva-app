// Canvas utilities for AI graphics generation
// Streamlined to only essential functions the AI actually uses


export interface CanvasUtils {
  // Animation
  animate: (drawFunction: (time_ms: number) => void) => void;
}


export function createCanvasUtils(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): CanvasUtils {
  
  return {
    // Animation system
    animate(drawFunction: (time_ms: number) => void) {
      let animationId: number;
      
      const animate = (timestamp: number) => {
        drawFunction(timestamp);
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
      
      // Return cleanup function (could be stored if needed)
      return () => cancelAnimationFrame(animationId);
    },
  };
} 