import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (category: any) => void;
  category?: any;
}

const CategoryDialog = ({ open, onClose, onSave, category }: CategoryDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || ''
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [category, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

  return (
    <Modal 
      isOpen={open} 
      onClose={onClose} 
      title={category ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className={labelClass}>Nom de la Catégorie</label>
            <input
              type="text"
              required
              className={inputClass}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Engrais, Semences..."
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} min-h-[100px] resize-none`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Détails de la catégorie..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-2xl font-bold text-sm hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-all"
          >
            {category ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryDialog;

