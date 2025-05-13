import type { ValuvaResolveAPI } from './types/ValuvaResolveAPI';

export class ResolveApiController {
  private api: ValuvaResolveAPI;

  constructor(provider: ValuvaResolveAPI) {
    this.api = provider;
  }

  async isResolveConnected(): Promise<boolean> {
    return this.api.isResolveConnected();
  }

  async openPage(pageName: string): Promise<boolean> {
    return this.api.openPage(pageName);
  }

  async createProject(projectName: string): Promise<any> {
    return this.api.createProject(projectName);
  }

  async saveProject(): Promise<boolean> {
    return this.api.saveProject();
  }

  async openProject(projectName: string): Promise<any> {
    return this.api.openProject(projectName);
  }

  async createBin(binName: string): Promise<any> {
    return this.api.createBin(binName);
  }

  async selectBin(binName: string): Promise<boolean> {
    return this.api.selectBin(binName);
  }

  async deleteBin(binName: string): Promise<boolean> {
    return this.api.deleteBin(binName);
  }

  async addClips(filePathsArray: string[]): Promise<any> {
    return this.api.addClips(filePathsArray);
  }

  async createTimeline(timelineName: string): Promise<any> {
    return this.api.createTimeline(timelineName);
  }

  async selectTimeline(timelineName: string): Promise<boolean> {
    return this.api.selectTimeline(timelineName);
  }

  async renderTimeline(
    timelineName: string,
    renderPresetName: string,
    targetDirPath: string,
    targetClipName: string
  ): Promise<any> {
    return this.api.renderTimeline(timelineName, renderPresetName, targetDirPath, targetClipName);
  }

  async getRenderPresets(): Promise<string[]> {
    return this.api.getRenderPresets();
  }
}