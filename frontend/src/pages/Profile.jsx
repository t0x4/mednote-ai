import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import {
  User, Mail, Stethoscope, Save, Loader2, CheckCircle2,
  BarChart3, Clock, Activity, TrendingUp
} from 'lucide-react'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    specialization: user?.specialization || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [stats, setStats] = useState({ totalSessions: 0, timeSaved: 0 })

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', specialization: user.specialization || '' })
    }
  }, [user])

  useEffect(() => {
    axios.get('/api/history')
      .then(res => {
        const sessions = Array.isArray(res.data) ? res.data : res.data.sessions || res.data.history || []
        const totalSessions = sessions.length
        const timeSaved = sessions.reduce((acc, s) => {
          if (typeof s.duration === 'number') return acc + Math.round(s.duration * 2.5)
          return acc + 300
        }, 0)
        setStats({ totalSessions, timeSaved })
      })
      .catch(() => {})
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      const res = await axios.put('/api/auth/profile', form)
      updateUser(res.data.user || res.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }

  const formatTimeSaved = (seconds) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${(seconds / 3600).toFixed(1)}h`
  }

  const specializations = ['Therapist', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Surgeon', 'Other']

  return (
    <div className="min-h-screen bg-dark bg-grid-pattern flex">
      <Sidebar />

      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <User className="w-6 h-6 text-neon-cyan" /> Profile
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage your account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2 glass-card neon-border p-6">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Account Information</h2>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-neon-cyan">
                  {(user?.name || 'D').charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{user?.name || 'Doctor'}</h3>
                <p className="text-white/40 text-sm flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {user?.email || ''}
                </p>
                {user?.specialization && (
                  <p className="text-neon-cyan/70 text-xs mt-1 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" /> {user.specialization}
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-dark pl-11"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Specialization</label>
                <div className="relative">
                  <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <select
                    value={form.specialization}
                    onChange={(e) => setForm(prev => ({ ...prev, specialization: e.target.value }))}
                    className="input-dark pl-11 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select specialization</option>
                    {specializations.map(s => (
                      <option key={s} value={s} className="bg-dark text-white">{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-neon flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-neon-green" /> Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="glass-card neon-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Total Sessions</p>
                  <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
                </div>
              </div>
            </div>

            <div className="glass-card neon-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Time Saved</p>
                  <p className="text-2xl font-bold text-white">{formatTimeSaved(stats.timeSaved)}</p>
                </div>
              </div>
            </div>

            <div className="glass-card neon-border p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-neon-purple" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">AI Usage</p>
                  <p className="text-sm text-white/60">{Math.min(stats.totalSessions, 100)} / 100</p>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-1000"
                  style={{ width: `${Math.min(stats.totalSessions, 100)}%` }}
                />
              </div>
            </div>

            <div className="glass-card neon-border p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Efficiency</p>
                  <p className="text-2xl font-bold text-neon-green">
                    {stats.totalSessions > 0 ? '+' + Math.round((stats.timeSaved / Math.max(stats.totalSessions, 1)) / 60) + 'm' : '--'}
                  </p>
                  <p className="text-white/30 text-[10px]">avg per session</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
