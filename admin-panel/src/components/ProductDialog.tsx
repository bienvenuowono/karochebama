import React from 'react';
import Modal from './Modal';
import AdvancedProductForm from './AdvancedProductForm';

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  product?: any;
  types: any[];
  sites: any[];
  varieties: any[];
  categories: any[];
}

const ProductDialog = ({ open, onClose, onSave, product, types, sites, varieties, categories }: ProductDialogProps) => {
  return (
    <Modal 
      isOpen={open} 
      onClose={onClose} 
      title={product ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
    >
      <div className="max-w-3xl mx-auto">
        <AdvancedProductForm 
          onSubmit={onSave}
          onCancel={onClose}
          initialData={product}
          types={types}
          sites={sites}
          varieties={varieties}
          categories={categories}
        />
      </div>
    </Modal>
  );
};

export default ProductDialog;
<<<<<<< HEAD

=======
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
