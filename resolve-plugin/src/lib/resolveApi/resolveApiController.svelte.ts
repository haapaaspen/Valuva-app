import type { ResolveApiProvider } from "./providers/resolveApiProvider";

export class ResolveApiController {
  private provider: ResolveApiProvider;

  constructor(provider: ResolveApiProvider) {
    this.provider = provider;
  }


}