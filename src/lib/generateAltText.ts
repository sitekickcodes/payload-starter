import OpenAI from "openai";

export async function generateAltText(
  imageSource: string | { base64: string; mimeType: string }
): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const imageUrl =
    typeof imageSource === "string"
      ? imageSource
      : `data:${imageSource.mimeType};base64,${imageSource.base64}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Write a concise alt text description for this image in one sentence. Do not start with 'Image of' or 'Photo of'. Just describe what is shown.",
            },
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "low" },
            },
          ],
        },
      ],
    });

    return response.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.warn("[generateAltText] Failed to generate alt text:", error);
    return null;
  }
}
