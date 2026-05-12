import React from 'react';
import { X, Printer, Download, MapPin, Phone, Globe, Mail } from 'lucide-react';
import Modal from './Modal';

const InvoiceModal = ({ isOpen, onClose, order }: any) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Détails de la Facture - #${order.id}`} size="4xl">
      <div className="bg-white p-2" id="printable-invoice-root">
        {/* Printable Area */}
        <div id="printable-invoice" className="p-8 border border-slate-100 rounded-3xl print:border-none print:p-0">
          {/* Header Facture */}
          <div className="flex justify-between items-start mb-12">
            <div className="max-w-[60%]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary-600/20">K</div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">KAROCHEBAMA</h1>
                  <p className="text-[9px] font-bold text-primary-600 tracking-widest uppercase mt-1">Modern Agriculture</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4 italic border-l-2 border-primary-500 pl-3">
                "Entreprise camerounaise engagée dans le développement de l’agriculture moderne, de l’agro-industrie et de la pisciculture durable."
              </p>
              <div className="space-y-1.5 text-[11px] text-slate-600 font-semibold">
                <p className="flex items-center gap-2"><MapPin size={12} className="text-primary-500"/> Douala, Littoral, Cameroun</p>
                <p className="flex items-center gap-2"><Mail size={12} className="text-primary-500"/> contact@karochebama.com</p>
                <p className="flex items-center gap-2"><Phone size={12} className="text-primary-500"/> +237 677 11 80 81</p>
                <p className="flex items-center gap-2"><Globe size={12} className="text-primary-500"/> www.karochebama.com</p>
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
              <p className="font-black text-slate-900 text-lg">{order.customerName || `${order.user?.firstName} ${order.user?.lastName}`}</p>
              <div className="space-y-1 mt-2">
                <p className="text-sm text-slate-500 flex items-center gap-2"><Mail size={14}/> {order.customerEmail || order.user?.email || 'N/A'}</p>
                <p className="text-sm text-slate-500 flex items-center gap-2"><Globe size={14}/> {order.customerCountry || 'Cameroun'}</p>
                <p className="text-sm text-slate-500 flex items-center gap-2"><Phone size={14}/> {order.customerPhone || order.user?.phone || 'N/A'}</p>
                {order.customerWhatsapp && (
                  <p className="text-sm text-emerald-600 font-bold flex items-center gap-2 italic">WhatsApp: {order.customerWhatsapp}</p>
                )}
              </div>
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
          @page {
            size: A4;
            margin: 5mm;
          }
          
          body {
            visibility: hidden;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          #root, #modal-content-container, #modal-content-container > div {
            visibility: visible !important;
            display: block !important;
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
            position: static !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }

          #modal-content-container > div:first-child,
          .absolute.inset-0.bg-slate-900\\/80,
          .print\\:hidden,
          button {
            display: none !important;
          }

          #printable-invoice-root {
            visibility: visible !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
          }

          #printable-invoice {
            padding: 10mm !important;
            border: none !important;
            width: 100% !important;
          }

          /* Réduction des espaces pour faire tenir sur une page */
          .mb-12 { margin-bottom: 1.5rem !important; }
          .mb-10 { margin-bottom: 1rem !important; }
          .mt-20 { margin-top: 2rem !important; }
          .py-5 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
        }
      `}</style>
    </Modal>
  );
};

export default InvoiceModal;

