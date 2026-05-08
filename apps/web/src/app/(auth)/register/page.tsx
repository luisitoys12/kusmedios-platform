'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', organization: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'client' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al registrarse');
      localStorage.setItem('km_access', data.accessToken);
      localStorage.setItem('km_refresh', data.refreshToken);
      localStorage.setItem('km_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e0d] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="KusMedios">
            <rect width="36" height="36" rx="8" fill="#01696f"/>
            <circle cx="18" cy="14" r="5" fill="white" opacity="0.9"/>
            <rect x="8" y="22" width="20" height="2.5" rx="1.25" fill="white" opacity="0.6"/>
            <rect x="11" y="26" width="14" height="2" rx="1" fill="white" opacity="0.4"/>
          </svg>
          <span className="text-white font-semibold text-lg tracking-tight">KusMedios</span>
        </div>

        <div className="bg-[#1c1b19] border border-[#2a2927] rounded-xl p-8">
          <h1 className="text-white text-xl font-semibold mb-1">Crear cuenta</h1>
          <p className="text-[#797876] text-sm mb-6">Comienza tu prueba gratuita</p>

          {error && (
            <div className="bg-[#2a1a1a] border border-[#a12c7b]/30 text-[#d163a7] text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#cdccca] text-sm font-medium mb-1.5">Nombre completo</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Tu nombre"
                className="w-full bg-[#201f1d] border border-[#393836] rounded-lg px-3.5 py-2.5 text-[#cdccca] text-sm placeholder-[#5a5957] focus:outline-none focus:border-[#4f98a3] transition-colors" />
            </div>
            <div>
              <label className="block text-[#cdccca] text-sm font-medium mb-1.5">Nombre de la organización</label>
              <input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })}
                placeholder="Radio Demo FM"
                className="w-full bg-[#201f1d] border border-[#393836] rounded-lg px-3.5 py-2.5 text-[#cdccca] text-sm placeholder-[#5a5957] focus:outline-none focus:border-[#4f98a3] transition-colors" />
            </div>
            <div>
              <label className="block text-[#cdccca] text-sm font-medium mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
                className="w-full bg-[#201f1d] border border-[#393836] rounded-lg px-3.5 py-2.5 text-[#cdccca] text-sm placeholder-[#5a5957] focus:outline-none focus:border-[#4f98a3] transition-colors" />
            </div>
            <div>
              <label className="block text-[#cdccca] text-sm font-medium mb-1.5">Contraseña</label>
              <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-[#201f1d] border border-[#393836] rounded-lg px-3.5 py-2.5 text-[#cdccca] text-sm placeholder-[#5a5957] focus:outline-none focus:border-[#4f98a3] transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#01696f] hover:bg-[#0c4e54] text-white font-medium text-sm rounded-lg py-2.5 transition-colors disabled:opacity-50 mt-2">
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#5a5957] text-xs mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/(auth)/login" className="text-[#4f98a3] hover:text-[#227f8b] transition-colors">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
