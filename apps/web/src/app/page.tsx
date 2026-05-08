import Link from 'next/link';

const plans = [
  {
    id: 'free', name: 'Free', price: '$0', period: '/mes',
    features: ['1 canal radio', '100 oyentes', '5 GB', 'Player embed'],
    cta: 'Empezar gratis', highlight: false,
  },
  {
    id: 'starter', name: 'Starter', price: '$19', period: '/mes',
    features: ['2 canales radio', '500 oyentes', '20 GB', 'AutoDJ 24/7', 'SSL incluido'],
    cta: 'Elegir Starter', highlight: false,
  },
  {
    id: 'pro', name: 'Pro', price: '$49', period: '/mes',
    features: ['5 radio + 1 TV', '2,000 listeners', '100 GB', 'API access', 'Soporte prioritario'],
    cta: 'Elegir Pro', highlight: true,
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 'Custom', period: '',
    features: ['Canales ilimitados', 'White-label', 'CDN dedicado', 'SLA 99.9%', 'Soporte 24/7'],
    cta: 'Contactar', highlight: false,
  },
];

const features = [
  { icon: '📻', title: 'Radio 24/7', desc: 'AutoDJ, playlists, programación y live takeover para tu estación siempre activa.' },
  { icon: '📺', title: 'TV en vivo', desc: 'Ingest RTMP/SRT, empaquetado HLS y player embebible para cualquier dispositivo.' },
  { icon: '🎛️', title: 'Dashboard pro', desc: 'Panel unificado para operar todos tus canales, métricas en tiempo real y alertas.' },
  { icon: '🏢', title: 'Multi-tenant', desc: 'Renta servicios a tus clientes con su propio panel, dominio y branding.' },
  { icon: '📊', title: 'Analíticas', desc: 'Oyentes, viewers, bitrate, uptime y tendencias históricas en tiempo real.' },
  { icon: '🔒', title: 'SSL + CDN', desc: 'HTTPS en todos los streams, distribución global con BunnyCDN.' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0f0f0f]/90 backdrop-blur border-b border-white/5">
        <span className="text-lg font-semibold tracking-tight">Estacion<span className="text-teal-400">KusMedios</span></span>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Características</a>
          <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
          <a href="#contact" className="hover:text-white transition-colors">Contacto</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">Entrar</Link>
          <Link href="/register" className="text-sm bg-teal-500 hover:bg-teal-400 text-black font-medium px-4 py-2 rounded-lg transition-colors">
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs text-teal-400 bg-teal-400/10 border border-teal-400/20 px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          Radio & TV Streaming Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Transmite radio y TV<br />
          <span className="text-teal-400">24/7 sin interrupciones</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10">
          La plataforma de EstacionKusMedios para operar canales de radio y televisión en vivo.
          Panel unificado, AutoDJ, HLS live y servicio white-label para tus clientes.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
            Crear cuenta gratis
          </Link>
          <Link href="/dashboard" className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-lg transition-colors">
            Ver demo →
          </Link>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
          {[['99.9%', 'Uptime SLA'], ['< 3s', 'Latencia HLS'], ['24/7', 'AutoDJ radio']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-teal-400">{val}</div>
              <div className="text-xs text-white/40 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">Todo lo que necesitas para transmitir</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 hover:bg-white/[0.05] transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Planes simples y transparentes</h2>
        <p className="text-center text-white/40 text-sm mb-12">Sin sorpresas. Cambia o cancela cuando quieras.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <div key={plan.id} className={`relative rounded-xl p-6 border ${
              plan.highlight
                ? 'bg-teal-500/10 border-teal-500/40'
                : 'bg-white/[0.03] border-white/[0.07]'
            }`}>
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-teal-500 text-black font-semibold px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              <div className="mb-4">
                <div className="text-sm text-white/50 mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-white/40">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                    <span className="text-teal-400 text-xs">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                plan.highlight
                  ? 'bg-teal-500 hover:bg-teal-400 text-black'
                  : 'border border-white/20 hover:border-white/40 text-white'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-6 text-center text-sm text-white/30">
        <p>© 2026 EstacionKusMedios · Irapuato, Guanajuato, MX</p>
        <p className="mt-1">Radio & TV Streaming Platform · <a href="mailto:admin@estacionkusmedios.org" className="hover:text-white/60 transition-colors">admin@estacionkusmedios.org</a></p>
      </footer>
    </main>
  );
}
