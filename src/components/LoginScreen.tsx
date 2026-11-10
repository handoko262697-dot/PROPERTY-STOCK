import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = login(email, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Email atau kata sandi tidak cocok.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Mohon lengkapi seluruh kolom formulir.');
      return;
    }
    const res = register(name, email, password, 'user', phone);
    if (!res.success) {
      setErrorMessage(res.message || 'Pendaftaran akun gagal.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center relative overflow-hidden selection:bg-slate-700 selection:text-white">
      
      {/* Background Architectural Photography with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/kyan_property_banner_1794148348923.jpg"
          alt="KYAN Property Estate"
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-900/80" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto p-4 sm:p-6 my-auto">
        
        {/* Brand Lockup */}
        <div className="text-center mb-6">
          <img
            src="/assets/aistudio/logo_kyan_797e1a08.jpg"
            alt="KYAN Property Logo"
            className="w-24 h-24 rounded-full object-cover shadow-2xl border-2 border-emerald-400/40 mx-auto mb-3.5 bg-white ring-4 ring-white/10"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            KYAN PROPERTY APP
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Contractor & Agency Property
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Inventory Perumahan Subsidi, Komersil & Recycle
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-lg border border-slate-800 mb-6 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2 rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`py-2 rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 mb-4 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Masukkan alamat email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Masukkan alamat email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="0812-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Kata Sandi *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun</span>
              </button>
            </form>
          )}

        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500">
          KYAN PROPERTY APP
        </div>

      </div>

    </div>
  );
};
