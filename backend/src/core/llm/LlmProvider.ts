interface LLMProvider {
    getResponse(prompt: string): Promise<string>;
}

class AnthropicProvider implements LLMProvider {
    async getResponse(prompt: string): Promise<string> {
        return `Anthropic fake response`
    }
}

class GeminiProvider implements LLMProvider {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is required');
        }
    }

    async getResponse(prompt: string): Promise<string> {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Extract the text from the response
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!content) {
                throw new Error('Invalid response format from Gemini API');
            }

            return content;
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            throw new Error(`Failed to get response from Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const myProvider = (): LLMProvider => new GeminiProvider();