import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: buffer.toString("base64"),
              },
            },
            {
              text: `
Extract tournament game information from this document.

❗ DO NOT extract or return referee names.
❗ Ignore any referee list inside the document.

Return ONLY JSON in the following format:

{
  "games": [
    {
      "field_number": "",
      "home_team": "",
      "away_team": "",
      "time_slot": ""
    }
  ]
}

Rules:
- If field numbers are not in the document, set "field_number": null.
- If the time slot is missing, return null.
- Combine NOTHING; keep home/away separate for now (we will merge later in the table).
- Return only JSON.
`,
            },
          ],
        },
      ],
    });

    return Response.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error(error);
    return new Response("Error extracting data", { status: 500 });
  }
}