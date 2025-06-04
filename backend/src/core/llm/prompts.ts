export type PromptContext = 'generate' | 'refine' | 'correct_errors';

export interface PromptTemplate {
    render<PromptContext>(): string;
}