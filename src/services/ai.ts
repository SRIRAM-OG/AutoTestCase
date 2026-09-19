export interface TestDetail {
  name: string;
  passed: boolean;
  errorReason?: string;
}

export interface TestResult {
  status: string;
  confidence: number;
  testCount: number;
  edgeCases: number;
  coveragePercent: number;
  testCode: string;
  updatedCode: string;
  hasUpdatedCode: boolean;
  explanation: string;
  whatChanged: string;
  testDetails: TestDetail[];
}

export async function generateTests(params: { mode: string, language: string, framework: string, input: string }): Promise<TestResult> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate tests. Status: ${response.status}`);
  }

  return response.json();
}
