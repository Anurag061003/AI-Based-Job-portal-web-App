import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

export const getResumeScore = async (resumeText, jobRequirements) => {
  try {

    const prompt = `
Compare this resume with job requirements.

Resume:
${resumeText}

Job Requirements:
${jobRequirements}

Return response in JSON format:

{
 "score": number,
 "reason": "short explanation"
}
`;

    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    let text = completion.choices[0].message.content;

    text = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(text);

    return parsed.score;

  } catch (error) {
    console.log("AI scoring error:", error);
    return 0;
  }
};