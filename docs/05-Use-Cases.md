# 05. UML & System Modeling

This document details the UML modeling, actor definitions, sequence flows, class layouts, and architectural deployment mappings for **CodeMind AI**.

---

## 1. Actor Identification
The platform defines five operational actors/systems interacting with its business boundary:

*   **User (Primary - Developer/Student)**: Uploads codebases, starts reviews, reads reports, chats with the AI, and configures their profile.
*   **Admin (Primary - Administrator)**: Oversees system operations, views platform usage metrics, and manages active users.
*   **AI Service (Secondary System)**: Third-party LLM engine (OpenAI GPT / Gemini) performing code scanning.
*   **GitHub API (Secondary System)**: Fetches repository source files.
*   **Cloud Storage (Secondary System)**: Hosts raw uploaded project ZIP archives and exported PDF reports.

---

## 2. Use Case Model
The relationships between actors and functional modules are illustrated below:

```mermaid
graph TD
    %% Actors
    User["User (Developer/Student)"]
    Admin["Admin (System Admin)"]
    AI["AI Service (LLM API)"]
    GitHub["GitHub API Service"]
    Storage["Cloud Storage Service"]

    %% Use Cases
    subgraph Core Platform
        UC01["UC-01: Register Account"]
        UC02["UC-02: Login Security"]
        UC03["UC-03: Upload ZIP"]
        UC04["UC-04: Import GitHub Repo"]
        UC05["UC-05: Execute AI Review"]
        UC06["UC-06: AI Context Chat"]
        UC07["UC-07: Export Report (PDF/HTML)"]
        UC08["UC-08: View Usage Metrics"]
    end

    User --> UC01
    User --> UC02
    User --> UC03
    User --> UC04
    User --> UC05
    User --> UC06
    User --> UC07

    Admin --> UC02
    Admin --> UC08

    UC03 --> Storage
    UC04 --> GitHub
    UC05 --> AI
    UC06 --> AI
    UC07 --> Storage
```

---

## 3. Main Use Cases Specifications

### UC-01: Register
*   **Actor**: User
*   **Precondition**: User is anonymous.
*   **Success Flow**:
    1. User navigates to the Registration page.
    2. User submits name, email, and password.
    3. System validates constraints and hashes the password.
    4. Account is successfully persisted in the database.

---

### UC-02: Login
*   **Actor**: User / Admin
*   **Precondition**: User has a registered account.
*   **Success Flow**:
    1. User enters email and password credentials.
    2. System verifies credentials against stored hash values.
    3. System signs and generates a JWT payload.
    4. User is redirected to their Dashboard.

---

### UC-03: Upload Project
*   **Actor**: User
*   **Precondition**: User has an active JWT session.
*   **Success Flow**:
    1. User selects a local `.zip` project archive.
    2. System verifies file type and enforces the 50MB limit.
    3. System stores file inside Cloud Storage and indexes files.
    4. System queues the review process.

---

### UC-04: Import GitHub Repository
*   **Actor**: User
*   **Precondition**: User has an active session.
*   **Success Flow**:
    1. User provides a GitHub Repository URL.
    2. Backend clones the public repo (or uses OAuth tokens for private ones).
    3. Backend parses directory and creates file indexes.
    4. System initiates the code review pipeline.

---

### UC-05: AI Review Execution
*   **Actor**: AI Service Engine
*   **Precondition**: Project metadata and files are stored.
*   **Success Flow**:
    1. System compiles codebase files and splits them into token-valid chunks.
    2. Payload is sent to the LLM API.
    3. System receives recommendations for bugs, security, and performance.
    4. System saves the final review metrics and updates the database.

---

### UC-06: AI Chat Interaction
*   **Actor**: User / AI Service
*   **Precondition**: Target review is completed.
*   **Success Flow**:
    1. User opens the chat pane under a completed review file.
    2. User enters a query (e.g., "Explain this performance issue").
    3. System passes context history + question to the LLM.
    4. System returns the explanation and logs history.

---

## 4. Activity Diagram

```mermaid
stateDiagram-v2
    [*] --> Login
    Login --> Dashboard : Success
    Dashboard --> SelectIngestion : Action
    
    state SelectIngestion {
        [*] --> UploadZIP
        [*] --> CloneGitHub
    }
    
    SelectIngestion --> ValidateFiles
    ValidateFiles --> StoreProject : Valid
    ValidateFiles --> Dashboard : Error (Too Large/Unsupported)
    
    StoreProject --> CompileContext
    CompileContext --> SendToAI
    SendToAI --> ProcessLLM : Forward Payload
    ProcessLLM --> SaveReport : Return JSON
    
    SaveReport --> UpdateUI
    UpdateUI --> SelectFeature
    
    state SelectFeature {
        [*] --> InteractiveChat
        [*] --> DownloadPDF
        [*] --> ViewHistory
    }
    
    SelectFeature --> [*]
```

---

## 5. Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer
    participant FE as Next.js Frontend
    participant BE as Express API Server
    participant DB as MongoDB Atlas
    participant Py as Python AI worker
    participant LLM as Gemini/OpenAI API

    User->>FE: Selects ZIP file & submits
    FE->>BE: POST /api/projects/upload (multipart/form)
    BE->>DB: Create project schema (status: pending)
    BE->>BE: Decompress ZIP & index files
    BE->>FE: Return JSON (projectId, status: uploaded)
    
    Note over FE,BE: Trigger AI Analysis
    FE->>BE: POST /api/review/start
    BE->>DB: Update status to processing
    BE->>Py: Request review (payload: code files)
    Py->>Py: Chunk files & compile context
    Py->>LLM: Send context prompts
    LLM->>Py: Return review findings (JSON)
    Py->>BE: Return parsed review data
    BE->>DB: Save review scores & bugs list
    BE->>DB: Update project status to completed
    BE->>FE: Return analysis response (reviewId)
    FE->>User: Display dashboard stats & scorecard
```

---

## 6. Class Diagram

```mermaid
classDiagram
    User "1" --o "*" Project : owns
    Project "1" --o "*" File : contains
    Project "1" --o "*" Review : has
    Review "1" --o "*" ChatHistory : logs

    class User {
        +ObjectId id
        +string name
        +string email
        +string passwordHash
        +string avatar
        +register()
        +login()
    }

    class Project {
        +ObjectId id
        +ObjectId userId
        +string projectName
        +string language
        +string githubUrl
        +string uploadType
        +string status
        +uploadZip()
        +importGit()
    }

    class File {
        +ObjectId id
        +ObjectId projectId
        +string fileName
        +string filePath
        +string content
    }

    class Review {
        +ObjectId id
        +ObjectId projectId
        +int score
        +int securityScore
        +int performanceScore
        +array bugs
        +array suggestions
        +generatePDF()
    }

    class ChatHistory {
        +ObjectId id
        +ObjectId reviewId
        +string question
        +string answer
        +saveHistory()
    }
```

---

## 7. Component Diagram

```mermaid
graph TD
    subgraph UI Layer [Client Portal]
        FE["Next.js Web App"]
    end

    subgraph API Layer [Express Backend Gateway]
        BE["Express.js Server"]
        Multer["Multer File Uploader"]
        Mongoose["Mongoose ODM"]
    end

    subgraph Processing Layer [AI Microservice]
        Py["Python FastAPI Worker"]
    end

    subgraph External Systems
        DB[("MongoDB Atlas Database")]
        Git["GitHub Third-Party API"]
        LLM["Gemini/OpenAI LLM Engine"]
    end

    FE <-->|REST API / JSON| BE
    BE --> Multer
    BE --> Mongoose
    Mongoose <--> DB
    BE <-->|HTTP REST| Py
    BE --> Git
    Py <--> LLM
```

---

## 8. Deployment Diagram

```mermaid
graph TD
    subgraph Client Node
        Browser["User Web Browser"]
    end

    subgraph Hosting Platforms
        Vercel["Vercel Cloud (Frontend Serverless CDN)"]
        Render["Render Instance (Node/Express API Server)"]
        Atlas["MongoDB Atlas Cloud (Database Cluster)"]
        PythonNode["FastAPI Server (Worker Instance)"]
    end

    subgraph External Provider
        Gemini["Gemini / OpenAI API Gateway"]
    end

    Browser <-->|HTTPS| Vercel
    Vercel <-->|HTTPS / REST| Render
    Render <-->|TCP Port 27017| Atlas
    Render <-->|HTTP / Internal| PythonNode
    PythonNode <-->|HTTPS / TLS| Gemini
```

---

## 9. State Diagram (Review Lifecycle)

```mermaid
stateDiagram-v2
    [*] --> Created : Project Schema Instantiated
    Created --> Uploaded : Files Saved to Disk/Cloud
    Uploaded --> Processing : User triggers 'Start Review'
    Processing --> AIReviewing : Payload Compiled & Sent to LLM
    AIReviewing --> Completed : Recommendations Received & Saved
    AIReviewing --> Failed : API Timeout / Failure
    Failed --> Processing : Retry Triggered
    Completed --> Downloaded : PDF Report Requested
    Completed --> Deleted : Project Cleanup
    Downloaded --> Deleted
    Deleted --> [*]
```
