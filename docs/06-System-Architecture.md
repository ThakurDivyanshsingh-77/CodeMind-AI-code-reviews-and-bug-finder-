# 06. System Architecture

This document describes the design patterns, component relationships, and microservices interaction model of the CodeMind AI system.

---

## 1. High-Level Architectural Layout

CodeMind AI follows a service-oriented architectural model separating frontend execution, application routing, and heavy LLM/AI computations into dedicated layers:

```mermaid
graph TD
    %% Clients
    User["Developer / User"] <-->|HTTPS / REST| FE["Frontend (Next.js + TypeScript)"]
    
    %% API Server & Services
    FE <-->|HTTPS / REST & JWT| API["Express.js API Server Gateway"]
    
    subgraph Express.js Backend Services
        API --> Auth["Authentication Service (JWT/OAuth)"]
        API --> Git["GitHub Service (GitHub API Integration)"]
        API --> Upload["File Upload Service (Multer)"]
    end
    
    %% AI Engine
    API <-->|REST API| AIService["AI Review Service (FastAPI / Python)"]
    AIService <-->|HTTP/REST / SDK| LLM["Gemini / OpenAI API"]
    
    %% Database
    API <-->|Mongoose ODM| DB[(MongoDB Atlas)]
    
    %% Styling
    style User fill:#f9f,stroke:#333,stroke-width:2px
    style FE fill:#bbf,stroke:#333,stroke-width:2px
    style API fill:#ddf,stroke:#333,stroke-width:2px
    style AIService fill:#dfd,stroke:#333,stroke-width:2px
    style DB fill:#fdd,stroke:#333,stroke-width:2px
    style LLM fill:#ffd,stroke:#333,stroke-width:2px
```

---

## 2. Component Directory & Responsibilities

### 2.1 Next.js Frontend (`client/`)
*   **Role**: Client-side UI & Routing.
*   **Technologies**: Next.js (App Router), React, TypeScript.
*   **Responsibilities**: 
    *   Secure token management (JWT storage).
    *   Dynamic code analysis dashboard and code preview panel.
    *   Interactive chat interface using optimistic rendering.
    *   Responsive layouts using CSS Variables and responsive breakpoints.

### 2.2 Express Backend (`server/`)
*   **Role**: Application Gateway, API Routing, Data Orchestrator.
*   **Technologies**: Node.js, Express.js, Mongoose.
*   **Responsibilities**:
    *   User Session Management and authentication checks.
    *   File Upload Ingestion (Multer middleware) & extraction.
    *   GitHub public repository cloning and file structure preparation.
    *   Interaction logic with Python AI engine.
    *   Report construction and formatting.

### 2.3 AI Review Service (`ai-service/`)
*   **Role**: High-efficiency Analysis Engine.
*   **Technologies**: Python, FastAPI.
*   **Responsibilities**:
    *   Abstract Syntax Tree (AST) parsing for supported languages.
    *   Token context compiler (combining related files to manage LLM prompt size).
    *   Interfacing with Gemini/OpenAI API.
    *   Output validating and structural formatting of AI JSON returns.

---

## 3. Data Flow Orchestration

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer
    participant FE as Next.js Frontend
    participant BE as Express API Server
    participant DB as MongoDB
    participant AI as AI Review Service (Python)
    participant LLM as Gemini/OpenAI API

    User->>FE: Upload ZIP / Provide GitHub URL
    FE->>BE: POST /api/projects/upload or /github
    alt ZIP Upload
        BE->>BE: Extract file & save metadata
    else GitHub URL
        BE->>BE: Clone repo & parse files
    end
    BE->>DB: Save project & file records (Pending Status)
    BE->>FE: Return Project ID (Acknowledged)
    
    FE->>BE: POST /api/review/start (Initiate review)
    BE->>AI: Forward files/source code content
    AI->>LLM: Send structured prompts with code contexts
    LLM->>AI: Return review responses (JSON structure)
    AI->>BE: Send analysis report
    BE->>DB: Update Project Status (Completed) & Save Reviews/Bugs
    BE->>FE: Notify completion
    
    FE->>BE: GET /api/review/:id
    BE->>DB: Fetch review details
    DB->>BE: Return data
    BE->>FE: Display dashboard insights to User
```
