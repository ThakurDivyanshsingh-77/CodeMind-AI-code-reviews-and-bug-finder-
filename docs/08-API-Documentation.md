# 08. Backend Architecture & API Design

This document details the software design patterns, folder structure layout, authentication flows, API versioning strategies, request/response models, middleware pipelines, and security checklists for **CodeMind AI**.

---

## 1. Backend Stack & Purpose

The backend API server operates on Node.js using a modular MVC (Model-View-Controller) service pattern:

| Technology | Purpose | Implementation Details |
| :--- | :--- | :--- |
| **Node.js** | Runtime Environment | Asynchronous non-blocking execution. |
| **Express.js** | API Framework | REST routing, middleware configuration, request parsing. |
| **MongoDB Atlas** | Data Store | Dynamic BSON storage for user data, reports, and logs. |
| **Mongoose** | Object Document Mapper | Model schemas, validations, hooks, and database indexing. |
| **JWT** | Session Auth | Signed JSON Web Tokens for stateless API access verification. |
| **bcrypt** | Password Security | Secure password salting (factor 10+) and hashing. |
| **Multer** | Multipart Handler | Memory storage or transient disk buffering for ZIP uploads. |
| **Axios** | HTTP Communications | Dispatches requests to the FastAPI Python worker engine. |
| **Pino / Winston** | System Logging | JSON formatted production logging of events. |

---

## 2. Layered MVC Architectural Pattern

To maximize separation of concerns and scaling, requests filter down through these distinct layers:

```text
Request (Client)
      │
      ▼
Routes Layer  ────────► [Middleware Chain: Helmet, CORS, JWT Auth, Validations]
      │
      ▼
Controllers Layer ────► [Parses parameters, routes logic flow, format responses]
      │
      ▼
Services Layer  ──────► [Handles heavy business logic, DB queries, AI engine API]
      │
      ▼
Data Access Layer ────► [Mongoose ODM models querying MongoDB Atlas]
```

---

## 3. Modular Folder Structure Layout

```text
server/
│
├── src/
│   ├── config/                     # Core configs
│   │   ├── db.js                   # Mongoose connection
│   │   ├── env.js                  # Environment variable validations
│   │   └── logger.js               # Pino / Winston setups
│   │
│   ├── routes/                     # Router registries
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   ├── review.routes.js
│   │   ├── chat.routes.js
│   │   ├── report.routes.js
│   │   └── user.routes.js
│   │
│   ├── controllers/                # Request binders
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   ├── review.controller.js
│   │   ├── chat.controller.js
│   │   └── report.controller.js
│   │
│   ├── services/                   # Core business logical handlers
│   │   ├── auth.service.js
│   │   ├── github.service.js
│   │   ├── ai.service.js
│   │   ├── review.service.js
│   │   └── report.service.js
│   │
│   ├── models/                     # Mongoose definitions
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Review.js
│   │   ├── Chat.js
│   │   ├── Notification.js
│   │   └── ApiUsage.js
│   │
│   ├── middlewares/                # Filter hooks
│   │   ├── auth.js                 # JWT check
│   │   ├── upload.js               # Multer zip upload config
│   │   ├── validate.js             # Joi / Zod validators
│   │   ├── errorHandler.js         # Centralized error handler
│   │   └── rateLimiter.js          # Express rate limiter
│   │
│   ├── utils/                      # Helper operations
│   │   ├── jwt.js                  # Sign and verify JWTs
│   │   ├── password.js             # bcrypt comparison
│   │   ├── response.js             # Formatted standard response helpers
│   │   └── fileExtractor.js        # ZIP decompressor utility
│   │
│   ├── app.js                      # Express middleware bindings
│   └── server.js                   # HTTP Server launcher
```

---

## 4. Key Execution Flows

### 4.1 Authentication flows
*   **Registration Flow**: `Input name/email/password` ➔ `Validate inputs` ➔ `Hash password (bcrypt)` ➔ `Persist User` ➔ `Sign JWT token` ➔ `Return Token`.
*   **Login Flow**: `Input email/password` ➔ `Look up user` ➔ `Compare passwords (bcrypt)` ➔ `Sign JWT token` ➔ `Access Dashboard`.

### 4.2 AI Review Flow
```text
Upload ZIP
   │
   ▼
Extract Files to Local Temp Storage
   │
   ▼
Validate Language Extensions
   │
   ▼
Store Project metadata in DB
   │
   ▼
axios.post("/analyze", payload) ➔ FastAPI Python Worker
   │
   ▼
FastAPI constructs contexts & Prompts ➔ Gemini / OpenAI API
   │
   ▼
Receive Structured suggestions JSON from AI
   │
   ▼
Persist Review Document & generate Report PDF
   │
   ▼
Clean up Transient Temp files
   │
   ▼
Return success JSON payload containing Review ID
```

---

## 5. API Versioning & Payload Specifications

### 5.1 Route Prefixing
To allow developers to modify schemas without causing breaking changes to active clients, all endpoints prefix routes with versions:
```text
/api/v1/auth
/api/v1/projects
/api/v1/reviews
/api/v1/chat
/api/v1/report
```

### 5.2 Success Response Format (JSON)
```json
{
  "success": true,
  "message": "Project uploaded successfully",
  "data": {
    "projectId": "64b73b5f7e6f3b001aef12a3",
    "status": "uploaded"
  }
}
```

### 5.3 Error Response Format (JSON)
```json
{
  "success": false,
  "message": "Invalid password credentials provided",
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "details": {}
  }
}
```

---

## 6. REST API Endpoint Mapping Directory

### 6.1 Authentication Module (`/api/v1/auth`)
*   `POST /register`: Registers a new user.
*   `POST /login`: Validates password and issues JWT.
*   `POST /logout`: Invalidate session active state.
*   `GET /me`: Fetches profile of the active token context.

### 6.2 Projects Module (`/api/v1/projects`)
*   `POST /upload`: Ingests zip folder payload (enforces 50MB limit).
*   `POST /github`: Initiates GitHub repo import clone.
*   `GET /`: Fetches list of user projects.
*   `GET /:id`: Retrieves metadata details of a project.
*   `DELETE /:id`: Deletes project files and database metadata.

### 6.3 AI Reviews Module (`/api/v1/reviews`)
*   `POST /start`: Triggers Python code parsing and LLM API.
*   `GET /:id`: Returns score breakdown and list of bugs.
*   `GET /history`: Returns full user history.

### 6.4 Chat Module (`/api/v1/chat`)
*   `POST /`: Sends a text message along with `reviewId` context to the AI helper.
*   `GET /:reviewId`: Returns historical messages logged under this review ID.

### 6.5 Reports Module (`/api/v1/report`)
*   `GET /pdf/:id`: Exports review results as a PDF document download.
*   `GET /json/:id`: Exports raw JSON reviews payload.
*   `GET /html/:id`: Downloads a standalone responsive HTML dashboard scorecard.

---

## 7. Middleware Execution Pipeline

Every incoming request filters through a predefined middleware stack before routing to the controller logic:

```text
Request
  │
  ▼
[ Helmet ]           (Defends headers against XSS & Clickjacking)
  │
  ▼
[ CORS ]             (Enforces Cross-Origin Resource boundaries)
  │
  ▼
[ Rate Limiter ]     (Restricts excessive calls per IP)
  │
  ▼
[ JWT Authenticate ] (Extracts token, decodes user payload)
  │
  ▼
[ Input Validator ]  (Verifies schema models via Joi / Zod)
  │
  ▼
[ Router Callback ]  (Routes to target Controller -> Service)
  │
  ▼
[ Centralized Error] (Catches runtime errors & outputs JSON)
```

---

## 8. Security Audits & Centralized Logging

### Security Checklist
1.  **Helmet**: Configures security headers to prevent clickjacking and MIME sniff issues.
2.  **CORS Settings**: Blocks random domain calls (restrict origin scope to client domains).
3.  **bcrypt Salting**: Uses salt work factor of 10+ preventing dictionary decodes.
4.  **JWT Signing**: Uses strong `JWT_SECRET` key loaded from production environments.
5.  **Payload Validation**: Limits file parsing sizes inside Multer configurations (`limit: 50 * 1024 * 1024`).

### Log Registry (Winston/Pino)
All core operations log details using structured formats:
*   `info`: Record login events, file uploads, and review status alterations.
*   `warn`: Track rate-limit crossings or failed login tries.
*   `error`: Output stack traces on database connection drops or LLM timeouts.
