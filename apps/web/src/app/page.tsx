import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-900/40 border border-teal-800 rounded-full px-4 py-1.5 text-teal-300 text-sm mb-8">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          Transmitiendo 24/7 desde Irapuato, Gto.
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Tu radio y TV en el aire,<br />
          <span className="text-teal-400">siempre.</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
          Plataforma profesional de streaming para radios y canales de TV.
          Opera tu señal 24/7 con AutoDJ, video HLS y panel propio.
          Renta o gestiona tus propios canales.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/planes" className="px-6 py-3 bg-teal-600 hover:bg-teal-500 rounded-xl font-medium transition">Ver planes</Link>
          <Link href="/demo" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-medium transition">Ver demo</Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Radio 24/7', desc: 'AutoDJ, playlists, programación de shows, live takeover y failover automático. Tu señal nunca cae.', emoji: '📻' },
            { title: 'TV & Video HLS', desc: 'Ingest RTMP/SRT, transcoding multi-bitrate, player embebible y distribución CDN para tu canal de TV.', emoji: '📺' },
            { title: 'Multi-tenant', desc: 'Administra tus propios canales y ofrece el servicio a tus clientes con branding, roles y billing propios.', emoji: '🏢' },
          ].map(f => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="text-3xl mb-4">{f.emoji}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
