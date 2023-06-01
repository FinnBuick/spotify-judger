import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, CreateChatCompletionResponseChoicesInner, OpenAIApi } from 'openai';

// Types
export interface OpenAIResponse {
  result?: {
    message: string;
  };
  error?: {
    message: string;
  };
}

export type OpenAIError = {
  response?: {
    status: number;
    data: any;
  };
  message?: string;
};

// OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// API route
export default async function generate(req: NextApiRequest, res: NextApiResponse<OpenAIResponse>) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const messages = req.body.messages;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const message = completion.data.choices[0].message?.content;
    if (!message) {
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
      return;
    }

    res.status(200).json({ result: { message } });
  } catch (err) {
    const error = err as OpenAIError;
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}
