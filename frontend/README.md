# Frontend Setup Guide

## Installation

```bash
cd frontend
npm install
```

## Development

Run the frontend development server:

```bash
npm run dev
```

The app will start on `http://localhost:5173` and automatically proxy API calls to `http://localhost:3000`

## Building

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## How Users Interact

1. **Submit Channel**: Users enter their YouTube channel (@username or ID) and email
2. **Processing**: The backend processes the channel, fetches videos, generates titles via Gemini AI
3. **Results**: Users receive an email with improved titles and explanations

## Environment Setup

Make sure your backend is running:

```bash
# From root directory
npm run dev
```

The backend runs on `http://localhost:3000` and the frontend on `http://localhost:5173`

## Features

- 🎨 Modern, responsive dark theme UI
- ⚡ Real-time processing status
- 📧 Email delivery of results
- 🤖 AI-powered title generation
- 📱 Mobile-friendly interface
