import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load local environment configuration (override system environment variables)
load_dotenv(override=True)

from analyzer import analyze_codebase, chat_with_ai, rag_chat

app = FastAPI(title="CodeMind AI Review Service")

from typing import Optional, List

class FilePayload(BaseModel):
    path: str
    content: str

class AnalysisRequest(BaseModel):
    projectPath: Optional[str] = None
    files: Optional[List[FilePayload]] = None

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
    files_dict = None
    if request.files is not None and len(request.files) > 0:
        files_dict = {f.path: f.content for f in request.files}
        
    if not files_dict:
        if not request.projectPath:
            raise HTTPException(status_code=400, detail="Either projectPath or files must be provided")
        if not os.path.exists(request.projectPath):
            raise HTTPException(status_code=404, detail="Target project directory path not found")
        
    try:
        report = analyze_codebase(project_path=request.projectPath, files_content=files_dict)
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
