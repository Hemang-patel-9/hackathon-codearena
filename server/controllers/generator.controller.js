require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const validateBasicFormat = (questionObj) => {
  if (
    !questionObj ||
    typeof questionObj !== 'object' ||
    typeof questionObj.questionText !== 'string' ||
    !questionObj.questionText.trim()
  ) return false;

  if (
    questionObj.options &&
    (!Array.isArray(questionObj.options) || questionObj.options.length !== 4)
  ) return false;

  if (
    questionObj.options &&
    !questionObj.options.some(opt => opt && typeof opt === 'object' && opt.isCorrect === true)
  ) return false;

  return true;
};

exports.generateQuizQuestions = async (req, res) => {
  const { questions: numQuestions, topic } = req.body;

  if (!numQuestions || typeof numQuestions !== 'number' || numQuestions <= 0) {
    return res.status(400).json({ success: false, message: 'Number of questions must be a positive number.' });
  }

  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    return res.status(400).json({ success: false, message: 'Topic is required and must be a non-empty string.' });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }); // Gemini 2.0

  const prompt = `
You are a question generator. Your task is to return ONLY a valid JSON object based on the topic below.

Topic: "${topic}"
Number of Questions: ${numQuestions}

Rules:
1. If the topic is inappropriate (e.g., related to violence, nudity, abuse, hate, unfair or unethical content), respond with:
{
  "error": "Inappropriate topic",
  "message": "Question generation failed due to unsafe topic.",
  "data": null
}
2. Else, generate exactly ${numQuestions} questions about the topic.
3. Each question must have:
   - "questionText": string
   - "questionType": one of ["multiple-choice", "true-false", "open-ended", "multiple-select"]
   - "options": 
     - If questionType is "open-ended": options must be null
     - Else: options must be an array of 4 options with:
        {
          "text": string,
          "isCorrect": true | false
        }

Return a **valid JSON object only** in the following format:

{
  "error": null,
  "message": "Data generation success",
  "data": [
    {
      "questionText": "string",
      "questionType": "multiple-choice" | "true-false" | "open-ended" | "multiple-select",
      "options": [
        {
          "text": "Option 1",
          "isCorrect": true | false
        },
        ...
      ] or null for open-ended
    },
    ...
  ]
}

Do not include any explanation, formatting, or markdown — only the JSON.
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (err) {
      console.error("Failed to parse Gemini response:", err.message);
      return res.status(500).json({
        success: false,
        message: "Invalid JSON format received from Gemini.",
        data: null
    });
    }

    if (parsed.error) {
      return res.status(400).json({
        success: false,
        message: parsed.error,
        data: []
      });
    }

    const validQuestions = (parsed.data || []).filter(validateBasicFormat).map(q => ({
      question: q.questionText,
      options: q.options?.map(opt => opt.text),
      correctOption: q.options?.find(opt => opt.isCorrect)?.text || null
    }));

    if (validQuestions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No valid questions were generated.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully generated ${validQuestions.length} questions.`,
      data: validQuestions
    });

  } catch (error) {
    console.error("Unhandled error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};