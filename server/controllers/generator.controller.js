// controllers/quizGenerationController.js
const fetch = require('node-fetch'); // Use 'node-fetch' for older Node.js versions, or native 'fetch' if Node 18+

// Helper function to validate a single question's format
const validateQuestionFormat = (questionObj) => {
    // Check if questionObj is an object
    if (typeof questionObj !== 'object' || questionObj === null) {
        return { isValid: false, message: 'Question is not an object.' };
    }

    const { question, options, correctOption } = questionObj;

    // 1. Validate 'question' field
    if (typeof question !== 'string' || question.trim() === '') {
        return { isValid: false, message: 'Question text is missing or not a string.' };
    }

    // 2. Validate 'options' field
    if (!Array.isArray(options) || options.length !== 4) {
        return { isValid: false, message: 'Options must be an array with exactly 4 elements.' };
    }
    for (const opt of options) {
        if (typeof opt !== 'string' || opt.trim() === '') {
            return { isValid: false, message: 'All options must be non-empty strings.' };
        }
    }

    // 3. Validate 'correctOption' field
    if (typeof correctOption !== 'string' || correctOption.trim() === '') {
        return { isValid: false, message: 'Correct option is missing or not a string.' };
    }

    // 4. Ensure 'correctOption' is one of the 'options'
    if (!options.includes(correctOption)) {
        return { isValid: false, message: 'Correct option must be one of the provided options.' };
    }

    return { isValid: true };
};


// @desc    Generate quiz questions using Gemini API
// @route   POST /api/generate-quiz
// @access  Public (or Private, depending on your needs)
exports.generateQuizQuestions = async (req, res) => {
    const { questions: numQuestions, topic } = req.body;

    if (numQuestions === undefined || typeof numQuestions !== 'number' || numQuestions <= 0) {
        return res.status(400).json({ success: false, message: 'Number of questions (questions) must be a positive number.' });
    }
    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
        return res.status(400).json({ success: false, message: 'Topic is required and must be a non-empty string.' });
    }

    const generatedQuestions = [];
    let attempts = 0;
    const MAX_ATTEMPTS_PER_QUESTION = 5; // Max retries for a single question generation

    try {
        while (generatedQuestions.length < numQuestions && attempts < (numQuestions * MAX_ATTEMPTS_PER_QUESTION)) {
            const prompt = `Generate exactly 1 multiple-choice question about "${topic}".
            The question should have 4 distinct options, and one of them must be the correct answer.
            Provide the output as a JSON object in the following format:
            {
              "question": "Your question text here?",
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
              "correctOption": "The correct option text"
            }
            Ensure the "correctOption" exactly matches one of the "options" provided.
            Do not include any other text or formatting outside of the JSON object.`;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = {
                contents: chatHistory,
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            "question": { "type": "STRING" },
                            "options": {
                                "type": "ARRAY",
                                "items": { "type": "STRING" },
                                "minItems": 4,
                                "maxItems": 4
                            },
                            "correctOption": { "type": "STRING" }
                        },
                        "required": ["question", "options", "correctOption"]
                    }
                }
            };

            const apiKey = "AIzaSyDOaiWQwpvJo5OQ01zoWTYK1cLpU-TVNh8"; // If you want to use models other than gemini-2.0-flash, provide an API key here. Otherwise, leave this as-is.
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            let response;
            try {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (fetchError) {
                console.error(`Fetch error during Gemini API call (attempt ${attempts + 1}):`, fetchError);
                attempts++;
                continue; // Try again
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Gemini API error (status ${response.status}, attempt ${attempts + 1}):`, errorText);
                attempts++;
                continue; // Try again
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {

                const rawJsonText = result.candidates[0].content.parts[0].text;
                let questionObj;
                try {
                    questionObj = JSON.parse(rawJsonText);
                } catch (parseError) {
                    console.error(`Failed to parse Gemini response as JSON (attempt ${attempts + 1}):`, rawJsonText, parseError);
                    attempts++;
                    continue; // Try again
                }

                const validationResult = validateQuestionFormat(questionObj);
                if (validationResult.isValid) {
                    generatedQuestions.push(questionObj);
                    attempts = 0; // Reset attempts for the next question
                } else {
                    console.warn(`Generated question failed validation (attempt ${attempts + 1}):`, validationResult.message, questionObj);
                    attempts++;
                }
            } else {
                console.warn(`Gemini API returned no content or unexpected structure (attempt ${attempts + 1}):`, JSON.stringify(result, null, 2));
                attempts++;
            }
        }

        if (generatedQuestions.length === 0 && numQuestions > 0) {
             return res.status(500).json({
                success: false,
                message: `Failed to generate any valid questions after multiple attempts for topic "${topic}". Please try again or refine your topic.`
            });
        }

        if (generatedQuestions.length < numQuestions) {
            return res.status(206).json({ // 206 Partial Content
                success: true,
                message: `Successfully generated ${generatedQuestions.length} out of ${numQuestions} questions for topic "${topic}". Some questions could not be generated or validated after retries.`,
                data: generatedQuestions
            });
        }

        res.status(200).json({
            success: true,
            message: `Successfully generated ${generatedQuestions.length} questions for topic "${topic}".`,
            data: generatedQuestions
        });

    } catch (error) {
        console.error('Unhandled error in generateQuizQuestions:', error);
        res.status(500).json({ success: false, message: 'Server Error during question generation.', error: error.message });
    }
};