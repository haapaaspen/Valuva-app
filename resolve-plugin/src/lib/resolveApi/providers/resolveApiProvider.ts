import type { ResolveApiProvider } from '../resolveApiProvider'; // Assuming you create this
// Import specific types from the .d.ts files you copied from Toolbox-main, e.g.:
import type { Resolve as ToolboxResolveObject, Project as ToolboxProject, Timeline as ToolboxTimeline } from './toolbox/ResolveAPI'; // Adjust path if you put types elsewhere

let WorkflowIntegration: any;
let NativeResolveAPI: ToolboxResolveObject | null = null;
let _isInitialized = false;
let _pluginId: string | null = null;

// --- Configuration for loading the .node module ---
// This is the most critical and environment-dependent part.
const NODE_MODULE_PATH = '../../../../../../Toolbox-main/Electron/WorkflowIntegration.node'; // VERY LIKELY NEEDS TO CHANGE

try {
  // TODO: Determine the correct, robust way to load this .node module
  // For development, this might work if paths are correct.
  // For production, this path needs to be relative to the installed plugin structure.
  WorkflowIntegration = require(NODE_MODULE_PATH);
  console.log('[ToolboxResolveApiProvider] WorkflowIntegration.node loaded (or attempted).');
} catch (e) {
  console.error(`[ToolboxResolveApiProvider] FAILED to load WorkflowIntegration.node from ${NODE_MODULE_PATH}:`, e);
  WorkflowIntegration = null;
}
// --- End Configuration ---


export class ToolboxResolveApiProvider implements IResolveApiProvider {
  constructor() {
    // Initialization is now deferred to the initialize() method
    console.log('[ToolboxResolveApiProvider] Constructed. Call initialize() to connect to Resolve.');
  }

  async initialize(pluginId: string): Promise<boolean> {
    if (_isInitialized) {
      console.warn(`[ToolboxResolveApiProvider] Already initialized with PluginID: ${_pluginId}`);
      return true;
    }
    if (!WorkflowIntegration) {
      console.error("[ToolboxResolveApiProvider] WorkflowIntegration.node is not loaded. Cannot initialize.");
      return false;
    }

    _pluginId = pluginId;
    try {
      console.log(`[ToolboxResolveApiProvider] Initializing native module with PluginID: ${_pluginId}...`);
      const success = WorkflowIntegration.Initialize(_pluginId);

      if (success) {
        NativeResolveAPI = WorkflowIntegration.GetResolve();
        if (!NativeResolveAPI) {
          console.error("[ToolboxResolveApiProvider] WorkflowIntegration.GetResolve() returned null or undefined.");
          _isInitialized = false; // Ensure it's marked as not initialized
          return false;
        }
        _isInitialized = true;
        console.log(`[ToolboxResolveApiProvider] Native module INITIALIZED successfully for PluginID: ${_pluginId}`);
        return true;
      } else {
        console.error(`[ToolboxResolveApiProvider] WorkflowIntegration.Initialize(${_pluginId}) returned false.`);
        _isInitialized = false;
        return false;
      }
    } catch (e) {
      console.error(`[ToolboxResolveApiProvider] Error during native module initialization for PluginID ${_pluginId}:`, e);
      _isInitialized = false;
      return false;
    }
  }

  isInitialized(): boolean {
    return _isInitialized && !!NativeResolveAPI;
  }

  private getResolve(): ToolboxResolveObject | null {
    if (!this.isInitialized()) {
      console.warn('[ToolboxResolveApiProvider] Resolve API not initialized. Call initialize() first.');
      return null;
    }
    return NativeResolveAPI;
  }

  getRawResolveObject(): ToolboxResolveObject | null {
    return this.getResolve();
  }

  async getCurrentProjectName(): Promise<string | null> {
    const resolve = this.getResolve();
    if (!resolve) return null;
    try {
      const projectManager = resolve.GetProjectManager();
      const project = projectManager?.GetCurrentProject() as ToolboxProject | undefined; // Cast if types are available
      return project?.GetName() ?? null;
    } catch (e) {
      console.error("[ToolboxResolveApiProvider] Error in getCurrentProjectName:", e);
      return null;
    }
  }

  async getCurrentTimelineName(): Promise<string | null> {
    const resolve = this.getResolve();
    if (!resolve) return null;
    try {
      const projectManager = resolve.GetProjectManager();
      const project = projectManager?.GetCurrentProject() as ToolboxProject | undefined;
      const timeline = project?.GetCurrentTimeline() as ToolboxTimeline | undefined;
      return timeline?.GetName() ?? null;
    } catch (e) {
      console.error("[ToolboxResolveApiProvider] Error in getCurrentTimelineName:", e);
      return null;
    }
  }

  async getCurrentTimecode(): Promise<string | null> {
    const resolve = this.getResolve();
    if (!resolve) return null;
    try {
      // The structure of how to get timecode depends on the Resolve API definition
      // It might be on the timeline, project, or directly on the resolve object.
      // This is an example based on common patterns.
      const projectManager = resolve.GetProjectManager();
      const project = projectManager?.GetCurrentProject() as ToolboxProject | undefined;
      const timeline = project?.GetCurrentTimeline() as ToolboxTimeline | undefined;
      return timeline?.GetCurrentTimecode() ?? null; // Method name might vary
    } catch (e) {
      console.error("[ToolboxResolveApiProvider] Error in getCurrentTimecode:", e);
      return null;
    }
  }

  async getTimelineFramerate(): Promise<number | null> {
    const resolve = this.getResolve();
    if (!resolve) return null;
    try {
        const project = resolve.GetProjectManager()?.GetCurrentProject() as ToolboxProject | undefined;
        const timeline = project?.GetCurrentTimeline() as ToolboxTimeline | undefined;
        const frameRateStr = timeline?.GetSetting("timelineFrameRate") as string | undefined;
        return frameRateStr ? parseInt(frameRateStr, 10) : null;
    } catch (e) {
        console.error("[ToolboxResolveApiProvider] Error in getTimelineFramerate:", e);
        return null;
    }
  }

  async convertTimecodeToFrames(timecode: string): Promise<number | null> {
    const resolve = this.getResolve();
    if (!resolve) return null;
    try {
        const framerate = await this.getTimelineFramerate();
        if (framerate === null || !timecode) return null;

        const tcArray = timecode.split(':');
        if (tcArray.length !== 4) return null; // Basic validation

        const h = parseInt(tcArray[0],10);
        const m = parseInt(tcArray[1],10);
        const s = parseInt(tcArray[2],10);
        const f = parseInt(tcArray[3],10);

        return (h * 3600 * framerate) + (m * 60 * framerate) + (s * framerate) + f;
    } catch (e) {
        console.error("[ToolboxResolveApiProvider] Error in convertTimecodeToFrames:", e);
        return null;
    }
  }

  async convertFramesToTimecode(frames: number): Promise<string | null> {
    const resolve = this.getResolve();
    if (!resolve) return null;
    try {
        const framerate = await this.getTimelineFramerate();
        if (framerate === null || frames < 0) return null;

        let remainingFrames = frames;

        const h = Math.floor(remainingFrames / (3600 * framerate));
        remainingFrames %= (3600 * framerate);

        const m = Math.floor(remainingFrames / (60 * framerate));
        remainingFrames %= (60 * framerate);

        const s = Math.floor(remainingFrames / framerate);
        const f = remainingFrames % framerate;

        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
    } catch (e) {
        console.error("[ToolboxResolveApiProvider] Error in convertFramesToTimecode:", e);
        return null;
    }
  }
  // ... Implement other methods from IResolveApiProvider
}