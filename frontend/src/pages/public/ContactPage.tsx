import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, ChevronDown } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};



const FAQ_ITEMS = [
  {
    question: "Quels sont les délais de réponse de votre support ?",
    answer: "Notre équipe s'efforce de répondre à toutes les demandes sous 24 à 48 heures ouvrées. Les clients Premium bénéficient d'une assistance prioritaire avec un délai garanti de 4 heures."
  },
  {
    question: "Puis-je modifier ma demande après l'avoir envoyée ?",
    answer: "Une fois le formulaire soumis, vous ne pouvez pas le modifier directement. Cependant, vous pouvez nous renvoyer un email en mentionnant la référence de votre première demande."
  },
  {
    question: "Proposez-vous un support par téléphone ?",
    answer: "Oui, le support téléphonique est disponible pour nos clients Enterprise. Pour les autres forfaits, nous privilégions le support par email pour un meilleur suivi technique."
  },
  {
    question: "Comment signaler un problème technique urgent ?",
    answer: "Pour toute urgence technique bloquante, veuillez sélectionner le sujet 'Urgence technique' dans le formulaire ci-dessus. Notre équipe d'astreinte sera immédiatement notifiée."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Support général', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setIsSubmitted(true), 1000);
  };

  return (
    <div className="min-h-screen bg-background pt-[72px]">
      
      {/* ─── HERO & CONTACT SECTION ─── */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="page-container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <span className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 mb-6">
                <MessageSquare size={28} />
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-foreground">
                Comment pouvons-nous <br />
                <span className="gradient-text">vous aider ?</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Notre équipe est là pour répondre à vos questions, discuter d'un partenariat ou vous accompagner dans l'utilisation de Karochebama.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* LEFT COLUMN: CONTACT INFO */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
              className="flex-1 lg:max-w-md flex flex-col justify-center"
            >
              <h2 className="text-2xl font-display font-bold mb-8">Entrons en contact</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center text-primary-600 group-hover:scale-110 group-hover:bg-primary-50 group-hover:border-primary-200 transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground mb-1">Pour toute demande générale.</p>
                    <a href="mailto:hello@karochebama.com" className="text-primary-600 font-medium hover:underline">hello@karochebama.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:bg-amber-50 group-hover:border-amber-200 transition-all">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Téléphone</h3>
                    <p className="text-muted-foreground mb-1">Du lundi au vendredi, 9h-18h.</p>
                    <a href="tel:+33123456789" className="text-primary-600 font-medium hover:underline">+33 (0) 1 23 45 67 89</a>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Bureaux</h3>
                    <p className="text-muted-foreground">
                      128 Rue de la Croissance<br />
                      75008 Paris, France
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Map / Abstract element */}
              <div className="mt-12 h-48 rounded-2xl bg-muted/50 border border-border overflow-hidden relative group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="w-4 h-4 rounded-full bg-primary-600 animate-ping absolute" />
                  <div className="w-4 h-4 rounded-full bg-primary-600 relative" />
                  <span className="mt-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Siège Social</span>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: CONTACT FORM */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-[1.5]"
            >
              <div className="glass-card rounded-3xl p-8 md:p-10 shadow-glass-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-amber-500" />
                
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center text-center py-20">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle2 size={48} />
                      </div>
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">Message envoyé avec succès !</h3>
                    <p className="text-muted-foreground mb-8 max-w-md">
                      Merci de nous avoir contactés. Notre équipe reviendra vers vous dans les plus brefs délais à l'adresse <span className="font-medium text-foreground">{formData.email}</span>.
                    </p>
                    <button onClick={() => setIsSubmitted(false)} className="btn-secondary">
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6">Envoyez-nous un message</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Nom complet <span className="text-red-500">*</span></label>
                        <input 
                          required 
                          type="text" 
                          className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-muted-foreground/50" 
                          placeholder="Jean Dupont" 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Adresse email <span className="text-red-500">*</span></label>
                        <input 
                          required 
                          type="email" 
                          className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-muted-foreground/50" 
                          placeholder="jean@exemple.com" 
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Sujet de votre demande <span className="text-red-500">*</span></label>
                      <select 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                      >
                        <option>Support général</option>
                        <option>Demande commerciale / Devis</option>
                        <option>Partenariat</option>
                        <option>Problème technique urgent</option>
                        <option>Autre</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Votre message <span className="text-red-500">*</span></label>
                      <textarea 
                        required 
                        rows={5} 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none placeholder:text-muted-foreground/50" 
                        placeholder="Comment pouvons-nous vous aider aujourd'hui ?" 
                        value={formData.message} 
                        onChange={e => setFormData({...formData, message: e.target.value})} 
                      />
                    </div>

                    <p className="text-xs text-muted-foreground mb-6">
                      En soumettant ce formulaire, vous acceptez notre politique de confidentialité concernant le traitement de vos données.
                    </p>

                    <button type="submit" className="btn-primary w-full py-4 text-base font-bold shadow-glow flex items-center justify-center gap-2">
                      Envoyer le message <Send size={18} />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="py-20 bg-card border-t border-border">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Foire Aux Questions</h2>
              <p className="text-muted-foreground">Trouvez rapidement une réponse avant de nous contacter.</p>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === idx ? 'bg-background shadow-md' : 'bg-transparent hover:bg-muted/50'}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                  >
                    <span className="font-bold text-foreground pr-4">{item.question}</span>
                    <ChevronDown size={20} className={`text-muted-foreground transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180 text-primary-600' : ''}`} />
                  </button>
                  
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className="px-5 md:px-6 pb-6 text-muted-foreground"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
