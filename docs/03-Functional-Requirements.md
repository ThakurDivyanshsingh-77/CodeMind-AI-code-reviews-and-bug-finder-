# 03. Functional Requirements (FR Catalog)

This document contains the complete and detailed Functional Requirements (FR) specification for **CodeMind AI**, mapped by system modules.

---

## 1. Authentication Module

### FR-01: User Registration
*   **Description**: The system must allow users to register an account using Name, Email, and Password.
*   **Input**: String values for `name`, `email`, and `password`.
*   **Validation**: Email must follow valid RFC 5322 syntax; password strength must be checked.

### FR-02: User Login
*   **Description**: The system must allow registered users to authenticate using their Email and Password.
*   **Input**: Email and password.
*   **Action**: Validate against database credentials and return a secure JSON Web Token (JWT).

### FR-03: Google OAuth Login
*   **Description**: The system must allow users to authenticate using their Google Account identity credentials.
*   **Action**: Integrate Google OAuth 2.0 flow to create/login users without passwords.

### FR-04: Secure Logout
*   **Description**: The system must allow active users to log out safely, invalidating or clearing client-side JWT storage.

---

## 2. Project Management Module

### FR-05: ZIP Project Upload
*   **Description**: Users must be able to upload local project archives.
*   **Constraint**: Limit size to 50MB. Rejects invalid file signatures.

### FR-06: GitHub Repository Integration
*   **Description**: Users must be able to clone public repositories via standard Git clone URLs, or link private repos via active OAuth access tokens.

### FR-07: Supported Programming Languages Validation
*   **Description**: The system must validate files on upload or repository clone, filtering out file formats not supported by the AI review engine.
*   **Supported Languages**: JavaScript, TypeScript, Python, Java, C++, Go, C#, Rust.

### FR-08: ZIP Archive Decompressor
*   **Description**: The backend must extract uploaded ZIP archives securely, parsing files into memory or directory structures for code indexing.

### FR-09: Projects Explorer Dashboard
*   **Description**: The UI must retrieve and display the list of all projects uploaded by the logged-in user.

---

## 3. AI Code Review Engine Module

### FR-10: Automated Bug Detection
*   **Description**: The AI Service must scan codebase source structures to detect syntax mistakes, logical bugs, and dead-code anti-patterns.

### FR-11: Security Vulnerability Identification
*   **Description**: The AI Engine must flag security vulnerabilities matching OWASP Top 10 guidelines (e.g., SQL Injection, XSS, hardcoded credentials).

### FR-12: Performance Optimization Suggestions
*   **Description**: The AI must detect CPU-heavy operations, unoptimized memory code patterns, database connection leaks, and suggest fixes.

### FR-13: Code Quality Score Calculator
*   **Description**: The AI service must compile code metrics and calculate an overall quality score between `0` and `100` points.

### FR-14: plain Language Code Explanations
*   **Description**: The AI engine must analyze selected complex modules or algorithms, returning plain-language summaries of what the code does.

### FR-15: Refactoring Opportunity Recommendations
*   **Description**: The system must provide direct refactoring samples showing "Before vs. After" code blocks.

---

## 4. Dashboard Module

### FR-16: Total Reviews Counter
*   **Description**: Display the cumulative number of reviews executed under the user account.

### FR-17: Recent Projects List
*   **Description**: Display the three most recently updated projects on the home screen.

### FR-18: Review History Logs
*   **Description**: List all historic reviews with project names, date of review, score, and actions to view details.

### FR-19: Analytics Charts
*   **Description**: The UI must display overall, security, and performance scores using interactive charts (e.g., radar or bar charts).

---

## 5. Reports Module

### FR-20: PDF Report Generator
*   **Description**: Users must be able to export a complete review (scores, findings, bugs lists) as a printable, professional PDF document.

### FR-21: HTML Report Exporter
*   **Description**: Allow users to download reviews formatted as a standalone responsive HTML file.

### FR-22: JSON Report Exporter
*   **Description**: Allow developers to download raw review payload data in JSON format for external parsing.

---

## 6. AI Chat Module

### FR-23: Code Review Q&A Assistant
*   **Description**: Provide an interactive conversation chat box for users to ask specific questions about lines of code flagged in the review.

### FR-24: Conversation History Logging
*   **Description**: The database must persist messages sent within a chat session under the specific `reviewId`.

---

## 7. User Profile Module

### FR-25: Profile Management
*   **Description**: Users must be able to edit their display name, profile avatar, and linked GitHub usernames.

### FR-26: Password Modification
*   **Description**: Users must be able to modify their system access passwords by verifying their old password first.
