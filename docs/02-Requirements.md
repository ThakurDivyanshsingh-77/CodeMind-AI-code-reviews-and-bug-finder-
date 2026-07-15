# 02. Software Requirements Specification (SRS)

## 1. Introduction
This Software Requirements Specification (SRS) document defines the comprehensive requirements, business logic, constraints, and traceability criteria for **CodeMind AI**. This document is designed to guide engineering implementation, database design, and testing protocols.

---

## 2. Stakeholders & Systems Actor Matrix
Below is the list of actors and systems interacting with CodeMind AI, including their operational responsibilities:

| Actor / Stakeholder | Class | Responsibility |
| :--- | :--- | :--- |
| **End User** | Human Actor | Registers/logs in, uploads codebase ZIPs, connects repositories, initiates reviews, runs AI chats, and downloads report documents. |
| **Admin** | Human Actor | Accesses system administration portals to monitor code reviews, manage user bans, and view overall analytics dashboards. |
| **AI Service Engine** | External System | Integrates OpenAI/Gemini APIs to scan codebase structures, locate vulnerabilities, evaluate quality, and generate optimization recommendations. |
| **GitHub Integration** | External System | Rest API and OAuth provider allowing users to authorize CodeMind AI to fetch and clone public/private repositories. |
| **Cloud Storage Provider** | External System | Services like Amazon S3 or Cloudinary used to securely store ZIP uploads and generated review PDF reports. |

---

## 3. Business Rules (BR)
These rules represent core policy boundaries that the system must enforce under all conditions:

*   **BR-01 (Payload Limit)**: The maximum size of any uploaded project ZIP archive is strictly capped at **50 MB**.
*   **BR-02 (Language Support)**: Only files matching supported programming language extensions (e.g., `.js`, `.ts`, `.py`, `.java`, `.cpp`, `.go`, `.cs`, `.rs`) will be processed. All other files must be ignored.
*   **BR-03 (Data Ownership)**: Users are strictly restricted to reading and interacting with reviews and code structures belonging to their own user ID.
*   **BR-04 (Persistence Policy)**: Review reports, logs, and score summaries must be persisted permanently in the database for historical reference unless manually deleted by the owner.
*   **BR-05 (Repository Visibility)**: Public GitHub repositories can be cloned directly via URL. Private repositories require OAuth authorization and an active session token.

---

## 4. User Stories (US)

### 4.1 Authentication
*   **US-01**: *As a new user, I want to create an account so that I can access the AI review platform.*
*   **US-02**: *As a registered user, I want to log in securely to access my projects and reports.*

### 4.2 Code Ingestion
*   **US-03**: *As a developer, I want to upload my project so that the AI can analyze my code.*
*   **US-04**: *As a developer, I want to import a GitHub repository instead of uploading ZIP files.*

### 4.3 AI Review Insights
*   **US-05**: *As a developer, I want the AI to identify syntax and logical bugs in my code.*
*   **US-06**: *As a developer, I want security vulnerabilities to be highlighted with severity grading.*
*   **US-07**: *As a developer, I want performance optimization suggestions.*

### 4.4 Reporting & Assistance
*   **US-08**: *As a developer, I want to download my review report in PDF format to share with my team.*
*   **US-09**: *As a developer, I want to ask follow-up questions about my code review in real-time.*

---

## 5. Acceptance Criteria (Given-When-Then)

### 5.1 Project Ingestion
*   **Given**: An authenticated user is active on the upload interface.
*   **When**: The user uploads a valid ZIP file within the 50MB size limit.
*   **Then**: 
    1. The backend stores the ZIP file and extracts it securely.
    2. A project record is created in the database.
    3. The AI review pipeline is automatically queued.

### 5.2 AI Review Display
*   **Given**: An analysis request is active.
*   **When**: The Python AI Service finishes reading code files and completes grading.
*   **Then**: 
    1. The project dashboard is updated.
    2. Overall code score, security metrics, performance metrics, bug annotations, and refactoring guidelines are rendered.

### 5.3 PDF Report Generation
*   **Given**: A completed code review is available.
*   **When**: The user triggers the "Download PDF" action.
*   **Then**: 
    1. The server compiles the scores and bug list into a formatted PDF document.
    2. The document is delivered as a download attachment to the client's browser.

---

## 6. Requirements Traceability Matrix (RTM)
The matrix below links business requirements (FR) to their corresponding functional models and modules:

| Requirement ID | Target Feature | System Module | Verified In Test Cases |
| :--- | :--- | :--- | :--- |
| **FR-01** | Register Account | Authentication | TC-Auth-01 |
| **FR-02** | Login | Authentication | TC-Auth-02 |
| **FR-03** | Google OAuth Login | Authentication | TC-Auth-03 |
| **FR-04** | Secure Logout | Authentication | TC-Auth-04 |
| **FR-05** | ZIP Archive Upload | Project Engine | TC-Proj-01 |
| **FR-06** | GitHub Repo Import | Project Engine | TC-Proj-02 |
| **FR-07** | Language Verification | Project Engine | TC-Proj-03 |
| **FR-08** | ZIP Extraction | Project Engine | TC-Proj-04 |
| **FR-09** | Projects Dashboard | UI Dashboard | TC-Dash-01 |
| **FR-10** | Bug Detection | AI Engine | TC-AI-01 |
| **FR-11** | Security Analysis | AI Engine | TC-AI-02 |
| **FR-12** | Performance Review | AI Engine | TC-AI-03 |
| **FR-13** | Quality Scoring | AI Engine | TC-AI-04 |
| **FR-14** | Code Explanation | AI Engine | TC-AI-05 |
| **FR-15** | Refactoring Suggestion | AI Engine | TC-AI-06 |
| **FR-16** | Reviews Count | UI Dashboard | TC-Dash-02 |
| **FR-17** | Recent Projects | UI Dashboard | TC-Dash-03 |
| **FR-18** | History Logs | UI Dashboard | TC-Dash-04 |
| **FR-19** | Dynamic Graphs | UI Dashboard | TC-Dash-05 |
| **FR-20** | PDF Exporter | Reports Module | TC-Rep-01 |
| **FR-21** | HTML Exporter | Reports Module | TC-Rep-02 |
| **FR-22** | JSON Exporter | Reports Module | TC-Rep-03 |
| **FR-23** | Q&A Chat | Chat Module | TC-Chat-01 |
| **FR-24** | Conversation Logging | Chat Module | TC-Chat-02 |
| **FR-25** | Profile Updating | User Management | TC-User-01 |
| **FR-26** | Password Modification | User Management | TC-User-02 |
