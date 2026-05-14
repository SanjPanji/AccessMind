import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Groq from "npm:groq-sdk";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const groq = new Groq({
      apiKey: Deno.env.get('GROQ_API_KEY'),
    });

    const { action, text, messages } = await req.json();

    if (action === 'process_document') {
      const prompt = `You are an AI Learning Assistant. The student has uploaded a document with the following text:
"${text}"

Please analyze it and return a JSON object with EXACTLY this structure (in Russian language):
{
  "summary": "Краткий конспект документа (2-3 предложения)",
  "simplified": "Объяснение главных концепций 'простыми словами'",
  "keyPoints": ["пункт 1", "пункт 2", "пункт 3", "пункт 4"],
  "quiz": [
    { "question": "Вопрос 1", "answer": "Ответ 1" },
    { "question": "Вопрос 2", "answer": "Ответ 2" }
  ]
}`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-70b-8192',
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const content = chatCompletion.choices[0]?.message?.content;
      return new Response(content, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'chat') {
      const systemPrompt = `You are AccessMind's AI Assistant. You help students search materials, explain assignments, navigate the platform, and remind them of deadlines. Answer in Russian. Keep responses concise and helpful.`;
      
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        model: 'llama3-70b-8192',
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content;
      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      return new Response(JSON.stringify({ error: 'Unknown action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
