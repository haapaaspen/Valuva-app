import type { ResolveApiProvider } from "./resolveApiProvider";
import type { Project as ToolboxProject, Timeline as ToolboxTimeline, Resolve as ToolboxResolveObject } from "./toolbox/DavinciResolve";

export interface IResolveApiProvider {
  initialize(pluginId: string): Promise<boolean>;
  isInitialized(): boolean;
  // Example: Exposing the raw Resolve object if needed for advanced use
  getRawResolveObject(): ToolboxResolveObject | null;

  getCurrentProjectName(): Promise<string | null>;
  getCurrentTimelineName(): Promise<string | null>;
  getCurrentTimecode(): Promise<string | null>;
  getTimelineFramerate(): Promise<number | null>;
  convertTimecodeToFrames(timecode: string): Promise<number | null>;
  convertFramesToTimecode(frames: number): Promise<string | null>;
  // Add more methods as your plugin requires...
}

export class ToolboxResolveApiProvider implements ResolveApiProvider {
    
}