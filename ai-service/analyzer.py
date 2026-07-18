import os
import numpy as np
import google.generativeai as genai
import json
import time
from prompts import SYSTEM_PROMPT, build_user_prompt

def _get_ai_provider():
    """Return the configured AI provider: 'gemini', 'groq', or 'auto'."""
    return os.getenv("AI_PROVIDER", "auto").lower()

def _is_rate_limit_error(e: Exception) -> bool:
    """Check if an exception is a Gemini 429 / quota exceeded error."""
    msg = str(e).lower()
    return "429" in msg or "quota" in msg or "resource_exhausted" in msg or "rate limit" in msg

SUPPORTED_EXTENSIONS = {
    '.js', '.ts', '.jsx', '.tsx', '.py', '.java', 
    '.cpp', '.h', '.go', '.cs', '.rs', '.css', '.html',
    '.yaml', '.yml', '.toml'
}

SUPPORTED_FILENAMES = {
    'dockerfile', 'docker-compose.yml', 'docker-compose.yaml', 
    'render.yaml', 'vercel.json', 'netlify.toml', '.env.example'
}

EXCLUDED_DIRS = {
    '.git', 'node_modules', '.next', 'dist', 'build', 
    'out', 'coverage', 'venv', '.venv', '__pycache__'
}

EXCLUDED_FILES = {
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 
    'bun.lockb', 'bun.lock', 'composer.lock', 'Gemfile.lock'
}

def read_project_files(project_path: str) -> dict:
    files_content = {}
    total_chars = 0
    max_chars = 800_000 # Limit total payload to ~200k tokens
    max_files = 150     # Limit to 150 files maximum
    
    for root, dirs, files in os.walk(project_path):
        # Modify dirs in-place to avoid walking into ignored directories
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        
        for file in files:
            if len(files_content) >= max_files:
                break
                
            if file in EXCLUDED_FILES or '.min.' in file:
                continue
                
            ext = os.path.splitext(file)[1].lower()
            name_lower = file.lower()
            
            # Match supported extensions, target config filenames, or Dockerfiles
            if ext in SUPPORTED_EXTENSIONS or name_lower in SUPPORTED_FILENAMES or 'dockerfile' in name_lower:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, project_path).replace('\\', '/')
                try:
                    with open(abs_path, 'r', encoding='utf-8', errors='ignore') as f:
                        # Limit single file size to 50KB to keep prompt balanced
                        content = f.read(50_000)
                        content_len = len(content)
                        
                        if total_chars + content_len > max_chars:
                            # Read whatever fits under the limit
                            remaining_space = max_chars - total_chars
                            if remaining_space > 100:
                                files_content[rel_path] = content[:remaining_space]
                                total_chars += remaining_space
                            break
                            
                        files_content[rel_path] = content
                        total_chars += content_len
                except Exception:
                    pass
                    
        if total_chars >= max_chars or len(files_content) >= max_files:
            break
            
    return files_content


def analyze_codebase(project_path: str = None, files_content: dict = None) -> dict:
    provider = _get_ai_provider()

    if provider != "groq":
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is missing")
        genai.configure(api_key=api_key)

    if files_content is None:
        if not project_path:
            raise ValueError("Either project_path or files_content must be provided")
        files_content = read_project_files(project_path)
    if not files_content:
        return {
            "overallScore": 100,
            "qualityScore": 100,
            "securityScore": 100,
            "performanceScore": 100,
            "maintainabilityScore": 100,
            "bugs": [],
            "suggestions": ["No supported code files found to analyze."],
            "aiSummary": "Empty or unsupported project structure."
        }

    # Prepare Gemini model if needed
    model = None
    if provider != "groq":
        model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=SYSTEM_PROMPT
        )

    all_issues = []

    # Batch files: up to 8 files and 150,000 characters per API request
    batch_files = []
    current_batch = []
    current_chars = 0
    for rel_path, content in files_content.items():
        content_len = len(content)
        if len(current_batch) >= 8 or (current_chars + content_len > 150_000 and current_batch):
            batch_files.append(current_batch)
            current_batch = []
            current_chars = 0
        current_batch.append((rel_path, content))
        current_chars += content_len
    if current_batch:
        batch_files.append(current_batch)

    # Analyze batches with rate-limiting sleep protection
    for idx, batch in enumerate(batch_files):
        if idx > 0:
            time.sleep(1.5) # Sleep to stay safely within free tier RPM limits
            
        payload_str = ""
        for rel_path, content in batch:
            payload_str += f"\n--- File: {rel_path} ---\n{content}\n"
            
        prompt = build_user_prompt(payload_str)
        try:
            provider = _get_ai_provider()
            issues = []

            # Try Gemini unless user explicitly chose Groq
            if provider in ("gemini", "auto"):
                try:
                    response = model.generate_content(
                        prompt,
                        generation_config={"response_mime_type": "application/json"}
                    )
                    text = response.text.strip()
                    if text.startswith("```"):
                        text = text.replace("```json", "").replace("```", "").strip()
                    parsed = json.loads(text)
                    if isinstance(parsed, list):
                        issues = parsed
                    elif isinstance(parsed, dict):
                        for key in ("issues", "results", "findings", "data", "analysis"):
                            if key in parsed and isinstance(parsed[key], list):
                                issues = parsed[key]
                                break
                except Exception as gemini_err:
                    if provider == "auto" and _is_rate_limit_error(gemini_err):
                        print(f"[AI Router] Gemini rate limit hit — switching to Groq for this batch")
                        # Fallback to Groq
                        from groq_provider import analyze_with_groq
                        issues = analyze_with_groq(payload_str)
                    # On other Gemini errors or explicit gemini mode: skip batch

            elif provider == "groq":
                from groq_provider import analyze_with_groq
                issues = analyze_with_groq(payload_str)

            # Normalize filePath by matching against the files in this batch
            fallback_path = batch[0][0]
            for issue in issues:
                issue_path = issue.get("filePath", "")
                if not issue_path:
                    issue["filePath"] = fallback_path
                    continue
                
                # Match against the files in the batch
                norm_issue_path = issue_path.replace('\\', '/').lower().strip()
                matched_path = None
                
                for rel_path, _ in batch:
                    norm_rel_path = rel_path.replace('\\', '/').lower().strip()
                    if norm_rel_path == norm_issue_path:
                        matched_path = rel_path
                        break
                    if norm_rel_path.endswith('/' + norm_issue_path) or norm_issue_path.endswith('/' + norm_rel_path):
                        matched_path = rel_path
                        break
                    # Fallback to basename matching
                    if os.path.basename(rel_path).lower() == os.path.basename(issue_path).lower():
                        matched_path = rel_path
                        break
                
                if matched_path:
                    issue["filePath"] = matched_path
                else:
                    issue["filePath"] = fallback_path
            all_issues.extend(issues)

        except Exception as e:
            # Continue gracefully to next batch on error
            pass

    # Point deduction scores (starting at 100)
    quality_score = 100
    security_score = 100
    performance_score = 100
    maintainability_score = 100

    bugs = []
    suggestions_set = set()

    for issue in all_issues:
        # Normalize category to standard values
        cat_raw = str(issue.get("category", "")).lower()
        if "security" in cat_raw or "vuln" in cat_raw:
            category = "Security"
        elif "perf" in cat_raw or "slow" in cat_raw or "speed" in cat_raw:
            category = "Performance"
        elif "best" in cat_raw or "practice" in cat_raw or "quality" in cat_raw or "maintain" in cat_raw or "arch" in cat_raw:
            category = "Best Practice"
        else:
            category = "Bug"

        # Normalize severity to standard values
        sev_raw = str(issue.get("severity", "")).lower()
        if "critical" in sev_raw:
            severity = "Critical"
        elif "high" in sev_raw:
            severity = "High"
        elif "medium" in sev_raw:
            severity = "Medium"
        else:
            severity = "Low"
            
        deduction = 2
        if severity == "Critical":
            deduction = 15
        elif severity == "High":
            deduction = 10
        elif severity == "Medium":
            deduction = 5

        if category == "Bug":
            quality_score -= deduction
        elif category == "Security":
            security_score -= deduction
        elif category == "Performance":
            performance_score -= deduction
        elif category == "Best Practice":
            maintainability_score -= deduction

        sev_mapped = severity.lower()
        if sev_mapped not in ["low", "medium", "high", "critical"]:
            sev_mapped = "low"
            
        desc = f"{issue.get('title', 'Issue')}: {issue.get('description', '')}"
        desc = desc.strip()
        if not desc or desc == "Issue:":
            desc = "Issue detected in file."
        
        sugg = issue.get("suggestion", "")
        fixed_code = issue.get("fixed_code", "")
        if fixed_code:
            ext = os.path.splitext(issue.get("filePath", ""))[1].lower()
            lang = "javascript"
            if ext in [".py"]:
                lang = "python"
            elif ext in [".java"]:
                lang = "java"
            elif ext in [".cpp", ".h"]:
                lang = "cpp"
            elif ext in [".go"]:
                lang = "go"
            elif ext in [".ts", ".tsx"]:
                lang = "typescript"
            
            sugg += f"\n\nSuggested Fix:\n```{lang}\n{fixed_code}\n```"

        sugg = sugg.strip()
        if not sugg:
            sugg = "No specific fix suggestion provided."

        bugs.append({
            "filePath": issue.get("filePath", ""),
            "line": int(issue.get("line")) if (issue.get("line") is not None and str(issue.get("line")).isdigit()) else 1,
            "severity": sev_mapped,
            "description": desc,
            "impact": issue.get("impact", ""),
            "fixSuggestion": sugg,
            "targetCode": issue.get("target_code", ""),
            "fixedCode": issue.get("fixed_code", "")
        })

        if issue.get("suggestion"):
            suggestions_set.add(issue.get("suggestion"))

    # Bound scores
    quality_score = max(0, min(100, quality_score))
    security_score = max(0, min(100, security_score))
    performance_score = max(0, min(100, performance_score))
    maintainability_score = max(0, min(100, maintainability_score))
    
    overall_score = round((quality_score + security_score + performance_score + maintainability_score) / 4)

    suggestions = list(suggestions_set)[:10]
    if not suggestions:
        suggestions = ["Codebase is in good shape. Maintain general code quality standards."]

    ai_summary = f"Analysis completed. Scanned {len(files_content)} files. Found {len(bugs)} issues. Overall codebase score is {overall_score}/100."
    if bugs:
        critical_count = len([b for b in bugs if b['severity'] == 'critical'])
        high_count = len([b for b in bugs if b['severity'] == 'high'])
        ai_summary += f" Critical issues: {critical_count}, High priority: {high_count}."

    report = {
        "overallScore": overall_score,
        "qualityScore": quality_score,
        "securityScore": security_score,
        "performanceScore": performance_score,
        "maintainabilityScore": maintainability_score,
        "bugs": bugs,
        "suggestions": suggestions,
        "aiSummary": ai_summary
    }

    return report


def chat_with_ai(review_context: dict, chat_history: list, question: str) -> str:
    provider = _get_ai_provider()
    
    # Groq-only mode
    if provider == "groq":
        from groq_provider import chat_with_groq
        return chat_with_groq(review_context, chat_history, question)

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is missing")
        
    genai.configure(api_key=api_key)
    
    system_instruction = (
        "You are CodeMind AI, a helpful code assistant. The user is asking questions about a code review "
        "you performed earlier. Here is the review details of their project:\n"
        f"{json.dumps(review_context, indent=2)}\n\n"
        "Please answer their questions concisely, providing direct refactoring or debugging tips."
    )
    
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    model = genai.GenerativeModel(
        model_name=model_name,
        system_instruction=system_instruction
    )

    # Gemini (with auto fallback)
    contents = []
    for chat in chat_history:
        contents.append({"role": "user", "parts": [chat["question"]]})
        contents.append({"role": "model", "parts": [chat["answer"]]})
    contents.append({"role": "user", "parts": [question]})

    try:
        response = model.generate_content(contents)
        return response.text
    except Exception as e:
        if provider == "auto" and _is_rate_limit_error(e):
            print("[AI Router] Gemini rate limit — switching to Groq for chat")
            from groq_provider import chat_with_groq
            return chat_with_groq(review_context, chat_history, question)
        raise


# ─────────────────────────────────────────────
#  RAG — Chat with Codebase
# ─────────────────────────────────────────────

CHUNK_LINES = 40       # Lines per chunk
CHUNK_OVERLAP = 5      # Overlap lines between consecutive chunks
TOP_K = 8              # Number of chunks to retrieve
EMBED_BATCH_SIZE = 80  # Gemini embedding API batch limit (safe margin below 100)


def _chunk_project(project_path: str) -> list:
    """
    Walk all source files in project_path, split them into overlapping
    line-based chunks, and return a list of chunk dicts:
      { text, filePath, startLine, endLine }
    """
    chunks = []
    for root, dirs, files in os.walk(project_path):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        for file in files:
            if file in EXCLUDED_FILES or '.min.' in file:
                continue
            ext = os.path.splitext(file)[1].lower()
            name_lower = file.lower()
            if ext not in SUPPORTED_EXTENSIONS and name_lower not in SUPPORTED_FILENAMES and 'dockerfile' not in name_lower:
                continue

            abs_path = os.path.join(root, file)
            rel_path = os.path.relpath(abs_path, project_path).replace('\\', '/')
            try:
                with open(abs_path, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = f.readlines()
            except Exception:
                continue

            # Slide a window of CHUNK_LINES with CHUNK_OVERLAP overlap
            step = CHUNK_LINES - CHUNK_OVERLAP
            for start in range(0, max(1, len(lines)), step):
                end = min(start + CHUNK_LINES, len(lines))
                chunk_text = ''.join(lines[start:end]).strip()
                if len(chunk_text) < 20:  # Skip near-empty chunks
                    continue
                # Prefix chunk with file path so model knows the context
                header = f"// File: {rel_path} (lines {start + 1}–{end})\n"
                chunks.append({
                    'text': header + chunk_text,
                    'filePath': rel_path,
                    'startLine': start + 1,
                    'endLine': end
                })
    return chunks


def _embed_texts(texts: list) -> np.ndarray:
    """
    Embed a list of strings using Gemini text-embedding-004.
    Returns a 2D numpy array of shape (N, dim).
    Batches calls to stay within API limits.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)

    all_embeddings = []
    for i in range(0, len(texts), EMBED_BATCH_SIZE):
        batch = texts[i:i + EMBED_BATCH_SIZE]
        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content=batch,
            task_type="RETRIEVAL_DOCUMENT"
        )
        all_embeddings.extend(result['embedding'])
        if i + EMBED_BATCH_SIZE < len(texts):
            time.sleep(1)  # Respect rate limits between batches

    return np.array(all_embeddings, dtype=np.float32)


def _cosine_similarity(query_vec: np.ndarray, doc_matrix: np.ndarray) -> np.ndarray:
    """Compute cosine similarity between a single query vector and a matrix of doc vectors."""
    query_norm = query_vec / (np.linalg.norm(query_vec) + 1e-10)
    doc_norms = doc_matrix / (np.linalg.norm(doc_matrix, axis=1, keepdims=True) + 1e-10)
    return doc_norms @ query_norm

def _keyword_similarity_search(query: str, chunks: list, top_k: int) -> list:
    """
    Fallback keyword-based overlap search when Gemini embeddings are unavailable.
    """
    # Tokenize query words
    query_words = [w.lower() for w in query.split() if len(w) > 2]
    if not query_words:
        query_words = [w.lower() for w in query.split()]

    scored_chunks = []
    for chunk in chunks:
        chunk_text_lower = chunk['text'].lower()
        score = 0
        for word in query_words:
            # Word match weightings
            if f" {word} " in f" {chunk_text_lower} ":
                score += 5
            elif word in chunk_text_lower:
                score += 1
        scored_chunks.append((score, chunk))

    # Sort by score descending and return top-K
    scored_chunks.sort(key=lambda x: x[0], reverse=True)
    return [chunk for score, chunk in scored_chunks[:top_k]]


def rag_chat(project_path: str, question: str, chat_history: list) -> dict:
    """
    Full RAG pipeline with high-reliability fallbacks:
    1. Chunk all project source files
    2. Embed using Gemini or use Keyword Similarity Search
    3. Retrieve top-K chunks
    4. Generate response using Gemini or Groq
    """
    provider = _get_ai_provider()
    api_key = os.getenv("GEMINI_API_KEY")

    # Step 1 — Chunk the codebase
    chunks = _chunk_project(project_path)
    if not chunks:
        return {
            "reply": "I couldn't find any readable source files in this project to search through.",
            "sources": []
        }

    retrieved = []
    use_keyword_search = (provider == "groq") or (not api_key)

    if not use_keyword_search:
        try:
            genai.configure(api_key=api_key)
            # Step 2 — Embed all chunks
            chunk_texts = [c['text'] for c in chunks]
            chunk_embeddings = _embed_texts(chunk_texts)

            # Step 3 — Embed the query
            query_result = genai.embed_content(
                model="models/gemini-embedding-001",
                content=question,
                task_type="RETRIEVAL_QUERY"
            )
            query_vec = np.array(query_result['embedding'], dtype=np.float32)

            # Step 4 — Find top-K chunks by cosine similarity
            scores = _cosine_similarity(query_vec, chunk_embeddings)
            top_indices = np.argsort(scores)[::-1][:TOP_K]
            retrieved = [chunks[i] for i in top_indices]
        except Exception as e:
            print(f"[AI Router] Gemini Embedding failed: {e}. Falling back to Keyword Similarity Search.")
            use_keyword_search = True

    if use_keyword_search:
        # Fallback to local keyword search (No API calls, offline-friendly)
        retrieved = _keyword_similarity_search(question, chunks, TOP_K)

    # Step 5 — Build grounded prompt
    context_block = "\n\n".join([
        f"[Source: {c['filePath']} lines {c['startLine']}–{c['endLine']}]\n{c['text']}"
        for c in retrieved
    ])

    # If provider is groq or Gemini key is missing, force Groq generation
    if provider == "groq" or not api_key:
        from groq_provider import rag_generate_with_groq
        try:
            reply = rag_generate_with_groq(context_block, chat_history, question)
            return {
                "reply": reply,
                "sources": [
                    {
                        "filePath": c['filePath'],
                        "startLine": c['startLine'],
                        "endLine": c['endLine']
                    }
                    for c in retrieved
                ]
            }
        except Exception as groq_err:
            return {
                "reply": f"Error calling Groq service: {groq_err}",
                "sources": []
            }

    # Otherwise, use Gemini with Groq fallback
    system_instruction = (
        "You are CodeMind AI, an expert code assistant. A developer has uploaded a codebase "
        "and you have been given the most relevant code snippets as context.\n\n"
        "RULES:\n"
        "- Answer based ONLY on the provided code snippets. Do not hallucinate file paths or function names.\n"
        "- Always cite specific file paths and line numbers when referencing code.\n"
        "- If the answer cannot be determined from the provided snippets, say so honestly.\n"
        "- Be concise, precise, and developer-friendly.\n\n"
        f"RETRIEVED CODE CONTEXT:\n{context_block}"
    )

    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    model = genai.GenerativeModel(
        model_name=model_name,
        system_instruction=system_instruction
    )

    # Build conversation history
    contents = []
    for turn in chat_history:
        contents.append({"role": "user", "parts": [turn["question"]]})
        contents.append({"role": "model", "parts": [turn["answer"]]})
    contents.append({"role": "user", "parts": [question]})

    try:
        response = model.generate_content(contents)
        reply = response.text
    except Exception as e:
        if provider == "auto" and _is_rate_limit_error(e):
            print("[AI Router] Gemini rate limit — switching to Groq for RAG generation")
            from groq_provider import rag_generate_with_groq
            reply = rag_generate_with_groq(context_block, chat_history, question)
        else:
            # Fallback to Groq generation on any other error
            try:
                from groq_provider import rag_generate_with_groq
                reply = rag_generate_with_groq(context_block, chat_history, question)
            except Exception:
                raise e

    # Deduplicate sources for the response
    seen = set()
    sources = []
    for c in retrieved:
        key = (c['filePath'], c['startLine'])
        if key not in seen:
            seen.add(key)
            sources.append({
                "filePath": c['filePath'],
                "startLine": c['startLine'],
                "endLine": c['endLine']
            })

    return {
        "reply": reply,
        "sources": sources
    }
