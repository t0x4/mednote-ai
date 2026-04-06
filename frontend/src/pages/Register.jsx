import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Activity, Loader2, Mail, Lock, User, Stethoscope } from 'lucide-react'

const specializations = [
  'Therapist',
  'Cardiologist',
  'Neurologist',
  'Pediatrician',
  'Surgeon',
  'Other',
]

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    specialization: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const updateField = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await register({
        name: form.name,
        email: form.email,
        specialization: form.specialization,
        password: form.password,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark bg-grid-pattern flex items-center justify-center p-4">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in">
        <div className="glass-card neon-border p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-green/20 border border-neon-cyan/40 flex items-center justify-center mb-4" style={{ animation: 'pulse-neon 3s ease-in-out infinite' }}>
              <Activity className="w-8 h-8 text-neon-cyan" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-white/40 text-sm mt-1">Join MedNote AI</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-neon-red/10 border border-neon-red/30 text-neon-red text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={form.name}
                  onChange={updateField('name')}
                  className="input-dark pl-11"
                  placeholder="Dr. Jane Smith"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                  className="input-dark pl-11"
                  placeholder="doctor@clinic.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Specialization</label>
              <div className="relative">
                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <select
                  value={form.specialization}
                  onChange={updateField('specialization')}
                  className="input-dark pl-11 appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select specialization</option>
                  {specializations.map(s => (
                    <option key={s} value={s} className="bg-dark text-white">{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  value={form.password}
                  onChange={updateField('password')}
                  className="input-dark pl-11"
                  placeholder="Min 6 characters"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={updateField('confirmPassword')}
                  className="input-dark pl-11"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-neon w-full flex items-center justify-center gap-2 py-3 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
