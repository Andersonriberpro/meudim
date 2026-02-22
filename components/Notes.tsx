
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { Note } from '../types';
import AddNoteModal from './AddNoteModal';
import { CheckCircle2 } from 'lucide-react';

const Notes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Metas 2026', content: 'Economizar para a viagem e reduzir gastos fixos em 10%.', updatedAt: '03/02/2026 14:00' }
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir esta nota?')) {
      setNotes(notes.filter(n => n.id !== id));
      showToast("Seu dim tá organizado");
    }
  };

  const handleSave = (data: { id?: string; title: string; content: string }) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (data.id) {
      setNotes(notes.map(n => n.id === data.id ? { ...n, title: data.title, content: data.content, updatedAt: formattedDate } : n));
      showToast("Tudo certo por aqui 👌");
    } else {
      const newNote: Note = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title,
        content: data.content,
        updatedAt: formattedDate
      };
      setNotes([newNote, ...notes]);
      showToast("Tudo certo por aqui 👌");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {toast && (
        <div className="fixed top-8 right-8 z-[300] bg-[#6E8F7A] text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-right-10 border border-white/20">
          <CheckCircle2 size={24} />
          <span className="font-black uppercase tracking-tight">{toast}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
         <h2 className="text-4xl font-black text-[#3A4F3C] uppercase tracking-tighter">Bloco de Notas</h2>
         <button 
           onClick={handleOpenAdd}
           className="bg-[#3A4F3C] text-[#E6DCCB] px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-[#2F3F31] transition-all active:scale-95 flex items-center space-x-3"
         >
            {ICONS.Add}
            <span>Nova Nota</span>
         </button>
      </div>

      {notes.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md p-24 rounded-[3rem] shadow-sm border border-white/40 flex flex-col items-center justify-center text-center space-y-4">
           <p className="text-xl font-black text-[#3A4F3C]/40 uppercase tracking-widest">Nada registrado por aqui</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-[#D8CFC0] p-10 rounded-[2.5rem] shadow-lg border border-black/5 flex flex-col justify-between group h-full hover:bg-[#CBBFAE] transition-all">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                   <h3 className="text-2xl font-black text-[#3A4F3C] leading-tight uppercase tracking-tight">{note.title}</h3>
                   <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEdit(note)} className="p-2 text-[#3A4F3C]/40 hover:text-[#3A4F3C]">{ICONS.Edit}</button>
                      <button onClick={() => handleDelete(note.id)} className="p-2 text-[#3A4F3C]/40 hover:text-[#9C4A3C]">{ICONS.Trash}</button>
                   </div>
                </div>
                <p className="text-[#3A4F3C]/80 font-bold text-sm leading-relaxed whitespace-pre-wrap line-clamp-6 uppercase tracking-tight">{note.content}</p>
              </div>
              <div className="pt-6 mt-10 border-t border-[#3A4F3C]/10">
                 <p className="text-[9px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Atualizado: {note.updatedAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddNoteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingNote}
      />
    </div>
  );
};

export default Notes;
