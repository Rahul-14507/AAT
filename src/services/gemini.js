export const callGemini = async (
  apiKey,
  subject,
  problem,
  generateSlides,
  generateReport,
) => {
  if (!apiKey || !subject || !problem) {
    throw new Error("Missing required fields");
  }

  let taskDescription = "";
  let jsonStructure = "";

  if (generateSlides) {
    taskDescription += `
    2. **Slides:** Generate exactly 20 slides. For each slide, provide:
       - "title": A professional slide title.
       - "content": An array of 3-4 detailed and elaborate bullet points explaining the concepts in depth.
       - "speakerNotes": "" (Leave empty as per user request).`;
    jsonStructure += `
        "slides": [
            { "title": "...", "content": ["..."], "speakerNotes": "" },
            ... (20 items)
        ],`;
  }

  if (generateReport) {
    taskDescription += `
    3. **Report:** Generate a structured HTML string (using <h2>, <h3>, <p>, <ul>, <li> tags) for the written report. Include sections: Abstract, Introduction, Methodology/Design, Analysis/Discussion, Conclusion, and References.`;
    jsonStructure += `
        "report": "HTML string here...",`;
  }

  const prompt = `
    You are an expert academic assistant helping a university student with an "Alternative Assessment Tool" (AAT) assignment.
    
    **Task:**
    Generate content based on the following input:
    
    **Subject:** ${subject}
    **Problem Statement:** ${problem}
    
    **Constraints & Requirements:**
    1. **Output Format:** STRICT JSON only. No markdown formatting around the JSON.
    ${taskDescription}
    4. **Formulas:** Do NOT use LaTeX. Use plain text for formulas (e.g., "A = pi * r^2"). Ensure they are clear and readable.
    5. **Tone:** Academic, technical, and formal.
    
    **JSON Structure:**
    {
        ${jsonStructure}
    }
  `;

  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-pro-latest",
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        const errorMessage = errData.error?.message || "API Error";

        // If the model is not found/supported, try the next one
        if (response.status === 404 && errorMessage.includes("not found")) {
          lastError = new Error(errorMessage);
          console.warn(`Model ${model} failed, trying next...`);
          continue;
        }

        // For other errors (like auth), throw immediately
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;

      let parsedData;
      try {
        parsedData = JSON.parse(textResponse);
      } catch (e) {
        const cleaned = textResponse
          .replace(/```json/g, "")
          .replace(/```/g, "");
        parsedData = JSON.parse(cleaned);
      }

      return parsedData;
    } catch (err) {
      lastError = err;
      // If it's not a model not found error, don't keep trying
      if (!err.message.includes("not found")) {
        throw err;
      }
    }
  }

  // If we exhausted all models
  console.error(
    "Gemini API Error: exhausted all models. Last error:",
    lastError,
  );
  throw lastError;
};
