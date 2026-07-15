# 04. Non-Functional Requirements (NFR Catalog)

This document contains the Non-Functional Requirements (NFR) governing the performance, security, and interface specifications of **CodeMind AI**.

---

## 1. NFR Directory

| ID | Requirement Area | Target Specification |
| :--- | :--- | :--- |
| **NFR-01** | Performance & Latency | AI review analysis compilation and dashboard loading must be completed within **30 seconds** for medium-sized projects (<50 files). |
| **NFR-02** | Availability | The backend REST APIs and Python worker services must maintain a minimum uptime of **99%**. |
| **NFR-03** | Data Security | User credentials and passwords must be hashed using the **bcrypt** hashing algorithm with a salt factor of 10+ before saving. |
| **NFR-04** | Authentication | Client sessions must be verified using secure, signed JSON Web Tokens (**JWT**). |
| **NFR-05** | Transmission Security | **HTTPS / TLS 1.3** encryption must be strictly enforced on all API connections in production environments. |
| **NFR-06** | System Integrity | **API Rate Limiting** must be configured globally to defend against Denial of Service (DoS) and scraping attacks. |
| **NFR-07** | Usability / UI | The frontend dashboard interface must be fully responsive across mobile screens, tablet devices, and standard desktops. |
| **NFR-08** | Scalability | System server architectures must handle at least **1,000 concurrent users** under load testing simulation. |
