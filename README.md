<div align="center">

<!-- Animated Typing Header -->
<a href="https://github.com/">
  <img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=38&duration=3000&pause=1000&color=D4AF37&center=true&vCenter=true&width=650&lines=AI+Code+Reviewer;Ship+Cleaner+Code%2C+Faster;Powered+by+Gemini+%26+GPT-4;Bugs+Don't+Stand+a+Chance." alt="Typing SVG" />
</a>

<br/>

<!-- Animated top wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0A0F1F,100:D4AF37&height=180&section=header&text=&fontSize=0" width="100%"/>

### 🧠 An industry-standard, AI-driven Code Review platform
Upload a ZIP or import a GitHub repo — get instant bug, security & performance analysis with an interactive AI chat to fix it all.

<br/>

<!-- Badges -->
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=D4AF37)
![Node.js](https://img.shields.io/badge/Node.js-0A0F1F?style=for-the-badge&logo=node.js&logoColor=D4AF37)
![FastAPI](https://img.shields.io/badge/FastAPI-0A0F1F?style=for-the-badge&logo=fastapi&logoColor=D4AF37)
![MongoDB](https://img.shields.io/badge/MongoDB-0A0F1F?style=for-the-badge&logo=mongodb&logoColor=D4AF37)
![TypeScript](https://img.shields.io/badge/TypeScript-0A0F1F?style=for-the-badge&logo=typescript&logoColor=D4AF37)
![License](https://img.shields.io/badge/LICENSE-MIT-D4AF37?style=for-the-badge)

<br/>

<img src="https://img.shields.io/github/stars/your-username/ai-code-reviewer?style=social" />
<img src="https://img.shields.io/github/forks/your-username/ai-code-reviewer?style=social" />
<img src="https://img.shields.io/github/issues/your-username/ai-code-reviewer?color=D4AF37" />
<img src="https://img.shields.io/github/last-commit/your-username/ai-code-reviewer?color=D4AF37" />

<br/><br/>

[🚀 Live Demo](https://code-mind-ai-code-reviews-and-bug-f.vercel.app/) · [📖 Documentation](./docs/assets/CodeMind Code Audit Report.pdf) · [🐛 Report Bug](#) · [✨ Request Feature](#)

</div>

<br/>

---

## 📌 Table of Contents

- [About The Project](#-about-the-project)
- [Screenshots & Preview](#-screenshots--preview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About The Project

**AI Code Reviewer** is an automated code review platform that lets developers upload project archives (ZIP) or import GitHub repositories directly to get comprehensive, AI-driven reviews — identifying bugs, security vulnerabilities, and performance bottlenecks — complete with an interactive AI chat to ask questions about code fixes.

> Built for developers who want senior-engineer-level code review, on demand, in seconds.

<br/>

## 🖼️ Screenshots & Preview

<div align="center">

### 🏠 Dashboard
<img src="./docs/assets/dashboard.png" alt="Dashboard Screenshot" width="90%"/>

<br/><br/>

### 📊 Review Report
<img src="./docs/assets/report.png" alt="Review Report Screenshot" width="90%"/>

<br/><br/>

<table>
  <tr>
    <td align="center" width="50%">
      <b>💬 AI Chat</b><br/>
      <img src="./docs/assets/ai-chat.png" alt="AI Chat Screenshot" width="100%"/>
    </td>
    <td align="center" width="50%">
      <b>🔐 Authentication</b><br/>
      <img src="./docs/assets/auth.png" alt="Auth Screenshot" width="100%"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <b>📁 GitHub Import</b><br/>
      <img src="./docs/assets/github-import.png" alt="GitHub Import Screenshot" width="100%"/>
    </td>
    <td align="center" width="50%">
      <b>📄 PDF Export</b><br/>
      <img src="./docs/assets/pdf-export.png" alt="PDF Export Screenshot" width="100%"/>
    </td>
  </tr>
</table>

<br/>

### 🎬 Landing Page Hero
<img src="./docs/assets/landing.png" alt="Landing Page Hero" width="90%"/>

</div>

> 💡 **Tip:** Drop your screenshots inside `docs/assets/` with the exact filenames above, and they'll render automatically. Add more `<tr>` rows to the table for extra screens.

<br/>

## ✨ Key Features

| | Feature | Description |
|---|---|---|
| 🔐 | **Secure Authentication** | JWT & GitHub OAuth for secure user session management |
| 📦 | **Dual Ingestion** | Upload ZIP archives or clone/parse GitHub repos directly |
| 🧠 | **Deep AI Analysis** | Parses source files, sends smart context to Gemini / GPT-4 |
| 💬 | **Interactive AI Chat** | Ask follow-up questions on specific lines or fixes |
| 📊 | **Beautiful Dashboards** | Next.js + TypeScript UI with scorecards & detailed reports |
| 📤 | **Reports Export** | Downloadable PDF, HTML, and JSON summaries |

<br/>

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend** | ![Next.js](https://img.shields.io/badge/-Next.js-000?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/-React-20232A?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **Backend API** | ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000?style=flat-square&logo=express) |
| **AI Service** | ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) |
| **Database** | ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) |
| **AI Models** | Gemini Pro · OpenAI GPT-4 |
| **DevOps** | ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) |

</div>

<br/>

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌────────────────┐
│  Next.js UI  │ ───▶ │ Express API  │ ───▶ │ FastAPI Worker │
│  (Frontend)  │ ◀─── │  (Gateway)   │ ◀─── │  (AI Analysis) │
└─────────────┘      └──────────────┘      └────────────────┘
                             │                      │
                             ▼                      ▼
                      ┌──────────────┐      ┌────────────────┐
                      │  MongoDB     │      │ Gemini / GPT-4 │
                      │  Atlas       │      │      API       │
                      └──────────────┘      └────────────────┘
```

Full breakdown available in [`docs/06-System-Architecture.md`](./docs/06-System-Architecture.md).

<br/>

## 📁 Repository Structure

<details>
<summary><b>Click to expand full directory layout</b></summary>

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
│   │   ├── services/                # Integrations (AI, GitHub, Reports)
│   │   └── utils/                  # Logger, custom error classes, helpers
│   ├── app.js
│   └── server.js
│
├── ai-service/                     # Python FastAPI AI Worker
│   ├── main.py
│   ├── analyzer.py
│   ├── prompts.py
│   ├── parser.py
│   └── requirements.txt
│
├── docs/                           # Project Specs & API Docs
│   ├── assets/                     # 🖼️ Screenshots & GIFs go here
│   ├── system-design.md
│   ├── openapi.yaml
│   └── postman_collection.json
│
├── docker-compose.yml
└── README.md
```

</details>

<br/>

## ⚡ Getting Started

### Prerequisites
```bash
node >= 18.x
python >= 3.10
MongoDB Atlas URI
```

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/ai-code-reviewer.git
cd ai-code-reviewer

# 2. Install frontend dependencies
cd client && npm install

# 3. Install backend dependencies
cd ../server && npm install

# 4. Install AI service dependencies
cd ../ai-service && pip install -r requirements.txt

# 5. Set up environment variables
cp .env.example .env

# 6. Run with Docker (recommended)
docker-compose up --build
```

### Environment Variables

```env
MONGODB_URI=
JWT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GEMINI_API_KEY=
OPENAI_API_KEY=
```

<br/>

## 📚 API Reference

Full OpenAPI v3 spec available at [`docs/openapi.yaml`](./docs/openapi.yaml) — importable Postman collection at [`docs/postman_collection.json`](./docs/postman_collection.json).

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new user |
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/projects/upload` | Upload ZIP project |
| `POST` | `/api/projects/github` | Import GitHub repo |
| `GET` | `/api/reviews/:id` | Fetch review report |
| `POST` | `/api/chat/:reviewId` | Ask AI about a review |

<br/>

## 🗺️ Roadmap

- [x] JWT + GitHub OAuth
- [x] ZIP & GitHub repo ingestion
- [x] AI-powered analysis engine
- [x] PDF/HTML/JSON report export
- [ ] VS Code extension
- [ ] Real-time collaborative reviews
- [ ] Support for GitLab & Bitbucket
- [ ] Self-hosted LLM option

See [`docs/09-Project-Roadmap.md`](./docs/09-Project-Roadmap.md) for the full Gantt schedule.

<br/>

## 🤝 Contributing

Contributions make the open-source community amazing. Any contributions are **greatly appreciated**.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<br/>

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<br/>

## 📬 Contact

<div align="center">

Made with ❤️ and lots of ☕

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](#)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](#)
[![Portfolio](https://img.shields.io/badge/Portfolio-D4AF37?style=for-the-badge&logo=vercel&logoColor=white)](#)

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:D4AF37,100:0A0F1F&height=120&section=footer"/>

</div>
