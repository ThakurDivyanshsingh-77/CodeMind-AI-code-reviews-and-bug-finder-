"""
groq_provider.py — Groq LLM fallback for all CodeMind AI operations.
Used automatically when Gemini hits rate limits (429), or when
AI_PROVIDER=groq is explicitly set.

Groq supports: llama-3.3-70b-versatile, llama3-8b-8192, mixtral-8x7b-32768
Note: Groq does NOT have embedding models. RAG uses Gemini embeddings
      but Groq for the final generation step.
"""

import os
from groq import Groq

GROQ_MODEL_DEFAULT = "llama-3.3-70b-versatile"


def _get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured in .env")
    return Groq(api_key=api_key)


def _get_model():
    return os.getenv("GROQ_MODEL", GROQ_MODEL_DEFAULT)


def analyze_with_groq(files_payload: str) -> list:
    """
    Analyze a batch of code files using Groq and return a list of issues.
    Mirrors the Gemini analysis output format.
    """
    from prompts import GROK_DEEP_SCAN_PROMPT, build_user_prompt

    client = _get_client()
    prompt = build_user_prompt(files_payload)

    response = client.chat.completions.create(
        model=_get_model(),
        messages=[
            {"role": "system", "content": GROK_DEEP_SCAN_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,
        max_tokens=8192,
        response_format={"type": "json_object"}
    )

    import json
    raw = response.choices[0].message.content.strip()

    # Groq with json_object mode returns a JSON object; we need an array
    # If it wraps in {"issues": [...]}, extract it
    parsed = json.loads(raw)
    if isinstance(parsed, list):
        return parsed
    # Common wrapper patterns
    for key in ("issues", "results", "findings", "data", "analysis"):
        if key in parsed and isinstance(parsed[key], list):
            return parsed[key]
    # Last resort: return empty
    return []


def chat_with_groq(review_context: dict, chat_history: list, question: str) -> str:
    """
    Answer a question about a code review report using Groq.
    Mirrors chat_with_ai() in analyzer.py.
    """
    import json

    client = _get_client()

    system_msg = (
        "You are CodeMind AI, a helpful code assistant. The user is asking questions about a code review "
        "you performed earlier. Here is the review details of their project:\n"
        f"{json.dumps(review_context, indent=2)}\n\n"
        "Answer concisely, providing direct refactoring or debugging tips."
    )

    messages = [{"role": "system", "content": system_msg}]
    for turn in chat_history:
        messages.append({"role": "user", "content": turn["question"]})
        messages.append({"role": "assistant", "content": turn["answer"]})
    messages.append({"role": "user", "content": question})

    response = client.chat.completions.create(
        model=_get_model(),
        messages=messages,
        temperature=0.3,
        max_tokens=2048
    )
    return response.choices[0].message.content


def rag_generate_with_groq(context_block: str, chat_history: list, question: str) -> str:
    """
    Generate a RAG-grounded answer using Groq (embeddings still done via Gemini).
    """
    client = _get_client()

    system_msg = (
        "You are CodeMind AI, an expert code assistant. A developer has uploaded a codebase "
        "and you have been given the most relevant code snippets as context.\n\n"
        "RULES:\n"
        "- Answer based ONLY on the provided code snippets. Do not hallucinate.\n"
        "- Always cite specific file paths and line numbers when referencing code.\n"
        "- If the answer cannot be determined from the snippets, say so honestly.\n"
        "- Be concise, precise, and developer-friendly.\n\n"
        f"RETRIEVED CODE CONTEXT:\n{context_block}"
    )

    messages = [{"role": "system", "content": system_msg}]
    for turn in chat_history:
        messages.append({"role": "user", "content": turn["question"]})
        messages.append({"role": "assistant", "content": turn["answer"]})
    messages.append({"role": "user", "content": question})

    response = client.chat.completions.create(
        model=_get_model(),
        messages=messages,
        temperature=0.3,
        max_tokens=2048
    )
    return response.choices[0].message.content
