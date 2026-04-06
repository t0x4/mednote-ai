import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import {
  Clock, Search, ChevronDown, ChevronUp, FileText,
  Loader2, Inbox, Stethoscope, CheckCircle2, AlertTriangle
} from 'lucide-react'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function History() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    axios.get('/api/history')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.sessions || res.data.history || []
        setSessions(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = sessions.filter(s => {
    if (!search) return true
    const q = search.toLowerCase()
    const transcript = (s.transcript || '').toLowerCase()
    const patientLabel = (s.patientLabel || s.patient || '').toLowerCase()
    return transcript.includes(q) || patientLabel.includes(q)
  })

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-dark bg-grid-pattern flex">
      <Sidebar />

      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Clock className="w-6 h-6 text-neon-cyan" /> Session History
            </h1>
            <p className="text-white/40 text-sm mt-1">{sessions.length} recorded sessions</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-11"
              placeholder="Search sessions..."
            />
          </div>
        </div>

        {/* Sessions */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Inbox className="w-16 h-16 text-white/10 mb-4" />
            <h3 className="text-white/40 text-lg font-medium">
              {search ? 'No matching sessions' : 'No sessions yet'}
            </h3>
            <p className="text-white/20 text-sm mt-1">
              {search ? 'Try a different search term' : 'Record a consultation to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((session, index) => {
              const id = session._id || session.id || index
              const isExpanded = expandedId === id
              const result = session.result || session.analysis || {}
              const soapNote = result.structuredNote || result.soap || result.note || null
              const diagnoses = result.diagnoses || result.diagnosis || []
              const recommendations = result.recommendations || result.treatment || []

              return (
                <div
                  key={id}
                  className="glass-card neon-border overflow-hidden transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleExpand(id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-neon-cyan" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {session.patientLabel || session.patient || `Session #${sessions.length - index}`}
                        </p>
                        <p className="text-white/30 text-xs mt-0.5">{formatDate(session.createdAt || session.date || new Date())}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {session.duration && (
                        <span className="text-white/30 text-xs font-mono">{typeof session.duration === 'number' ? `${Math.floor(session.duration / 60)}:${(session.duration % 60).toString().padStart(2, '0')}` : session.duration}</span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-white/30" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/30" />
                      )}
                    </div>
                  </button>

                  {/* Transcript preview when collapsed */}
                  {!isExpanded && session.transcript && (
                    <div className="px-5 pb-4">
                      <p className="text-white/30 text-xs line-clamp-2">{session.transcript}</p>
                    </div>
                  )}

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-glass-border p-5 space-y-4">
                      {/* Transcript */}
                      {session.transcript && (
                        <div>
                          <h4 className="text-xs font-semibold text-neon-cyan uppercase tracking-wider mb-2 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Transcript
                          </h4>
                          <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                            {session.transcript}
                          </p>
                        </div>
                      )}

                      {/* SOAP Note */}
                      {soapNote && (
                        <div>
                          <h4 className="text-xs font-semibold text-neon-cyan uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Stethoscope className="w-3 h-3" /> Medical Note
                          </h4>
                          {typeof soapNote === 'object' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {Object.entries(soapNote).map(([key, value]) => (
                                <div key={key} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                  <span className="text-[10px] text-neon-cyan/70 uppercase tracking-widest font-bold">{key}</span>
                                  <p className="text-white/60 text-xs mt-1">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-white/60 text-sm p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] whitespace-pre-wrap">{soapNote}</p>
                          )}
                        </div>
                      )}

                      {/* Diagnoses */}
                      {Array.isArray(diagnoses) && diagnoses.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-neon-purple uppercase tracking-wider mb-2">Diagnoses</h4>
                          <div className="flex flex-wrap gap-2">
                            {diagnoses.map((d, i) => (
                              <span key={i} className="px-3 py-1 rounded-full text-xs bg-neon-purple/10 border border-neon-purple/30 text-neon-purple">
                                {typeof d === 'object' ? d.name || d.diagnosis || JSON.stringify(d) : d}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      {Array.isArray(recommendations) && recommendations.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-neon-green uppercase tracking-wider mb-2">Recommendations</h4>
                          <ul className="space-y-1">
                            {recommendations.map((r, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                                <CheckCircle2 className="w-3.5 h-3.5 text-neon-green flex-shrink-0 mt-0.5" />
                                <span>{typeof r === 'object' ? r.text || r.recommendation || JSON.stringify(r) : r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Raw result fallback */}
                      {!soapNote && Object.keys(result).length > 0 && (
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                          <pre className="text-white/50 text-xs whitespace-pre-wrap font-mono">{JSON.stringify(result, null, 2)}</pre>
                        </div>
                      )}

                      <div className="pt-2">
                        <div className="p-3 rounded-lg bg-neon-red/5 border border-neon-red/15 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-neon-red/60 flex-shrink-0 mt-0.5" />
                          <p className="text-[10px] text-white/40">AI suggestions are not a substitute for professional medical judgment.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
