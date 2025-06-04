import { myProvider } from '../backend/src/core/llm/LlmProvider';
import 'dotenv/config'

console.log(process.env)

async function testLLM() {
    try {
        const provider = myProvider();
        console.log('Testing LLM provider...');
        
        const response = await provider.getResponse("Explain quantum computing in one sentence");
        console.log('Response:', response);
    } catch (error) {
        console.error('Error:', error);
    }
}

testLLM();
