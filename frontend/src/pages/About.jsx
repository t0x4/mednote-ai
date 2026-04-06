import { Link } from 'react-router-dom'
import {
  Activity, Mic, FileText, Brain, Shield, Clock, Zap,
  Lock, ChevronRight, Stethoscope, CheckCircle2, AlertTriangle
} from 'lucide-react'

const steps = [
  {
    icon: Mic,
    title: 'Record',
    desc: 'Capture patient consultations with one-click voice recording',
    color: 'neon-cyan',
  },
  {
    icon: FileText,
    title: 'Transcribe',
    desc: 'AI-powered speech-to-text converts audio to accurate transcripts',
    color: 'neon-purple',
  },
  {
    icon: Brain,
    title: 'Analyze',
    desc: 'AI generates SOAP notes, diagnoses, and treatment recommendations',
    color: 'neon-green',
  },
]

const benefits = [
  { icon: Clock, text: 'Save 2-3 hours daily on documentation', color: 'neon-cyan' },
  { icon: Shield, text: 'HIPAA-aware design principles', color: 'neon-green' },
  { icon: Zap, text: 'Real-time transcription and analysis', color: 'neon-purple' },
  { icon: Stethoscope, text: 'SOAP-formatted clinical notes', color: 'neon-cyan' },
  { icon: CheckCircle2, text: 'Evidence-based recommendations', color: 'neon-green' },
  { icon: Lock, text: 'Secure data handling', color: 'neon-purple' },
]

const techStack = [
  'React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'OpenAI', 'Whisper API', 'MediaRecorder API'
]

export default function About() {
  return (
    <div className="min-h-screen bg-dark bg-grid-pattern">
      {/* Background effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[128px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/30 to-neon-green/30 border border-neon-cyan/40 flex items-center justify-center">
            <Activity className="w-5 h-5 text-neon-cyan" />
          </div>
          <span className="text-lg font-bold text-white">MedNote AI</span>
        </div>
        <Link to="/login" className="btn-neon text-sm py-2 px-5">
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs mb-8">
          <Zap className="w-3 h-3" /> AI-Powered Medical Documentation
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Focus on <span className="neon-text">Patients</span>,<br />
          Not Paperwork
        </h1>

        <p className="text-white/50 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          MedNote AI transforms voice recordings of patient consultations into structured
          medical notes, diagnoses, and treatment recommendations in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="btn-neon text-base py-3 px-8 flex items-center gap-2">
            Get Started <ChevronRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="text-white/50 hover:text-white/70 transition-colors text-sm">
            Already have an account? Sign in
          </Link>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 border-neon-red/20 border">
            <h3 className="text-neon-red text-sm font-semibold uppercase tracking-wider mb-4">The Problem</h3>
            <p className="text-white/60 leading-relaxed">
              Physicians spend an average of <span className="text-white font-medium">2 hours daily</span> on
              clinical documentation. This reduces time with patients, leads to burnout, and
              increases the risk of errors in medical records.
            </p>
          </div>
          <div className="glass-card p-8 neon-border">
            <h3 className="text-neon-green text-sm font-semibold uppercase tracking-wider mb-4">The Solution</h3>
            <p className="text-white/60 leading-relaxed">
              MedNote AI uses advanced speech recognition and language models to
              <span className="text-white font-medium"> automate medical documentation</span>,
              generating accurate SOAP notes and clinical insights from natural conversation.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">How It Works</h2>
        <p className="text-white/40 text-center mb-12">Three simple steps to transform your workflow</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="glass-card neon-border p-8 text-center group hover:bg-dark-hover transition-all duration-300">
              <div className={`w-16 h-16 rounded-2xl bg-${step.color}/10 border border-${step.color}/30 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className={`w-8 h-8 text-${step.color}`} />
              </div>
              <div className="text-white/30 text-xs font-mono mb-2">STEP {i + 1}</div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Why MedNote AI?</h2>
        <p className="text-white/40 text-center mb-12">Built for modern medical professionals</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="glass-card p-5 flex items-start gap-4 hover:bg-dark-hover transition-all duration-300 group"
            >
              <div className={`w-10 h-10 rounded-xl bg-${b.color}/10 border border-${b.color}/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <b.icon className={`w-5 h-5 text-${b.color}`} />
              </div>
              <p className="text-white/70 text-sm leading-relaxed pt-2">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Tech Stack</h2>
        <p className="text-white/40 text-center mb-8">Powered by cutting-edge technologies</p>

        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-xl text-sm bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <div className="glass-card p-6 flex items-start gap-4 border-neon-red/15 border">
          <AlertTriangle className="w-6 h-6 text-neon-red/60 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-medium text-sm mb-2">Medical Disclaimer</h3>
            <p className="text-white/40 text-xs leading-relaxed">
              MedNote AI is designed to assist healthcare professionals with documentation tasks.
              It is not a diagnostic tool and should not replace professional medical judgment.
              All AI-generated content should be reviewed and verified by a qualified healthcare
              provider before clinical use. This tool does not provide medical advice.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-glass-border py-8 text-center">
        <p className="text-white/20 text-xs">
          &copy; {new Date().getFullYear()} MedNote AI. For educational and research purposes.
        </p>
      </footer>
    </div>
  )
}
