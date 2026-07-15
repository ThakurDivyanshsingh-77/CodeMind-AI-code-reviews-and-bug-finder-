# AI Code Reviewer

An industry-standard automated Code Review platform. It allows developers to upload project archives (ZIP) or import GitHub repositories directly to get comprehensive, AI-driven reviews identifying bugs, security vulnerabilities, and performance bottlenecks, complete with an interactive AI chat to ask questions about code fixes.

---

## 🚀 Key Features

*   **Secure Authentication**: JWT & GitHub OAuth for secure user session management.
*   **Dual Ingestion**: Support for uploading ZIP archives or direct GitHub repository cloning/parsing.
*   **Deep Analysis**: AI review service parses source code files, sending smart contexts to Gemini or OpenAI API to grade security and performance.
*   **Interactive AI Chat**: Ask follow-up questions regarding specific lines of code or suggestions.
*   **Beautiful Dashboards**: Next.js & TypeScript  UI displaying scorecards, detailed reports, and fix guidelines.
*   **Reports Export**: Downloadable PDF, HTML, and JSON reports summarizing the analysis.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Next.js, React, TypeScript, CSS Variables | Single Page Dashboard & Interactive Chat |
| **Backend API** | Node.js, Express.js | API Gateway, Multer file handler, GitHub integration |
| **AI Service** | Python, FastAPI | Specialized background worker processing code payloads |
| **Database** | MongoDB Atlas, Mongoose | Schema validation & relations |
| **AI Models** | Gemini Pro / OpenAI GPT-4 | LLM Engines for multi-file analysis |

---

## 📁 Repository Directory Layout

The project follows a modular, industry-standard **Model-View-Controller (MVC)**-style pattern for the backend, and standard App Router structure for the Next.js frontend:

```text
ai-code-reviewer/
│
├── client/                         # Next.js Frontend
│   ├── app/                        # Pages & Routes
│   ├── components/                 # Reusable UI Components
│   ├── hooks/                      # Custom React hooks
│   ├── services/                   # Frontend API wrappers
│   ├── lib/                        # Client helper libraries
│   ├── types/                      # TypeScript declarations
│   └── public/                     # Static assets & images
│
├── server/                         # Express.js Backend API
│   ├── src/
│   │   ├── config/                 # Configurations (DB, Cloudinary, Env)
│   │   ├── models/                 # Mongoose schema models
│   │   ├── controllers/            # Request handlers (auth, project, review)
│   │   ├── routes/                 # API endpoint routing
│   │   ├── middlewares/            # Auth guards, upload, error handlers
│   │   ├── services/               # Integrations (AI, GitHub, Reports)
│   │   └── utils/                  # Logger, custom error classes, helpers
│   ├── app.js                      # Express configuration
│   └── server.js                   # Main application entry point
│
├── ai-service/                     # Python FastAPI AI Worker
│   ├── main.py                     # FastAPI entry point
│   ├── analyzer.py                 # Code AST parser and chunk compiler
│   ├── prompts.py                  # Structured System and User prompts
│   ├── parser.py                   # Output parser & JSON formatter
│   └── requirements.txt            # Python dependencies
│
├── docs/                           # Project Specifications & API Docs
│   ├── system-design.md            # High-level architecture & DB design
│   ├── openapi.yaml                # OpenAPI v3 (Swagger) Spec
│   └── postman_collection.json     # Ready-to-import Postman Collection
│
├── docker-compose.yml              # Multi-container local deployment
└── README.md                       # Documentation Entrypoint
```

---

## 📖 Project Documentation & Architecture (SDLC Phase 1)

All architectural specifications, database schemas, and requirement logs are available inside the `docs/` directory:

1.  **[Project Overview](file:///c:/Users/divya/OneDrive/Desktop/code/docs/01-Project-Overview.md)**: Goals, objectives, success criteria, and targets.
2.  **[Requirements Engineering](file:///c:/Users/divya/OneDrive/Desktop/code/docs/02-Requirements.md)**: Stakeholder map and business rules.
3.  **[Functional Requirements](file:///c:/Users/divya/OneDrive/Desktop/code/docs/03-Functional-Requirements.md)**: MoSCoW prioritization, user stories, and ACs.
4.  **[Non-Functional Requirements](file:///c:/Users/divya/OneDrive/Desktop/code/docs/04-Non-Functional-Requirements.md)**: Security protocols, constraints, and latency targets.
5.  **[Use Cases & System Interactions](file:///c:/Users/divya/OneDrive/Desktop/code/docs/05-Use-Cases.md)**: Detailed success and failure paths.
6.  **[System Architecture](file:///c:/Users/divya/OneDrive/Desktop/code/docs/06-System-Architecture.md)**: Layered diagram and component analysis.
7.  **[Database Design](file:///c:/Users/divya/OneDrive/Desktop/code/docs/07-Database-Design.md)**: Mongoose schemas, relationships, and ERD.
8.  **[API Reference Catalog](file:///c:/Users/divya/OneDrive/Desktop/code/docs/08-API-Documentation.md)**: HTTP request & response models (View interactive spec in **[openapi.yaml](file:///c:/Users/divya/OneDrive/Desktop/code/docs/openapi.yaml)**).
9.  **[Project Roadmap](file:///c:/Users/divya/OneDrive/Desktop/code/docs/09-Project-Roadmap.md)**: Gantt chart schedule and milestones.
10. **[Technology Stack](file:///c:/Users/divya/OneDrive/Desktop/code/docs/10-Tech-Stack.md)**: Framework justifications (Next.js, FastAPI, Express).

*You can also import **[postman_collection.json](file:///c:/Users/divya/OneDrive/Desktop/code/docs/postman_collection.json)** to test all endpoints.*
