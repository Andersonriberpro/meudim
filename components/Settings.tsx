import React, { useEffect, useState, useRef } from 'react';
import { Settings as SettingsIcon, User, Users, ShieldCheck, Crown, RefreshCw, CheckCircle2, AlertTriangle, Lock, Save, Phone, Mail, Eye, EyeOff, Calendar, Clock, Camera } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import Card from './ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserListItem {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  email?: string;
}

const Settings: React.FC = () => {
  const { user, isAdmin, userProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'users'>('profile');

  // Profile states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // User management states
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load profile data into form
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setPhone(userProfile.phone || '');
    }
  }, [userProfile]);

  // Fetch users list (admin only)
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        showToast('Erro ao carregar usuários', 'error');
        return;
      }

      if (profiles) {
        const enriched = profiles.map(p => ({
          ...p,
          email: p.id === user?.id ? user?.email || '' : `${p.id.substring(0, 8)}...`
        }));
        setUsers(enriched);
      }
    } catch {
      showToast('Erro ao carregar usuários', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdmin && activeTab === 'users') {
      fetchUsers();
    }
  }, [isAdmin, activeTab]);

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);

    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      showToast('Erro ao salvar perfil', 'error');
    } else {
      showToast('Perfil atualizado com sucesso!');
      await refreshProfile();
    }
    setSavingProfile(false);
  };

  // Upload avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      showToast('Selecione uma imagem válida', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('Imagem muito grande (máx 2MB)', 'error');
      return;
    }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${ext}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        showToast('Erro ao enviar foto', 'error');
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        showToast('Erro ao atualizar perfil', 'error');
      } else {
        showToast('Foto atualizada!');
        await refreshProfile();
      }
    } catch {
      showToast('Erro ao enviar foto', 'error');
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showToast('A senha deve ter no mínimo 6 caracteres', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      showToast('Erro ao alterar senha', 'error');
    } else {
      showToast('Senha alterada com sucesso!');
      setNewPassword('');
      setConfirmPassword('');
    }
    setChangingPassword(false);
  };

  // Toggle user role (admin only)
  const handleChangeRole = async (targetUserId: string, newRole: string) => {
    if (!isAdmin || targetUserId === user?.id) return;
    setUpdatingRole(targetUserId);

    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', targetUserId);

    if (error) {
      showToast('Erro ao alterar permissão', 'error');
    } else {
      setUsers(users.map(u => u.id === targetUserId ? { ...u, role: newRole } : u));
      showToast(newRole === 'admin' ? 'Promovido a administrador!' : 'Rebaixado a usuário');
      await refreshProfile();
    }
    setUpdatingRole(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const roleLabel = userProfile?.role === 'admin' ? 'Administrador' : 'Usuário';
  const initial = (userProfile?.full_name || user?.email || '?')[0].toUpperCase();

  return (
    <PageLayout title="Administração">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 md:top-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-[300] px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-white/20 w-[85%] md:w-auto ${toast.type === 'success' ? 'bg-[#6E8F7A] text-white' : 'bg-[#9C4A3C] text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span className="font-black uppercase text-[9px] tracking-tight">{toast.msg}</span>
        </div>
      )}

      {/* Subtitle */}
      <p className="text-[8px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest -mt-4 mb-6">
        Gerencie seu perfil e configurações do sistema
      </p>

      {/* Tabs */}
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${activeTab === 'profile'
            ? 'bg-[#3A4F3C] text-[#E6DCCB] shadow-lg'
            : 'bg-white/40 text-[#3A4F3C]/50 hover:bg-white/60'
            }`}
        >
          <User size={14} />
          <span>Meu Perfil</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${activeTab === 'users'
              ? 'bg-[#3A4F3C] text-[#E6DCCB] shadow-lg'
              : 'bg-white/40 text-[#3A4F3C]/50 hover:bg-white/60'
              }`}
          >
            <Users size={14} />
            <span>Gerenciar Usuários</span>
          </button>
        )}
      </div>

      {/* ===== TAB: MEU PERFIL ===== */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Profile Card */}
            <div className="md:w-64 shrink-0">
              <Card className="p-6 md:p-8 flex flex-col items-center text-center space-y-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#6E8F7A]/20 border-4 border-[#6E8F7A]/40 flex items-center justify-center overflow-hidden">
                    {userProfile?.avatar_url ? (
                      <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={48} className="text-[#6E8F7A]" />
                    )}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                        <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#6E8F7A] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#5D7B68] transition-all disabled:opacity-50"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                {/* Name & Email */}
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-[#3A4F3C] uppercase tracking-tight">
                    {userProfile?.full_name || 'Sem nome'}
                  </h3>
                  <p className="text-[9px] font-bold text-[#3A4F3C]/40 break-all">
                    {user?.email}
                  </p>
                </div>

                {/* Role Badge */}
                <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest ${isAdmin
                  ? 'bg-[#9C4A3C]/10 text-[#9C4A3C] border border-[#9C4A3C]/20'
                  : 'bg-[#6E8F7A]/10 text-[#6E8F7A] border border-[#6E8F7A]/20'
                  }`}>
                  {isAdmin ? <ShieldCheck size={12} /> : <User size={12} />}
                  <span>{isAdmin ? 'ADMIN' : 'USUÁRIO'}</span>
                </span>

                {/* Meta */}
                <div className="w-full pt-4 border-t border-black/5 space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-[#3A4F3C]/40">
                    <Calendar size={12} />
                    <span className="text-[8px] font-black uppercase tracking-wide">
                      Membro desde: {userProfile?.created_at ? formatDate(userProfile.created_at) : '—'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#3A4F3C]/40">
                    <Clock size={12} />
                    <span className="text-[8px] font-black uppercase tracking-wide">
                      Atualizado: {userProfile?.updated_at ? formatDate(userProfile.updated_at) : '—'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Forms */}
            <div className="flex-1 space-y-6">
              {/* Dados Pessoais */}
              <Card className="p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-[#3A4F3C]/10 rounded-lg flex items-center justify-center">
                    <SettingsIcon size={16} className="text-[#3A4F3C]" />
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-[#3A4F3C] uppercase tracking-tighter">Dados Pessoais</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Nome Completo</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full bg-white/60 border border-black/5 rounded-xl pl-9 pr-4 py-3 outline-none font-black text-[#3A4F3C] text-[10px] uppercase"
                      />
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">E-mail</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="w-full bg-black/5 border border-black/5 rounded-xl pl-9 pr-4 py-3 outline-none font-black text-[#3A4F3C]/50 text-[10px] cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Telefone</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-white/60 border border-black/5 rounded-xl pl-9 pr-4 py-3 outline-none font-black text-[#3A4F3C] text-[10px]"
                      />
                    </div>
                  </div>

                  {/* Permissão (read-only) */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Permissão</label>
                    <div className="relative">
                      <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30" />
                      <input
                        type="text"
                        value={roleLabel}
                        readOnly
                        className="w-full bg-black/5 border border-black/5 rounded-xl pl-9 pr-4 py-3 outline-none font-black text-[#3A4F3C]/50 text-[10px] uppercase cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="flex items-center space-x-2 bg-[#6E8F7A] text-white px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg hover:bg-[#5D7B68] transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{savingProfile ? 'Salvando...' : 'Salvar Alterações'}</span>
                  </button>
                </div>
              </Card>

              {/* Alterar Senha */}
              <Card className="p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-[#D4A853]/10 rounded-lg flex items-center justify-center">
                    <Lock size={16} className="text-[#D4A853]" />
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-[#3A4F3C] uppercase tracking-tighter">Alterar Senha</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nova Senha */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Nova Senha</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30" />
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/60 border border-black/5 rounded-xl pl-9 pr-10 py-3 outline-none font-black text-[#3A4F3C] text-[10px]"
                      />
                      <button
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30 hover:text-[#3A4F3C]"
                      >
                        {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Senha */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30" />
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/60 border border-black/5 rounded-xl pl-9 pr-10 py-3 outline-none font-black text-[#3A4F3C] text-[10px]"
                      />
                      <button
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30 hover:text-[#3A4F3C]"
                      >
                        {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Change Pass Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword || !newPassword || !confirmPassword}
                    className="flex items-center space-x-2 bg-[#D4A853] text-white px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg hover:bg-[#C49943] transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Lock size={14} />
                    <span>{changingPassword ? 'Alterando...' : 'Alterar Senha'}</span>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB: GERENCIAR USUÁRIOS (Admin only) ===== */}
      {activeTab === 'users' && isAdmin && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <Card className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#6E8F7A]/10 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-[#6E8F7A]" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-[#3A4F3C] uppercase tracking-tighter">Usuários do Sistema</h3>
                  <p className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">
                    {users.length} usuário(s) registrado(s)
                  </p>
                </div>
              </div>
              <button
                onClick={fetchUsers}
                className="flex items-center space-x-2 px-4 py-2 bg-white/40 hover:bg-white/60 rounded-xl transition-all text-[#3A4F3C]/50 hover:text-[#3A4F3C]"
              >
                <RefreshCw size={14} className={loadingUsers ? 'animate-spin' : ''} />
                <span className="text-[8px] font-black uppercase tracking-widest hidden md:inline">Atualizar</span>
              </button>
            </div>

            {loadingUsers ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-10 h-10 border-3 border-[#3A4F3C]/10 border-t-[#3A4F3C] rounded-full animate-spin" />
                <p className="text-[9px] font-black text-[#3A4F3C]/30 uppercase tracking-widest">Carregando...</p>
              </div>
            ) : (
              <>
                {/* Table Header (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 mb-2">
                  <span className="col-span-4 text-[7px] font-black text-[#3A4F3C]/30 uppercase tracking-widest">Usuário</span>
                  <span className="col-span-2 text-[7px] font-black text-[#3A4F3C]/30 uppercase tracking-widest">Telefone</span>
                  <span className="col-span-2 text-[7px] font-black text-[#3A4F3C]/30 uppercase tracking-widest">Permissão</span>
                  <span className="col-span-2 text-[7px] font-black text-[#3A4F3C]/30 uppercase tracking-widest">Desde</span>
                  <span className="col-span-2 text-[7px] font-black text-[#3A4F3C]/30 uppercase tracking-widest">Ações</span>
                </div>

                {/* Rows */}
                <div className="space-y-2">
                  {users.map((u) => {
                    const isCurrentUser = u.id === user?.id;
                    const isUserAdmin = u.role === 'admin';
                    const userInitial = (u.full_name || u.email || '?')[0].toUpperCase();

                    return (
                      <div
                        key={u.id}
                        className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center p-4 rounded-2xl border transition-all ${isCurrentUser
                          ? 'bg-[#3A4F3C]/5 border-[#3A4F3C]/10'
                          : 'bg-white/40 border-white/40 hover:bg-white/60'
                          }`}
                      >
                        {/* User info */}
                        <div className="md:col-span-4 flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 ${isUserAdmin ? 'bg-[#9C4A3C]/10 text-[#9C4A3C]' : 'bg-[#3A4F3C]/10 text-[#3A4F3C]'
                            }`}>
                            <User size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-[#3A4F3C] uppercase tracking-tight truncate">
                              {u.full_name || 'Sem nome'}
                            </p>
                            <p className="text-[8px] font-bold text-[#3A4F3C]/30 truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="md:col-span-2 flex md:block items-center space-x-2 md:space-x-0">
                          <span className="text-[7px] font-black text-[#3A4F3C]/30 uppercase tracking-widest md:hidden">Tel:</span>
                          <p className="text-[9px] font-black text-[#3A4F3C]/60">
                            {u.phone || '—'}
                          </p>
                        </div>

                        {/* Permission Badge */}
                        <div className="md:col-span-2">
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-black uppercase text-[7px] tracking-widest ${isUserAdmin
                            ? 'bg-[#9C4A3C]/10 text-[#9C4A3C]'
                            : 'bg-[#6E8F7A]/10 text-[#6E8F7A]'
                            }`}>
                            {isUserAdmin ? <ShieldCheck size={10} /> : <User size={10} />}
                            <span>{isUserAdmin ? 'ADMIN' : 'USUÁRIO'}</span>
                          </span>
                        </div>

                        {/* Since */}
                        <div className="md:col-span-2 flex md:block items-center space-x-2 md:space-x-0">
                          <span className="text-[7px] font-black text-[#3A4F3C]/30 uppercase tracking-widest md:hidden">Desde:</span>
                          <p className="text-[9px] font-black text-[#3A4F3C]/60">
                            {formatDate(u.created_at)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="md:col-span-2">
                          {isCurrentUser ? (
                            <span className="text-[9px] font-black text-[#3A4F3C]/30 uppercase tracking-widest italic">Você</span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value)}
                              disabled={updatingRole === u.id}
                              className="bg-white/60 border border-black/5 rounded-xl px-3 py-2 font-black text-[#3A4F3C] text-[9px] uppercase appearance-none cursor-pointer w-full"
                            >
                              <option value="user">Usuário</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Empty State */}
                {users.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                    <div className="w-16 h-16 bg-[#3A4F3C]/5 rounded-2xl flex items-center justify-center">
                      <Users size={32} className="text-[#3A4F3C]/20" />
                    </div>
                    <p className="text-[10px] font-black text-[#3A4F3C]/30 uppercase tracking-widest">Nenhum usuário encontrado</p>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </PageLayout>
  );
};

export default Settings;
