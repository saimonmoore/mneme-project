import * as https from 'https';
import * as process from 'process';

const SYSTEM_PROMPT = (n = 3) =>
  `Extract top ${n} most relevant keywords from text. Return as a JSON array format.`;
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

export type KeywordExtractionResponse = {
  keywords: string[];
};

export type OpenAIAPIResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

export async function extractKeywords(text = '', numKeywords = 3) {
  const openAIResponse = await callOpenAiAPI(text, numKeywords);
  const completion = openAIResponse.choices[0].message.content;
  const parsedData = JSON.parse(completion);

  return parsedData.keywords;
}

/**
 * Wrapper function for OpenAI API chat completions with a fixed system prompt
 * @param userContent - User's input content
 * @param model - OpenAI model to use
 * @param options - Additional options for the API call
 * @returns Promise resolving to the API response
 * @throws Error if the API call fails
 */
async function callOpenAiAPI(
  text = '',
  numKeywords = 3,
  model = 'gpt-4o-mini',
  options = {},
): Promise<OpenAIAPIResponse> {
  if (!text) {
    throw new Error('text is required');
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT(numKeywords) },
    { role: 'user', content: text },
  ];

  const requestBody = {
    model,
    messages,
    response_format: { type: 'json_object' },
    ...options,
  };

  const requestOptions = {
    method: 'POST',
    host: 'api.openai.com',
    port: 443,
    path: '/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      'Content-Length': Buffer.byteLength(JSON.stringify(requestBody)),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(
            new Error(
              `API request failed with status ${res.statusCode}: ${data}`,
            ),
          );
        } else {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (error) {
            reject(new Error(`Failed to parse API response: ${error}`));
          }
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(JSON.stringify(requestBody));
    req.end();
  });
}
