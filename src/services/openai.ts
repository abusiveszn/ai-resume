import OpenAI from "openai";

// Initialize OpenAI client
// We use dangerouslyAllowBrowser because we are calling it from the frontend.
// Users must supply their own API key in their .env.local file.
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

export interface EnhanceResumeParams {
  role: string;
  description: string;
  skills: string;
  jobDescription: string;
}

export async function enhanceResume(data: EnhanceResumeParams): Promise<string> {
  const jobDescContext = data.jobDescription.trim() 
    ? `- Job Description: ${data.jobDescription}` 
    : `- Job Description: None provided.`;
    
  const alignInstruction = data.jobDescription.trim() 
    ? `4. Align content with the job description` 
    : `4. Create highly professional, industry-standard bullet points since no specific job description is provided. Do NOT mention that a job description is missing.`;

  const prompt = `
  You are a professional resume writer and ATS optimization expert.

  Your task is to transform raw user input into a highly professional, ATS-optimized resume section.

  INPUT:
  - Role: ${data.role}
  - User Description: ${data.description}
  - Skills: ${data.skills}
  ${jobDescContext}

  INSTRUCTIONS:
  1. Expand the user's description into strong, professional bullet points
  2. Use action verbs (Developed, Led, Optimized, Built, etc.)
  3. Add measurable impact where possible
  ${alignInstruction}
  5. Include relevant keywords for ATS optimization
  6. Make the content concise but powerful

  OUTPUT FORMAT (Use standard markdown):
  ### Professional Summary
  [Detailed paragraph]

  ### Key Skills
  - [Skill 1]
  - [Skill 2]

  ### Experience
  - **[Action Verb]** [Responsibility/Achievement with measurable impact]
  - **[Action Verb]** [Responsibility/Achievement with measurable impact]

  ### Suggested Improvements
  [List of specific suggestions to further improve the resume]
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Configured cost-friendly model with great performance
      messages: [
        { role: "system", content: "You are an elite professional resume optimizer and ATS expert." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "We couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("Error in OpenAI generation:", error);
    if (error.message.includes("401")) {
        throw new Error("Invalid or missing OpenAI API Key. Please configure VITE_OPENAI_API_KEY in your .env.local file.");
    }
    throw new Error(error.message || "Failed to enhance resume. Please try again later.");
  }
}
