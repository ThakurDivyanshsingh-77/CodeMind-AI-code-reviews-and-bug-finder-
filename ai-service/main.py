import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load local environment configuration (override system environment variables)
load_dotenv(override=True)

from analyzer import analyze_codebase, chat_with_ai, rag_chat

app = FastAPI(title="CodeMind AI Review Service")

class AnalysisRequest(BaseModel):
    projectPath: str

class ChatRequest(BaseModel):
    reviewContext: dict
    chatHistory: list
    question: str

class RagChatRequest(BaseModel):
    projectPath: str
    question: str
    chatHistory: list = []

@app.post("/analyze")
async def start_analysis(request: AnalysisRequest):
    if not os.path.exists(request.projectPath):
        raise HTTPException(status_code=404, detail="Target project directory path not found")
        
    try:
        report = analyze_codebase(request.projectPath)
        return {"success": True, "report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_interaction(request: ChatRequest):
    try:
        reply = chat_with_ai(request.reviewContext, request.chatHistory, request.question)
        return {"success": True, "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rag-chat")
async def rag_chat_interaction(request: RagChatRequest):
    if not os.path.exists(request.projectPath):
        raise HTTPException(status_code=404, detail="Project directory not found on server")
    try:
        result = rag_chat(request.projectPath, request.question, request.chatHistory)
        return {"success": True, "reply": result["reply"], "sources": result["sources"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
