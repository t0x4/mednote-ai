import { useState, useMemo } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import useRecorder from '../hooks/useRecorder'
import {
  Mic, Square, Loader2, FileText, Stethoscope, ClipboardList,
  CheckCircle2, AlertTriangle, Clock, TrendingUp, RotateCcw
} from 'lucide-react'

const STATUS_MAP = {
  idle: { label: 'Ready', color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30' },
  recording: { label: 'Recording', color: 'text-neon-red', bg: 'bg-neon-red/10', border: 'border-neon-red/30' },
  processing: { label: 'Processing', color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/30' },
  complete: { label: 'Complete', color: 'text-neon-cyan', bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/30' },
  error: { label: 'Error', color: 'text-neon-red', bg: 'bg-neon-red/10', border: 'border-neon-red/30' },
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function WaveformBars({ active }) {
  return (
    <div className="flex items-center justify-center gap-1 h-10 my-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-300 ${
            active ? 'bg-neon-red' : 'bg-white/10'
          }`}
          style={{
            height: active ? undefined : '8px',
            animation: active ? `waveform ${0.5 + Math.random() * 0.8}s ease-in-out ${Math.random() * 0.5}s infinite` : 'none',
          }}
        />
      ))}
    </div>
  )
}

function ConfidenceCircle({ value }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const color = value >= 80 ? '#00ff88' : value >= 60 ? '#00f0ff' : '#ff4a6e'

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={radius} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute text-xl font-bold text-white">{value}%</span>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { isRecording, duration, audioBlob, startRecording, stopRecording, resetRecording } = useRecorder()

  const [status, setStatus] = useState('idle')
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleRecord = async () => {
    if (isRecording) {
      stopRecording()
    } else {
      setError('')
      setTranscript('')
      setResult(null)
      try {
        await startRecording()
        setStatus('recording')
      } catch (err) {
        setError(err.message)
        setStatus('error')
      }
    }
  }

  // Process audio after recording stops
  const processedBlobRef = useMemo(() => ({ current: null }), [])

  // Watch for audioBlob changes to trigger processing
  if (audioBlob && audioBlob !== processedBlobRef.current && !isRecording) {
    processedBlobRef.current = audioBlob
    processAudio(audioBlob)
  }

  async function processAudio(blob) {
    setStatus('processing')
    setError('')

    try {
      // Step 1: Transcribe
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')
      const transcribeRes = await axios.post('/api/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const transcriptText = transcribeRes.data.transcript || transcribeRes.data.text || ''
      setTranscript(transcriptText)

      // Step 2: Analyze
      const analyzeRes = await axios.post('/api/analyze', { transcript: transcriptText })
      const analysisResult = analyzeRes.data
      setResult(analysisResult)
      setStatus('complete')

      // Step 3: Save to history
      try {
        await axios.post('/api/history', {
          transcript: transcriptText,
          result: analysisResult,
          duration: duration,
        })
      } catch {
        // Silent fail for history save
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Processing failed')
      setStatus('error')
    }
  }

  const handleReset = () => {
    resetRecording()
    setStatus('idle')
    setTranscript('')
    setResult(null)
    setError('')
    processedBlobRef.current = null
  }

  const statusInfo = STATUS_MAP[status]
  const soapNote = result?.structuredNote || result?.soap || result?.note || null
  const diagnoses = result?.diagnoses || result?.diagnosis || []
  const recommendations = result?.recommendations || result?.treatment || []
  const confidence = result?.confidenceScore ?? result?.confidence ?? null
  const timeSaved = result?.timeSaved || result?.time_saved || null

  return (
    <div className="min-h-screen bg-dark bg-grid-pattern flex">
      <Sidebar />

      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome, Dr. {user?.name || 'Doctor'}
            </h1>
            <p className="text-white/40 text-sm mt-1">AI-powered medical documentation assistant</p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
            <span className={`w-2 h-2 rounded-full ${statusInfo.color === 'text-neon-red' ? 'bg-neon-red' : statusInfo.color === 'text-neon-green' ? 'bg-neon-green' : statusInfo.color === 'text-neon-purple' ? 'bg-neon-purple' : 'bg-neon-cyan'} ${status === 'recording' ? 'animate-pulse' : ''}`} />
            {statusInfo.label}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-neon-red/10 border border-neon-red/30 text-neon-red text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recorder Panel */}
          <div className="glass-card neon-border p-6 flex flex-col items-center">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Mic className="w-4 h-4" /> Voice Recorder
            </h2>

            {/* Record Button */}
            <button
              onClick={handleRecord}
              disabled={status === 'processing'}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                isRecording
                  ? 'recording-btn border-neon-red bg-neon-red/10'
                  : 'border-neon-cyan/40 bg-neon-cyan/5 hover:bg-neon-cyan/10 hover:border-neon-cyan/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'
              } ${status === 'processing' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {status === 'processing' ? (
                <Loader2 className="w-10 h-10 text-neon-purple animate-spin" />
              ) : isRecording ? (
                <Square className="w-8 h-8 text-neon-red" />
              ) : (
                <Mic className="w-10 h-10 text-neon-cyan" />
              )}
            </button>

            <p className="text-white/40 text-xs mt-3 uppercase tracking-wider">
              {status === 'processing' ? 'Processing...' : isRecording ? 'Tap to stop' : 'Tap to record'}
            </p>

            {/* Timer */}
            <div className="text-3xl font-mono text-white/80 mt-4 tracking-widest">
              {formatTime(duration)}
            </div>

            {/* Waveform */}
            <WaveformBars active={isRecording} />

            {/* Reset button */}
            {status === 'complete' && (
              <button onClick={handleReset} className="btn-neon mt-4 flex items-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4" /> New Recording
              </button>
            )}
          </div>

          {/* Transcript Panel */}
          <div className="glass-card neon-border p-6 flex flex-col">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Transcript
            </h2>

            <div className="flex-1 overflow-auto min-h-[200px]">
              {transcript ? (
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{transcript}</p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FileText className="w-12 h-12 text-white/10 mb-3 animate-float" />
                  <p className="text-white/30 text-sm">Waiting for recording...</p>
                  <p className="text-white/15 text-xs mt-1">Your transcript will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Result Panel */}
          <div className="glass-card neon-border p-6 flex flex-col lg:col-span-1">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" /> Analysis Results
            </h2>

            {result ? (
              <div className="flex-1 overflow-auto space-y-4">
                {/* Confidence + Time Saved */}
                <div className="flex items-center gap-4">
                  {confidence !== null && (
                    <div className="flex flex-col items-center">
                      <ConfidenceCircle value={typeof confidence === 'number' ? confidence : parseInt(confidence)} />
                      <span className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">Confidence</span>
                    </div>
                  )}
                  {timeSaved && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neon-green/10 border border-neon-green/20">
                      <Clock className="w-4 h-4 text-neon-green" />
                      <span className="text-neon-green text-sm font-medium">{timeSaved}</span>
                    </div>
                  )}
                </div>

                {/* SOAP Note */}
                {soapNote && (
                  <div>
                    <h3 className="text-xs font-semibold text-neon-cyan uppercase tracking-wider mb-2 flex items-center gap-1">
                      <ClipboardList className="w-3 h-3" /> Medical Note (SOAP)
                    </h3>
                    {typeof soapNote === 'object' ? (
                      <div className="space-y-2">
                        {Object.entries(soapNote).map(([key, value]) => (
                          <div key={key} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                            <span className="text-[10px] text-neon-cyan/70 uppercase tracking-widest font-bold">{key}</span>
                            <p className="text-white/70 text-xs mt-1 leading-relaxed">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-white/70 text-xs leading-relaxed whitespace-pre-wrap">{soapNote}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Diagnoses */}
                {((Array.isArray(diagnoses) && diagnoses.length > 0) || (typeof diagnoses === 'string' && diagnoses)) && (
                  <div>
                    <h3 className="text-xs font-semibold text-neon-purple uppercase tracking-wider mb-2">Diagnoses</h3>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(diagnoses) ? diagnoses : [diagnoses]).map((d, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs bg-neon-purple/10 border border-neon-purple/30 text-neon-purple">
                          {typeof d === 'object' ? d.name || d.diagnosis || JSON.stringify(d) : d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {((Array.isArray(recommendations) && recommendations.length > 0) || (typeof recommendations === 'string' && recommendations)) && (
                  <div>
                    <h3 className="text-xs font-semibold text-neon-green uppercase tracking-wider mb-2">Recommendations</h3>
                    <ul className="space-y-1">
                      {(Array.isArray(recommendations) ? recommendations : [recommendations]).map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neon-green flex-shrink-0 mt-0.5" />
                          <span>{typeof r === 'object' ? r.text || r.recommendation || JSON.stringify(r) : r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Raw result fallback */}
                {!soapNote && !Array.isArray(diagnoses) && typeof diagnoses !== 'string' && (
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <pre className="text-white/60 text-xs whitespace-pre-wrap font-mono">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="mt-4 p-3 rounded-lg bg-neon-red/5 border border-neon-red/15 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-neon-red/60 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    AI suggestions are not a substitute for professional medical judgment. Always verify before clinical use.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <TrendingUp className="w-12 h-12 text-white/10 mb-3 animate-float" />
                <p className="text-white/30 text-sm">No results yet</p>
                <p className="text-white/15 text-xs mt-1">Record a consultation to get AI analysis</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
