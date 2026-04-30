import React from 'react';
import { X, Printer, Download, MapPin, Phone, Globe, Mail } from 'lucide-react';
import Modal from './Modal';

const InvoiceModal = ({ isOpen, onClose, order }: any) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Détails de la Facture - #${order.id}`}>
      <div className="bg-white p-2">
        {/* Printable Area */}
        <div id="printable-invoice" className="p-8 border border-slate-100 rounded-3xl print:border-none print:p-0">
          {/* Header Facture */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-xl">K</div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter">KAROCHEBAMA</h1>
              </div>
              <div className="space-y-1 text-xs text-slate-500 font-medium">
                <p className="flex items-center gap-2"><MapPin size={12}/> Douala, Littoral, Cameroun</p>
                <p className="flex items-center gap-2"><Phone size={12}/> +237 6XX XXX XXX</p>
                <p className="flex items-center gap-2"><Globe size={12}/> www.karochebama.cm</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-slate-900 mb-1">FACTURE</h2>
              <p className="text-sm font-bold text-primary-600 mb-4">#FAC-{new Date(order.createdAt).getTime()}</p>
              <div className="text-xs text-slate-500 font-medium">
                <p>Date : {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Statut : <span className="text-emerald-600 font-bold uppercase">{order.status}</span></p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 mb-10" />

          {/* Client & Info */}
          <div className="grid grid-cols-2 gap-10 mb-12">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Facturé à</h4>
              <p className="font-black text-slate-900 text-lg">{order.user?.firstName} {order.user?.lastName}</p>
              <p className="text-sm text-slate-500 flex items-center gap-2 mt-1"><Mail size={14}/> {order.user?.email}</p>
            </div>
            <div className="text-right">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Paiement</h4>
              <p className="text-sm text-slate-900 font-bold">Virement Bancaire / Mobile Money</p>
              <p className="text-xs text-slate-500 mt-1">Échéance : Immédiate</p>
            </div>
          </div>

          {/* Table des produits */}
          <div className="mb-10">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="text-left py-4 text-xs font-black text-slate-900 uppercase">Désignation</th>
                  <th className="text-center py-4 text-xs font-black text-slate-900 uppercase">Qté</th>
                  <th className="text-right py-4 text-xs font-black text-slate-900 uppercase">Prix Unit.</th>
                  <th className="text-right py-4 text-xs font-black text-slate-900 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items?.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-5 text-sm font-bold text-slate-900">
                      {item.product?.name}
                      <p className="text-[10px] text-slate-400 font-medium">Catégorie : {item.product?.category?.name || 'Agricole'}</p>
                    </td>
                    <td className="py-5 text-center text-sm font-medium text-slate-600">{item.quantity}</td>
                    <td className="py-5 text-right text-sm font-medium text-slate-600">{Number(item.price).toLocaleString()} FCFA</td>
                    <td className="py-5 text-right text-sm font-black text-slate-900">{(item.quantity * Number(item.price)).toLocaleString()} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Sous-total</span>
                <span className="text-slate-900 font-bold">{Number(order.totalAmount).toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">TVA (0%)</span>
                <span className="text-slate-900 font-bold">0 FCFA</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-slate-900">
                <span className="text-lg font-black text-slate-900 uppercase">Net à Payer</span>
                <span className="text-lg font-black text-primary-600">{Number(order.totalAmount).toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          {/* Footer Invoice */}
          <div className="mt-20 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Merci de votre confiance</p>
            <div className="w-10 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 print:hidden">
          <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
            Fermer
          </button>
          <button onClick={handlePrint} className="flex-[2] py-3 bg-primary-500 text-white rounded-2xl font-bold text-sm hover:bg-primary-600 shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2">
            <Printer size={18} /> Imprimer la Facture
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-invoice, #printable-invoice * { visibility: visible; }
          #printable-invoice { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            border: none !important;
          }
        }
      `}</style>
    </Modal>
  );
};

export default InvoiceModal;
