# YouTube Title Generator - Complete SaaS

## 🚀 Project Overview

A complete **SaaS application** for AI-powered YouTube title optimization:

- **Backend**: Event-driven Motia system that processes channels and generates titles
- **Frontend**: Modern React UI for users to submit channels and view results

## 📁 Project Structure

```
YT-Name_Generator-Motia/
├── steps/                    # Backend event workflows
│   ├── submit.step.ts       # API endpoint to accept user submissions
│   ├── resolve_channel.step.ts    # Resolve YouTube channel
│   ├── fetch_video.step.ts        # Fetch latest videos
│   ├── ai-title.step.ts           # Generate titles with Gemini AI
│   ├── send_email.step.ts         # Email results
│   └── error_handelr.step.ts      # Error handling
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── App.jsx          # Main UI component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Styles
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   └── tailwind.config.js   # Tailwind CSS config
├── motia.config.ts          # Motia backend config
├── package.json             # Backend dependencies
└── README.md                # This file
```

## 🛠️ Tech Stack

**Backend:**
- Motia (event-driven framework)
- TypeScript
- Express/Node.js
- Google Gemini AI
- Resend (email service)
- YouTube API

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios
- Lucide Icons

## 🚀 Quick Start

### Backend Setup

```bash
# Install dependencies
npm install

# Set up environment variables
export YOUTUBE_API_KEY="your-yt-api-key"
export OPENAI_API_KEY="your-openai-key" # or GEMINI_API_KEY
export RESEND_API_KEY="your-resend-key"
export RESEND_FROM_EMAIL="noreply@example.com"

# Start backend
npm run dev
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📊 User Flow

```
User → Frontend Form
  ↓
POST /submit (channel, email)
  ↓
Backend: ResolveChannel (YouTube API)
  ↓
Backend: FetchVideos (Get latest 5 videos)
  ↓
Backend: GenerateTitles (Gemini AI)
  ↓
Backend: SendEmail (Resend)
  ↓
User receives email with improved titles
```

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
YOUTUBE_API_KEY=your_youtube_data_api_key
GEMINI_API_KEY=your_google_gemini_api_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## 📧 Email Configuration

The system uses Resend for email delivery. Configure:
- `RESEND_API_KEY`: Your Resend API key
- `RESEND_FROM_EMAIL`: Email address to send from (verified in Resend)

## 🎨 Frontend Features

✅ Beautiful dark theme UI
✅ Real-time status updates
✅ Email validation
✅ Loading states
✅ Error handling
✅ Mobile responsive
✅ Accessibility features

## 🔄 How It Works (User Perspective)

1. User visits frontend at `localhost:5173`
2. Enters YouTube channel (@username or ID)
3. Provides email address
4. Clicks "Generate Better Titles"
5. Backend processes:
   - Resolves channel to ID
   - Fetches latest 5 videos
   - Uses Gemini AI to generate improved titles
   - Sends formatted email with results
6. User receives email with:
   - Original title
   - Improved title
   - Why the improvement works
   - Video URL

## 📈 Scalability

- Event-driven architecture handles concurrent requests
- State management via Redis (BullMQ)
- Async processing prevents blocking
- Email delivery decoupled from request
- Error recovery with retry mechanisms

## 🛡️ Error Handling

- Invalid channel validation
- API key checks
- Network error recovery
- User-friendly error messages
- Email delivery failures handled

## 🚢 Deployment

### Backend (Motia)
- Deploy to any Node.js hosting (Heroku, Railway, AWS, etc.)
- Set environment variables on host
- Use `npm run build` for production

### Frontend (React + Vite)
- Build: `npm run build`
- Deploy `dist/` folder to CDN or static host
- Update `API_BASE_URL` in `App.jsx` for production API

## 📝 License

MIT

---

**Ready to get better YouTube titles?** 🚀
