require("dotenv").config();
const axios = require("axios");

const validateBasicFormat = (questionObj) => {
  if (
    !questionObj ||
    typeof questionObj !== 'object' ||
    typeof questionObj.questionText !== 'string' ||
    !questionObj.questionText.trim()
  ) return false;

  if (
    questionObj.questionType !== "open-ended" &&
    (!Array.isArray(questionObj.options) || questionObj.options.length < 2)
  ) return false;

  if (
    questionObj.options &&
    !questionObj.options.some(opt => opt && typeof opt === 'object' && opt.isCorrect === true)
  ) return false;

  return true;
};

exports.generateQuizQuestions = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: true,
        message: 'Topic is required in request body.',
        data: null,
      });
    }

    const prompt = `Generate 5 multiple choice questions in JSON format as a string for the topic "${topic}". The output should be in the following format (return it as a string, not an object):

[
  {
    "question": "What is ...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option B"
  },
  ...
]`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistral/mistral-7b-instruct', // You can change this to another like "anthropic/claude-3-haiku" or "meta-llama/llama-3-8b-instruct"
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost', // Optional but may be required based on usage
        },
      }
    );

    const rawText = response.data.choices[0]?.message?.content;

    return res.json({
      error: false,
      message: 'MCQs generated successfully',
      data: rawText, // This will be a stringified JSON, you can JSON.parse on frontend
    });
  } catch (error) {
    console.error('OpenRouter Error:', error.response?.data || error.message);
    return res.status(500).json({
      error: true,
      message: 'Failed to generate MCQs using OpenRouter.',
      data: null,
    });
  }
};