# 🎥 AI-Powered YouTube Title Generator

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Gemini-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Event--Driven-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Language-TypeScript-yellow?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Workflow-Motia-orange?style=for-the-badge" />
</p>

<p align="center">
  <b>Automate YouTube title optimization using AI, event-driven workflows, and clean backend architecture.</b>
</p>

---

## 🚀 What is this project?

Creating a YouTube title isn’t just writing words —
it’s about **clicks, SEO, clarity, and curiosity**.

This project is an **AI-powered backend system** that automatically:

* Fetches a YouTube channel’s latest videos
* Analyzes existing titles
* Generates **better, high-CTR titles** using AI
* Explains *why* each new title works
* Emails the results directly to the user

All built with **real-world backend patterns**, not scripts.

---

## ✨ Key Features

✅ Accepts a YouTube channel name
✅ Fetches latest videos automatically
✅ AI-generated, SEO-friendly titles
✅ Clear rationale for every improvement
✅ Email-based delivery
✅ Event-driven & scalable
✅ Production-ready error handling

---

## 🧠 System Architecture (Visual Overview)

```
Client Request
     │
     ▼
API Trigger (Motia)
     │
     ▼
YouTube Data Fetch
     │
     ▼
AI Title Generator (Gemini)
     │
     ▼
Email Delivery
     │
     ▼
Job Completed ✅
```

---

## 🔄 Event-Driven Workflow (Step-by-Step)

```
yt.request.submitted
        ↓
yt.videos.fetched
        ↓
yt.titles.generated
        ↓
yt.email.sent
```

Each step:

* Runs independently
* Can fail safely
* Can be retried
* Is observable and scalable

---

## ⚙️ Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Motia-Workflow%20Engine-orange" />
  <img src="https://img.shields.io/badge/TypeScript-Backend-blue" />
  <img src="https://img.shields.io/badge/Gemini-AI-green" />
  <img src="https://img.shields.io/badge/YouTube-Data%20API-red" />
  <img src="https://img.shields.io/badge/Email-Resend-lightgrey" />
</p>

* **Motia** – Event-driven workflow engine
* **TypeScript** – Backend logic
* **Gemini AI** – Title optimization
* **YouTube Data API** – Video retrieval
* **Email Service** – Result delivery

---

## 📁 Project Structure

```
/events
 ├── submitRequest.ts
 ├── fetchVideos.ts
 ├── generateTitles.ts
 ├── sendEmail.ts
 └── errorHandler.ts

/state
 └── submissions

.env
README.md
```

---

## 🛠️ Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
EMAIL_API_KEY=your_email_service_key
```

---

## ▶️ Running the Project

```bash
npm install
npm run dev
```

Trigger the workflow by submitting a channel name and email.

---

## 🏗️ Why This Project Stands Out

✔️ Uses **event-driven backend architecture**
✔️ AI is integrated **as a system component**, not a gimmick
✔️ Clean separation of concerns
✔️ Scalable & extensible design
✔️ Built like a production service

This is the kind of architecture used in **real startups and platforms**.

---

## 🧪 Future Enhancements

* OpenAI ↔ Gemini automatic fallback
* Retry & backoff strategies
* Web dashboard for job tracking
* Support for thumbnails & descriptions
* Scheduled weekly title suggestions

---

## 🤝 Let’s Connect

Interested in:

* AI workflows 🤖
* Backend architecture 🏗️
* Building real products 🚀

Feel free to connect or contribute!

⭐ If you found this project helpful, consider starring the repo!
