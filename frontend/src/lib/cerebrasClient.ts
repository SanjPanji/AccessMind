export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function streamCerebrasChat(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  signal?: AbortSignal
) {
  const apiKey = import.meta.env.VITE_CEREBRAS_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_CEREBRAS_API_KEY is not set in environment variables");
  }

  const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "zai-glm-4.7", // As requested by user
      messages,
      stream: true,
      max_completion_tokens: 8000,
      temperature: 1,
      top_p: 0.95,
    }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cerebras API error: ${response.status} ${errorText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) return;

  try {
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim() === "") continue;
        if (line.trim() === "data: [DONE]") return;
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error("Error parsing stream chunk", e, line);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function fetchCerebrasChat(
  messages: ChatMessage[],
  signal?: AbortSignal
): Promise<string> {
  let fullText = "";
  await streamCerebrasChat(messages, (chunk) => {
    fullText += chunk;
  }, signal);
  return fullText;
}

export async function fetchCerebrasJSON(
  messages: ChatMessage[],
  signal?: AbortSignal
): Promise<any> {
  const apiKey = import.meta.env.VITE_CEREBRAS_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_CEREBRAS_API_KEY is not set in environment variables");
  }

  const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama3.1-8b",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.2, // Low temperature for more deterministic JSON
    }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cerebras API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse JSON response:", content);
    throw new Error("Invalid JSON response from AI");
  }
}
