from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CEREBRAS_API_KEY = "csk-3wcxevy5nn23rjcxv8jxwtj2k9xk5pxjrvfpdk6r9ymn88kw"

class AIRequest(BaseModel):
    action: str
    text: str | None = None
    messages: list | None = None

@app.post("/api/ai-assistant")
async def ai_assistant(request: AIRequest):
    if request.action == "process_document":
        prompt = f"""Ты — AI-помощник для студентов с инклюзивностью.
Упрости этот текст, сделай конспект и квиз. Ответь строго в формате JSON на русском языке.

Текст:
{request.text}

Формат:
{{
  "summary": "краткое описание",
  "simplified": "объяснение простыми словами",
  "keyPoints": ["пункт 1", "пункт 2"],
  "quiz": [{{"question": "вопрос", "answer": "ответ"}}]
}}"""

        resp = requests.post(
            "https://api.cerebras.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {CEREBRAS_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama3.1-8b",
                "temperature": 0.2,
                "response_format": { "type": "json_object" },
                "messages": [{"role": "user", "content": prompt}],
            }
        )

        if not resp.ok:
            error_detail = resp.text
            try:
                error_detail = resp.json().get("error", {}).get("message", resp.text)
            except:
                pass
            raise HTTPException(status_code=500, detail=f"Cerebras API error: {error_detail}")
        
        data = resp.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
        return json.loads(content)

    elif request.action == "chat":
        messages = [
            {
                "role": "system",
                "content": "Ты помощник платформы AccessMind. Отвечай кратко и на русском.",
            }
        ]
        if request.messages:
            messages.extend(request.messages)

        resp = requests.post(
            "https://api.cerebras.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {CEREBRAS_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama3.1-8b",
                "temperature": 0.7,
                "messages": messages,
            }
        )

        if not resp.ok:
            error_detail = resp.text
            try:
                error_detail = resp.json().get("error", {}).get("message", resp.text)
            except:
                pass
            raise HTTPException(status_code=500, detail=f"Cerebras API error: {error_detail}")

        data = resp.json()
        reply = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        return {"reply": reply}

    raise HTTPException(status_code=400, detail="Action not found")

@app.get("/")
def read_root():
    return {"message": "AccessMind Backend is running on Cerebras"}
