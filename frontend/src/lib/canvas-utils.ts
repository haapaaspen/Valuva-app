// Canvas utilities for AI graphics generation

export interface CanvasUtils {
  animate: (drawFunction: (time_ms: number) => void) => void;
  _render: () => void;
}

export function createCanvasUtils(
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement,
  getTimeCallback: () => number
): CanvasUtils {
  let drawFunction: ((time_ms: number) => void) | null = null;
  
  return {
    // Store draw function (called by AI graphics code)
    animate(fn: (time_ms: number) => void) {
      drawFunction = fn;
    },
    
    // Render current frame (called by canvas component)
    _render() {
      if (drawFunction) {
        const time_ms = getTimeCallback() * 1000;
        drawFunction(time_ms);
      }
    }
  };
}

