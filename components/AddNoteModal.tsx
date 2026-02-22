
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; title: string; content: string }) => void;
  initialData?: any;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    } else if (isOpen) {
      setTitle('');
      setContent('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({
      id: initialData?.id,
      title,
      content
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h3 className="text-3xl font-black text-indigo-600 mb-8">
          {initialData ? 'Editar Nota' : 'Criar Nova Nota'}
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Título</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ideias para o orçamento de 2026"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Conteúdo</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva sua nota aqui..."
              rows={5}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-gray-800 resize-none"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 border border-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className={`flex-[2] py-4 rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 ${
                title.trim() && content.trim() 
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' 
                  : 'bg-indigo-300 cursor-not-allowed opacity-60'
              }`}
            >
              {initialData ? 'Salvar Alterações' : 'Salvar Nota'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;
