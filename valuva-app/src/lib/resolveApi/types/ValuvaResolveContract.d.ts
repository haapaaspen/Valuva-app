// resolve-plugin/src/lib/resolveBridge/types/MyResolveBridgeAPI.d.ts

// This interface defines the contract for the API exposed from Electron's preload
// script to your SvelteKit application.
// All methods should return Promises because communication across the context bridge is asynchronous.

export interface ValuvaResolveContract {
  isResolveConnected: () => Promise<boolean>;

  /**
   * Switches to the indicated page in DaVinci Resolve.
   * @param pageName The name of the page (e.g., "edit", "color", "media").
   *                 These should correspond to ResolveEnums.Pages values.
   */
  openPage: (pageName: string) => Promise<boolean>; // Resolve's OpenPage returns boolean

  createProject: (projectName: string) => Promise<any>; // Consider a more specific return type if possible (e.g., ProjectId or success status)
  saveProject: () => Promise<boolean>; // Resolve's SaveProject returns boolean
  openProject: (projectName: string) => Promise<any>; // Similar to createProject, consider specific return
  
  createBin: (binName: string) => Promise<any>; // Consider specific return (e.g., BinId or success status)
  selectBin: (binName: string) => Promise<boolean>; // Assuming this would be a success/failure
  deleteBin: (binName: string) => Promise<boolean>; // Assuming success/failure

  /**
   * Adds clips from the given file paths to the current bin in the media pool.
   * @param filePathsArray An array of absolute file paths.
   * @returns A promise that might resolve to information about the added clips or a success status.
   */
  addClips: (filePathsArray: string[]) => Promise<any>; // Consider specific return (e.g., array of MediaPoolItemInfo or success)

  createTimeline: (timelineName: string) => Promise<any>; // Consider specific return (e.g., TimelineId or success)
  selectTimeline: (timelineName: string) => Promise<boolean>; // Assuming success/failure
  
  renderTimeline: (
    timelineName: string,
    renderPresetName: string,
    targetDirPath: string,
    targetClipName: string
  ) => Promise<any>; // Consider specific return (e.g., JobId or success)

  getRenderPresets: () => Promise<string[]>; // Resolve's GetRenderPresetList returns Preset[] (array of strings)

  // Add any new methods here. For example:
  // getProjectName: () => Promise<string | null>;
  // getCurrentTimelineName: () => Promise<string | null>;
}
