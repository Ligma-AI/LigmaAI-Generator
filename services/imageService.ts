const API_KEY = 'key-3gwhz4Ztn5SVR6eJAA0a1WjNmWIuy4CduEfbseBqlR5EEomSQtoPCXXmGCCBFNJPUuyULMIZJ0V00fca68e424UqK2NdBSZB';

export interface GenerateImageResponse {
  cost: number;
  seed: number;
  url: string;
}

export const generateImage = async (prompt: string): Promise<GenerateImageResponse> => {
  const url = 'https://api.getimg.ai/v1/flux-schnell/text-to-image';
  
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      prompt,
      response_format: 'url'
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};