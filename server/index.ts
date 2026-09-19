import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      console.error("Internal Error: Valid GEMINI_API_KEY is missing from .env");
      return res.status(500).json({ error: 'Please set your actual GEMINI_API_KEY in the .env file. Currently it is using the default placeholder.' });
    }
    const ai = new GoogleGenAI({ apiKey });
    const params = req.body;
    
    // Validate request params roughly
    if (!params || !params.mode || !params.language || !params.framework || !params.input) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const prompt = `You are an expert software tester and QA engineer.
Task: Generate test cases for the following ${params.mode} using ${params.language} and ${params.framework}.

Input:
${params.input}

CRITICAL INSTRUCTIONS FOR SPEED AND QUALITY:
1. Test Case Quantity:
   - If the input code is LONG (e.g., > 15-20 lines or complex), you MUST generate around 8-10 distinct test cases.
   - If the input code is SHORT (e.g., < 15 lines), generate between 2 and 5 test cases.
   - IMPORTANT: Keep the test code concise. Avoid unnecessary boilerplate to ensure FAST generation.
2. Test Case Correctness & Simulation:
   - Evaluate the user's input code for bugs.
   - If the code is 100% correct, all your generated test cases should be marked as "passed": true in the testDetails array.
   - If the code has bugs or logic errors, simulate running the tests against the ORIGINAL buggy code. Mark the tests that would fail as "passed": false, and provide a detailed "errorReason" explaining exactly why the test failed based on the user's code.
3. Provide the complete, runnable test suite code.
4. If the input code has syntax errors or logic flaws, fix them and provide the updated code in 'updatedCode'. IMPORTANT: 'updatedCode' MUST be only the precise, minimal code snippet that resolves the error. DO NOT return the entire original file or unrelated code.
5. Calculate estimated coverage, edge cases, and confidence.
6. Provide a brief explanation of the tests and any changes made.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "Short status like 'Tests Generated' or 'Code Repaired'" },
            confidence: { type: Type.INTEGER, description: "Confidence percentage 0-100" },
            testCount: { type: Type.INTEGER },
            edgeCases: { type: Type.INTEGER },
            coveragePercent: { type: Type.INTEGER },
            testCode: { type: Type.STRING, description: "The actual test code" },
            updatedCode: { type: Type.STRING, description: "Fixed/Updated code if applicable, else empty string" },
            hasUpdatedCode: { type: Type.BOOLEAN },
            explanation: { type: Type.STRING },
            whatChanged: { type: Type.STRING, description: "Explanation of what was fixed, if any" },
            testDetails: {
              type: Type.ARRAY,
              description: "Detailed results of simulating the tests against the user's original input code.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the test case" },
                  passed: { type: Type.BOOLEAN, description: "Whether the test passes against the original code" },
                  errorReason: { type: Type.STRING, description: "Detailed reason why it failed, if passed is false" }
                },
                required: ["name", "passed"]
              }
            }
          },
          required: ["status", "confidence", "testCount", "edgeCases", "coveragePercent", "testCode", "hasUpdatedCode", "explanation", "testDetails"]
        }
      }
    });

    let text = response.text || '{}';
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
    }

    return res.json(JSON.parse(text));
  } catch (error) {
    console.error('Error generating tests:', error);
    return res.status(500).json({ error: 'Internal server error while generating tests.' });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
