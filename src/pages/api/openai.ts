import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

// Types
interface ResponseData {
  result?: any[];
  error?: {
    message: string;
  };
}

type OpenAIError = {
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
export default async function generate(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
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

    res.status(200).json({ result: completion.data.choices });
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
