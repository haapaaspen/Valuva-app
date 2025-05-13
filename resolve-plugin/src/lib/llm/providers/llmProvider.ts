
export interface LlmResponse {
    success: boolean;
    data?: string;
    error?: string;
}


export interface LlmProvider {
    query(prompt: string, options?: { signal?: AbortSignal }): Promise<LlmResponse>;
}