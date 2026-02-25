import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';
import Logo from './ui/Logo';

type AuthMode = 'login' | 'signup' | 'reset';

const AuthPage: React.FC = () => {
    const { signIn, signUp, resetPassword } = useAuth();
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (mode === 'login') {
                const { error } = await signIn(email, password);
                if (error) {
                    if (error.message.includes('Invalid login credentials')) {
                        setError('E-mail ou senha incorretos.');
                    } else {
                        setError(error.message);
                    }
                }
            } else if (mode === 'signup') {
                if (!fullName.trim()) {
                    setError('Informe seu nome completo.');
                    setLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setError('A senha deve ter no mínimo 6 caracteres.');
                    setLoading(false);
                    return;
                }
                const { error, data } = await signUp(email, password, fullName);
                if (error) {
                    setError(error.message);
                } else if (data?.user?.identities?.length === 0) {
                    setError('Este e-mail já está cadastrado. Tente fazer login.');
                } else if (data?.session) {
                    // Auto-confirmed: session is active, AuthContext will redirect
                } else {
                    setSuccess('Conta criada! Verifique seu e-mail para confirmar o cadastro, depois faça login.');
                    setMode('login');
                }
            } else if (mode === 'reset') {
                const { error } = await resetPassword(email);
                if (error) {
                    setError(error.message);
                } else {
                    setSuccess('Link de recuperação enviado! Verifique seu e-mail.');
                    setMode('login');
                }
            }
        } catch {
            setError('Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode);
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="min-h-screen bg-[#E6DCCB] flex items-start md:items-center justify-center py-8 px-4 relative overflow-y-auto">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#3A4F3C]/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#6E8F7A]/10 rounded-full blur-3xl" />
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#9C4A3C]/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
                {/* Logo Header */}
                <div className="flex justify-center mb-8">
                    <Logo variant="green" className="scale-125" />
                </div>

                {/* Auth Card */}
                <div className="bg-white/40 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-[#3A4F3C] p-5 md:p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                        <div className="relative z-10">
                            <div className="flex items-center space-x-2 mb-2">
                                {mode === 'login' && <KeyRound size={18} className="text-[#E6DCCB]/60" />}
                                {mode === 'signup' && <Sparkles size={18} className="text-[#E6DCCB]/60" />}
                                {mode === 'reset' && <Mail size={18} className="text-[#E6DCCB]/60" />}
                                <span className="text-[8px] md:text-[10px] font-black text-[#E6DCCB]/60 uppercase tracking-widest">
                                    {mode === 'login' && 'Acesso à conta'}
                                    {mode === 'signup' && 'Criar nova conta'}
                                    {mode === 'reset' && 'Recuperar acesso'}
                                </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-[#E6DCCB] uppercase tracking-tight">
                                {mode === 'login' && 'Bem-vindo de volta'}
                                {mode === 'signup' && 'Comece agora'}
                                {mode === 'reset' && 'Esqueceu a senha?'}
                            </h2>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-4">
                        {/* Error / Success Messages */}
                        {error && (
                            <div className="bg-[#9C4A3C]/10 border border-[#9C4A3C]/20 rounded-xl p-3 text-[#9C4A3C] text-[10px] font-black uppercase tracking-wide animate-in fade-in slide-in-from-top-2 duration-300">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-[#6E8F7A]/10 border border-[#6E8F7A]/20 rounded-xl p-3 text-[#6E8F7A] text-[10px] font-black uppercase tracking-wide animate-in fade-in slide-in-from-top-2 duration-300">
                                {success}
                            </div>
                        )}

                        {/* Name Field (signup only) */}
                        {mode === 'signup' && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">
                                    Nome Completo
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Seu nome"
                                        className="w-full bg-white/60 border border-black/5 rounded-xl pl-11 pr-4 py-3.5 outline-none font-black text-[#3A4F3C] text-xs placeholder:text-[#3A4F3C]/20 focus:border-[#3A4F3C]/20 focus:bg-white/80 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">
                                E-mail
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full bg-white/60 border border-black/5 rounded-xl pl-11 pr-4 py-3.5 outline-none font-black text-[#3A4F3C] text-xs placeholder:text-[#3A4F3C]/20 focus:border-[#3A4F3C]/20 focus:bg-white/80 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field (not in reset mode) */}
                        {mode !== 'reset' && (
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/60 border border-black/5 rounded-xl pl-11 pr-12 py-3.5 outline-none font-black text-[#3A4F3C] text-xs placeholder:text-[#3A4F3C]/20 focus:border-[#3A4F3C]/20 focus:bg-white/80 transition-all"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30 hover:text-[#3A4F3C] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Forgot password link */}
                        {mode === 'login' && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => switchMode('reset')}
                                    className="text-[9px] font-black text-[#3A4F3C]/40 uppercase tracking-widest hover:text-[#3A4F3C] transition-colors"
                                >
                                    Esqueceu a senha?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#3A4F3C] text-[#E6DCCB] py-4 rounded-xl font-black uppercase text-[10px] md:text-xs tracking-widest flex items-center justify-center space-x-3 shadow-xl hover:bg-[#2F3F31] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-[#E6DCCB]/30 border-t-[#E6DCCB] rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>
                                        {mode === 'login' && 'Entrar'}
                                        {mode === 'signup' && 'Criar Conta'}
                                        {mode === 'reset' && 'Enviar Link'}
                                    </span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="px-5 md:px-8 pb-5 md:pb-8">
                        <div className="border-t border-black/5 pt-5 space-y-3">
                            {mode === 'login' && (
                                <button
                                    onClick={() => switchMode('signup')}
                                    className="w-full py-3.5 rounded-xl font-black uppercase text-[10px] md:text-xs tracking-widest border-2 border-[#3A4F3C] text-[#3A4F3C] hover:bg-[#3A4F3C] hover:text-[#E6DCCB] transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
                                >
                                    <Sparkles size={16} />
                                    <span>Criar Nova Conta</span>
                                </button>
                            )}
                            {mode === 'signup' && (
                                <button
                                    onClick={() => switchMode('login')}
                                    className="w-full py-3.5 rounded-xl font-black uppercase text-[10px] md:text-xs tracking-widest border-2 border-[#3A4F3C] text-[#3A4F3C] hover:bg-[#3A4F3C] hover:text-[#E6DCCB] transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
                                >
                                    <KeyRound size={16} />
                                    <span>Já Tenho Conta</span>
                                </button>
                            )}
                            {mode === 'reset' && (
                                <button
                                    onClick={() => switchMode('login')}
                                    className="w-full py-3.5 rounded-xl font-black uppercase text-[10px] md:text-xs tracking-widest border-2 border-[#3A4F3C] text-[#3A4F3C] hover:bg-[#3A4F3C] hover:text-[#E6DCCB] transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
                                >
                                    <ArrowRight size={16} />
                                    <span>Voltar ao Login</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Text */}
                <p className="text-center mt-6 text-[7px] font-black text-[#3A4F3C]/20 uppercase tracking-[0.3em]">
                    © 2026 MeuDim — Seu dinheiro no controle
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
