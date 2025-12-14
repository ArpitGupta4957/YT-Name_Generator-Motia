import { useState, useEffect } from 'react'
import { Loader, CheckCircle, AlertCircle, Mail, Sparkles } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

export default function App() {
  const [channel, setChannel] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null) // 'success', 'error', 'processing'
  const [jobId, setJobId] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  // Auto-transition from processing to success after 8 seconds
  useEffect(() => {
    if (status === 'processing') {
      const timer = setTimeout(() => setStatus('success'), 8000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const handleReset = () => {
    setStatus(null)
    setJobId(null)
    setError(null)
    setMessage(null)
    setChannel('')
    setEmail('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    setError(null)
    setMessage(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/submit`, {
        channel: channel.trim(),
        email: email.trim(),
      })

      if (response.status === 202) {
        setJobId(response.data.jobId)
        setStatus('processing')
        setMessage(response.data.message)
        setChannel('')
        setEmail('')
      }
    } catch (err) {
      setStatus('error')
      setError(err.response?.data?.error || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">YouTube Title Generator</h1>
          </div>
          <p className="text-slate-400 mt-2">
            Powered by coolDev AI • Get better titles in seconds
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {status === 'processing' && (
          <div className="mb-8 p-6 bg-blue-950 border border-blue-700 rounded-lg">
            <div className="flex items-start gap-4">
              <Loader className="w-6 h-6 text-blue-400 animate-spin flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Processing Your Request</h3>
                <p className="text-blue-200 mb-3">{message}</p>
                <div className="bg-slate-900/50 p-3 rounded font-mono text-sm text-blue-300">
                  Job ID: {jobId}
                </div>
                <p className="text-blue-300 text-sm mt-3">
                  ⏳ Processing will complete in ~8 seconds...
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="mb-8 p-6 bg-green-950 border border-green-700 rounded-lg">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Sent! ✓</h3>
                <p className="text-green-200 mb-2">Your improved YouTube titles have been generated and sent to your email.</p>
                <p className="text-green-300 text-sm mb-4">📧 Check your inbox for the results with improved titles and explanations.</p>
                <div className="bg-slate-900/50 p-3 rounded font-mono text-sm text-green-300 mb-4">
                  Job ID: {jobId}
                </div>
                <button
                  onClick={handleReset}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                >
                  Generate More Titles
                </button>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-8 p-6 bg-red-950 border border-red-700 rounded-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Error</h3>
                <p className="text-red-200 mb-4">{error}</p>
                <button
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        {status !== 'success' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-8 py-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Get AI-Generated Titles
            </h2>
            <p className="text-slate-400 mt-2">
              Submit your YouTube channel and receive improved titles tailored for higher CTR and SEO
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Channel Input */}
            <div>
              <label htmlFor="channel" className="block text-sm font-medium text-slate-300 mb-2">
                YouTube Channel (@username or ID)
              </label>
              <input
                id="channel"
                type="text"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="@chaiaurcode or UCxxxxxx"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
                required
              />
              <p className="text-slate-400 text-xs mt-2">
                Enter with @ prefix (e.g., @username) or channel ID
              </p>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
                  required
                />
              </div>
              <p className="text-slate-400 text-xs mt-2">
                We'll email you the improved titles
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || status === 'processing'}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center gap-2"
            >
              {loading || status === 'processing' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Better Titles
                </>
              )}
            </button>
          </form>
        </div>
        )}

        {/* Features Section */}
        {status !== 'success' && (
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-slate-400 text-sm">
              Google Gemini AI analyzes your titles and generates SEO-optimized alternatives
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Loader className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Fast Processing</h3>
            <p className="text-slate-400 text-sm">
              Event-driven backend processes your channel and generates titles in seconds
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Email Delivery</h3>
            <p className="text-slate-400 text-sm">
              Get beautifully formatted results delivered to your inbox with explanations
            </p>
          </div>
        </div>
        )}

        {/* How It Works */}
        {status !== 'success' && (
        <div className="mt-12 bg-slate-800 rounded-xl border border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-500 text-slate-900 font-bold">1</div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Submit Your Channel</h4>
                <p className="text-slate-400">Provide your YouTube channel name or ID along with your email</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-500 text-slate-900 font-bold">2</div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">We Fetch Your Videos</h4>
                <p className="text-slate-400">Our system retrieves your latest 5 videos from YouTube</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-500 text-slate-900 font-bold">3</div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">AI Analyzes & Improves</h4>
                <p className="text-slate-400">Google Gemini generates better titles optimized for clicks and SEO</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-500 text-slate-900 font-bold">4</div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Receive Email Results</h4>
                <p className="text-slate-400">Get formatted results with rationale for each improvement</p>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 mt-16 py-8 text-center text-slate-400">
        <p>Built with ❤️ • Powered by CoolDev Minds</p>
      </div>
    </div>
  )
}
