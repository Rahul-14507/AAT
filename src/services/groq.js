export const callGroq = async (
  apiKey,
  subject,
  problem,
  generateSlides,
  generateReport,
  slideCount,
) => {
  if (!apiKey || !subject || !problem) {
    throw new Error("Missing required fields");
  }

  // Subtract 3 special slides (Title, Topic, Thank You) to get exact total slide count in final presentation
  const contentSlideCount = Math.max(1, slideCount - 3);

  let taskDescription = "";
  let jsonStructure = "";

  if (generateSlides) {
    taskDescription += `
    2. **Slides:** Generate EXACTLY ${contentSlideCount} comprehensive, academically rich content slides covering the topic.
       For each slide, provide:
       - "title": A clear, professional, academic slide title.
       - "content": An array of exactly 4 substantive, in-depth bullet points.
         * Each bullet point MUST be 2 well-formed, informative sentences (approx 30-40 words total) explaining underlying principles, architectures, workflows, design trade-offs, or analysis in depth.
         * Start each point with a bold-style topic identifier (e.g., "Architectural Context: ...", "Operational Mechanism: ...", "Performance Analysis: ...", "Design Consideration: ...").
         * Provide thorough, high-scoring academic explanations with clear technical detail.
       - "speakerNotes": "" (Leave empty).`;
    jsonStructure += `
        "slides": [
            { "title": "...", "content": ["Topic Heading: Substantive 2-sentence academic explanation covering mechanisms, architecture, and practical implications...", "..."], "speakerNotes": "" },
            ... (EXACTLY ${contentSlideCount} items)
        ],`;
  }

  if (generateReport) {
    taskDescription += `
    3. **Report:** Generate an exhaustive, structured HTML string (using <h2>, <h3>, <p>, <ul>, <li> tags) for the written report. Include sections: Abstract, Introduction, Methodology/Design, Analysis/Discussion, Conclusion, and References.`;
    jsonStructure += `
        "report": "HTML string here...",`;
  }

  const prompt = `
    You are an expert academic assistant helping a university student with an "Alternative Assessment Tool" (AAT) assignment.
    
    **Task:**
    Generate high-depth academic content based on the following input:
    
    **Subject:** ${subject}
    **Problem Statement:** ${problem}
    
    **Constraints & Requirements:**
    1. **Output Format:** Return valid, parseable JSON matching the structure below.
    ${taskDescription}
    4. **Formatting:** Do NOT use markdown (like **bold** or *italics*) inside the JSON strings. Do NOT use asterisks (*) for emphasis or bullet points. Provide clean text only.
    5. **Slide Depth & Quality:** Provide comprehensive technical depth (4 substantive, 2-sentence bullet points per slide) with clear academic value and insight.
    6. **Formulas:** Do NOT use LaTeX. Use plain text for formulas (e.g., "A = pi * r^2"). Ensure they are clear and readable.
    7. **Tone:** Academic, technical, formal, and authoritative.
    
    **JSON Structure:**
    {
        ${jsonStructure}
    }
  `;

  const isModelRetryableError = (status, errorMessage = "") => {
    const msg = (errorMessage || "").toLowerCase();

    // Invalid API key or permission errors should fail immediately
    if (
      status === 401 ||
      msg.includes("invalid api key") ||
      msg.includes("invalid_api_key") ||
      msg.includes("unauthorized")
    ) {
      return false;
    }

    // Rate limits (429), model unavailable/not found (404/400), or server busy (500/502/503/504)
    if (
      status === 429 ||
      status === 404 ||
      status === 400 ||
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504
    ) {
      return true;
    }

    return (
      msg.includes("rate limit") ||
      msg.includes("tokens per minute") ||
      msg.includes("requests per minute") ||
      msg.includes("not found") ||
      msg.includes("does not exist") ||
      msg.includes("do not have access") ||
      msg.includes("decommissioned") ||
      msg.includes("no longer supported") ||
      msg.includes("deprecated") ||
      msg.includes("overloaded") ||
      msg.includes("capacity") ||
      msg.includes("unavailable")
    );
  };

  // Discover live available models for the user's API key
  let modelsToTry = [
    "llama-3.3-70b-versatile",
    "llama-3.2-3b-preview",
    "llama-3.2-1b-preview",
    "llama-3.2-11b-vision-preview",
    "deepseek-r1-distill-llama-70b",
    "qwen-2.5-32b",
  ];

  try {
    const modelsRes = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
      },
    });

    if (modelsRes.ok) {
      const modelsData = await modelsRes.json();
      if (Array.isArray(modelsData?.data)) {
        const liveChatModels = modelsData.data
          .map((m) => m.id)
          .filter(
            (id) =>
              id &&
              !id.includes("whisper") &&
              !id.includes("guard") &&
              !id.includes("embed") &&
              !id.includes("tts"),
          );

        const priorityOrder = [
          "llama-3.3-70b-versatile",
          "llama-3.3-70b-specdec",
          "llama-3.2-3b-preview",
          "llama-3.2-1b-preview",
          "llama-3.2-11b-vision-preview",
          "deepseek-r1-distill-llama-70b",
          "qwen-2.5-32b",
          "llama-3.1-8b-instant",
        ];

        const sorted = [
          ...priorityOrder.filter((id) => liveChatModels.includes(id)),
          ...liveChatModels.filter((id) => !priorityOrder.includes(id)),
        ];

        if (sorted.length > 0) {
          modelsToTry = sorted;
        }
      }
    }
  } catch (e) {
    console.warn("Could not query live Groq models endpoint, falling back to default list", e);
  }

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "system",
                content:
                  "You are an academic assignment assistant. You must always return pure JSON matching the requested schema.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
            max_tokens: 8000,
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errorMessage =
          errData.error?.message || `Groq API Error (Status ${response.status})`;

        if (isModelRetryableError(response.status, errorMessage)) {
          lastError = new Error(errorMessage);
          console.warn(
            `Groq Model ${model} encountered an issue (${errorMessage}). Falling back to next model...`,
          );
          continue;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      const textResponse = data.choices?.[0]?.message?.content;

      if (!textResponse) {
        throw new Error("No response content received from Groq API");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(textResponse);
      } catch (e) {
        const cleaned = textResponse
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        parsedData = JSON.parse(cleaned);
      }

      return parsedData;
    } catch (err) {
      lastError = err;
      if (isModelRetryableError(null, err.message)) {
        console.warn(
          `Groq Model ${model} failed with: ${err.message}. Trying next model...`,
        );
        continue;
      }
      throw err;
    }
  }

  console.error("Groq API Error: exhausted all fallback models. Last error:", lastError);
  throw lastError;
};
