const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  // IMPORTANT: не читаем body для GET/других методов
  if (req.method !== "POST") {
    return json({ error: `Method ${req.method} not allowed` }, 405);
  }

  try {
    const apiKey = Deno.env.get("GROQ_API_KEY");
    if (!apiKey) {
      return json(
        { error: "Ключ GROQ_API_KEY не найден в Secrets" },
        500
      );
    }

    // body
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return json({ error: "Ожидался application/json body" }, 400);
    }

    const { action, text, messages } = await req.json();

    // 1) process_document
    if (action === "process_document") {
      const prompt = `Ты — AI-помощник для студентов с инклюзивностью.
Упрости этот текст, сделай конспект и квиз. Ответь строго в формате JSON на русском языке.

Текст:
${text}

Формат:
{
  "summary": "краткое описание",
  "simplified": "объяснение простыми словами",
  "keyPoints": ["пункт 1", "пункт 2"],
  "quiz": [{"question": "вопрос", "answer": "ответ"}]
}`;

      const resp = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            temperature: 0.2,
            response_format: { type: "json_object" },
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const data = await resp.json();
      if (!resp.ok) {
        return json(
          { error: data?.error?.message ?? "Groq request failed" },
          500
        );
      }

      return new Response(data?.choices?.[0]?.message?.content ?? "", {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // 2) chat
    if (action === "chat") {
      const resp = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            temperature: 0.7,
            messages: [
              {
                role: "system",
                content:
                  "Ты помощник платформы AccessMind. Отвечай кратко и на русском.",
              },
              ...(messages || []),
            ],
          }),
        }
      );

      const data = await resp.json();
      if (!resp.ok) {
        return json(
          { error: data?.error?.message ?? "Groq request failed" },
          500
        );
      }

      const reply = data?.choices?.[0]?.message?.content ?? "";
      return json({ reply });
    }

    return json({ error: "Action not found" }, 400);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return json({ error: message }, 500);
  }
});
