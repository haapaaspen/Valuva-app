import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Download, Upload, RotateCcw } from 'lucide-react';

// Sample motion graphics components that could be AI-generated
const SampleComponents = {
  bouncingBall: `
    const BouncingBall = ({ progress }) => {
      const y = Math.abs(Math.sin(progress * Math.PI * 4)) * 200;
      const x = progress * 300;
      return (
        <div className="relative w-full h-64 bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden">
          <div 
            className="absolute w-8 h-8 bg-red-500 rounded-full shadow-lg"
            style={{
              transform: \`translate(\${x}px, \${240 - y}px)\`,
              transition: 'none'
            }}
          />
          <div className="absolute bottom-0 w-full h-2 bg-green-400" />
        </div>
      );
    };
  `,
  
  morphingShapes: `
    const MorphingShapes = ({ progress }) => {
      const rotation = progress * 360;
      const scale = 0.5 + Math.sin(progress * Math.PI * 2) * 0.3;
      const hue = progress * 360;
      return (
        <div className="relative w-full h-64 bg-gray-900 flex items-center justify-center">
          <div 
            className="w-24 h-24 rounded-lg"
            style={{
              transform: \`rotate(\${rotation}deg) scale(\${scale})\`,
              backgroundColor: \`hsl(\${hue}, 70%, 60%)\`,
              transition: 'none'
            }}
          />
          <div 
            className="absolute w-16 h-16 border-4 border-white rounded-full"
            style={{
              transform: \`rotate(\${-rotation * 0.5}deg) translateX(60px)\`,
              transition: 'none'
            }}
          />
        </div>
      );
    };
  `,
  
  textAnimation: `
    const TextAnimation = ({ progress }) => {
      const words = ['REACT', 'MOTION', 'GRAPHICS'];
      const wordIndex = Math.floor(progress * 3) % 3;
      const letterSpacing = Math.sin(progress * Math.PI * 6) * 10;
      const opacity = 0.3 + Math.sin(progress * Math.PI * 8) * 0.7;
      
      return (
        <div className="relative w-full h-64 bg-gradient-to-r from-purple-900 to-pink-900 flex items-center justify-center">
          <h1 
            className="text-6xl font-bold text-white"
            style={{
              letterSpacing: \`\${letterSpacing}px\`,
              opacity: opacity,
              transform: \`scale(\${1 + Math.sin(progress * Math.PI * 4) * 0.1})\`,
              transition: 'none'
            }}
          >
            {words[wordIndex]}
          </h1>
        </div>
      );
    };
  `
};

export default function ReactMotionGraphicsRND() {
  const [selectedComponent, setSelectedComponent] = useState('bouncingBall');
  const [customComponent, setCustomComponent] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [frames, setFrames] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const componentRef = useRef(null);

  // Dynamic component renderer
  const renderComponent = useCallback((componentCode, progress) => {
    try {
      // Handle custom components (simplified function format)
      if (customComponent.trim()) {
        try {
          // Create component function that returns JSX
          const componentFn = new Function('React', 'progress', `
            const { createElement: h } = React;
            return (${customComponent})({ progress });
          `);
          return componentFn(React, progress);
        } catch (error) {
          return <div className="text-red-500 p-4 border rounded">
            Custom component error: {error.message}
            <br />
            <small className="text-gray-600">
              Use format: ({'({ progress }) => h("div", { className: "..." }, ...)'})
            </small>
          </div>;
        }
      }
      
      // Render predefined components based on selection
      if (selectedComponent === 'bouncingBall') {
        const y = Math.abs(Math.sin(progress * Math.PI * 4)) * 200;
        const x = progress * 300;
        return (
          <div className="relative w-full h-64 bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden">
            <div 
              className="absolute w-8 h-8 bg-red-500 rounded-full shadow-lg"
              style={{
                transform: `translate(${x}px, ${240 - y}px)`,
                transition: 'none'
              }}
            />
            <div className="absolute bottom-0 w-full h-2 bg-green-400" />
          </div>
        );
      }
      
      if (selectedComponent === 'morphingShapes') {
        const rotation = progress * 360;
        const scale = 0.5 + Math.sin(progress * Math.PI * 2) * 0.3;
        const hue = progress * 360;
        return (
          <div className="relative w-full h-64 bg-gray-900 flex items-center justify-center">
            <div 
              className="w-24 h-24 rounded-lg"
              style={{
                transform: `rotate(${rotation}deg) scale(${scale})`,
                backgroundColor: `hsl(${hue}, 70%, 60%)`,
                transition: 'none'
              }}
            />
            <div 
              className="absolute w-16 h-16 border-4 border-white rounded-full"
              style={{
                transform: `rotate(${-rotation * 0.5}deg) translateX(60px)`,
                transition: 'none'
              }}
            />
          </div>
        );
      }
      
      if (selectedComponent === 'textAnimation') {
        const words = ['REACT', 'MOTION', 'GRAPHICS'];
        const wordIndex = Math.floor(progress * 3) % 3;
        const letterSpacing = Math.sin(progress * Math.PI * 6) * 10;
        const opacity = 0.3 + Math.sin(progress * Math.PI * 8) * 0.7;
        
        return (
          <div className="relative w-full h-64 bg-gradient-to-r from-purple-900 to-pink-900 flex items-center justify-center">
            <h1 
              className="text-6xl font-bold text-white"
              style={{
                letterSpacing: `${letterSpacing}px`,
                opacity: opacity,
                transform: `scale(${1 + Math.sin(progress * Math.PI * 4) * 0.1})`,
                transition: 'none'
              }}
            >
              {words[wordIndex]}
            </h1>
          </div>
        );
      }
      
      return <div className="text-gray-500 p-4">No component selected</div>;
      
    } catch (error) {
      return <div className="text-red-500 p-4">Error rendering component: {error.message}</div>;
    }
  }, [selectedComponent, customComponent, progress]);

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - (progress * 3000); // 3 second loop
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed % 3000) / 3000;
        setProgress(newProgress);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, progress]);

  // Capture frame to canvas
  const captureFrame = async () => {
    if (!componentRef.current || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = componentRef.current.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Use html2canvas-like approach (simplified)
    try {
      // For this demo, we'll create a simple representation
      // In a real implementation, you'd use libraries like html2canvas
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#333';
      ctx.font = '16px Arial';
      ctx.fillText(`Frame at progress: ${progress.toFixed(3)}`, 10, 30);
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing frame:', error);
      return null;
    }
  };

  // Export image sequence
  const exportImageSequence = async () => {
    setIsExporting(true);
    const frameCount = 30; // 30 frames for demo
    const newFrames = [];
    
    for (let i = 0; i < frameCount; i++) {
      const frameProgress = i / (frameCount - 1);
      setProgress(frameProgress);
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const frameData = await captureFrame();
      if (frameData) {
        newFrames.push({
          frame: i,
          progress: frameProgress,
          data: frameData
        });
      }
    }
    
    setFrames(newFrames);
    setIsExporting(false);
  };

  // Download frames as zip (simplified - just download first frame for demo)
  const downloadFrames = () => {
    if (frames.length === 0) return;
    
    frames.forEach((frame, index) => {
      const link = document.createElement('a');
      link.download = `frame_${String(index).padStart(3, '0')}.png`;
      link.href = frame.data;
      link.click();
    });
  };

  const currentComponentCode = customComponent || SampleComponents[selectedComponent];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">React Motion Graphics R&D</h1>
        <p className="text-gray-600">Evaluate React as a format for AI-generated motion graphics</p>
      </div>

      {/* Component Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Component Source</h2>
        <div className="flex gap-2 mb-4">
          {Object.keys(SampleComponents).map((key) => (
            <button
              key={key}
              onClick={() => {
                setSelectedComponent(key);
                setCustomComponent('');
              }}
              className={`px-4 py-2 rounded-lg ${
                selectedComponent === key && !customComponent
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Custom Component (simplified function format):
          </label>
          <textarea
            value={customComponent}
            onChange={(e) => setCustomComponent(e.target.value)}
            className="w-full h-32 p-3 border rounded-lg font-mono text-sm"
            placeholder="Paste React component function here..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Use format: ({'{ progress }'}) => {'{ return (...JSX here...) }'} 
          </p>
        </div>

        <details className="mb-4">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
            View current component source
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
            {currentComponentCode}
          </pre>
        </details>
      </div>

      {/* Preview & Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Preview</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Progress: {(progress * 100).toFixed(1)}%
            </span>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => {
                setProgress(0);
                setIsPlaying(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden mb-4">
          <div ref={componentRef}>
            {renderComponent(currentComponentCode, progress)}
          </div>
        </div>

        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={(e) => {
              setProgress(parseFloat(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Export Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Image Sequence Export</h2>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={exportImageSequence}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            <Upload size={16} />
            {isExporting ? 'Exporting...' : 'Export 30 Frames'}
          </button>
          
          {frames.length > 0 && (
            <button
              onClick={downloadFrames}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              <Download size={16} />
              Download Frames ({frames.length})
            </button>
          )}
        </div>

        {frames.length > 0 && (
          <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
            {frames.slice(0, 12).map((frame, index) => (
              <div key={index} className="border rounded">
                <img 
                  src={frame.data} 
                  alt={`Frame ${frame.frame}`}
                  className="w-full h-auto"
                />
                <div className="text-xs text-center p-1">
                  Frame {frame.frame}
                </div>
              </div>
            ))}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Analysis */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">React Format Analysis</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-600 mb-2">Advantages</h3>
            <ul className="space-y-1 text-sm">
              <li>• Rich component ecosystem and tooling</li>
              <li>• Declarative animation descriptions</li>
              <li>• Easy to template and parameterize</li>
              <li>• Great for complex UI animations</li>
              <li>• Excellent developer experience</li>
              <li>• Can leverage CSS animations + JS logic</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-600 mb-2">Considerations</h3>
            <ul className="space-y-1 text-sm">
              <li>• Requires React runtime</li>
              <li>• Bundle size considerations</li>
              <li>• Complex export pipeline needed</li>
              <li>• Performance depends on DOM updates</li>
              <li>• Limited to web-compatible formats</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}