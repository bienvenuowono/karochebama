import nodemailer from 'nodemailer';

// Configuration du transporteur SMTP (Tolérant aux variables manquantes)
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

interface MailOptions {
  subject: string;
  html: string;
}

/**
 * Envoie un email à l'administrateur
 */
export async function sendAdminEmail(options: MailOptions): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@karochebama.com';
  const fromEmail = process.env.SMTP_FROM || 'noreply@karochebama.com';
  
  const transporter = getTransporter();

  if (!transporter) {
    console.warn('[EMAIL SERVICE WARNING] SMTP non configuré. E-mail non envoyé.');
    console.log(`[SIMULATED EMAIL TO ${adminEmail}]`);
    console.log(`Sujet: ${options.subject}`);
    console.log(`Contenu HTML:\n${options.html}`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Plateforme Karochebama" <${fromEmail}>`,
      to: adminEmail,
      subject: options.subject,
      html: options.html,
    });
    console.log(`[EMAIL SERVICE] Notification par e-mail envoyée avec succès à : ${adminEmail}`);
    return true;
  } catch (error) {
    console.error('[EMAIL SERVICE ERROR] Échec de l\'envoi de l\'email :', error);
    return false;
  }
}

/**
 * Notification pour un nouveau message de contact
 */
export async function sendAdminContactNotification(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  return sendAdminEmail({
    subject: `[Nouveau Contact] ${subject || 'Sans objet'}`,
    html: `
      <h2>Nouveau message de contact reçu</h2>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Sujet :</strong> ${subject || 'Non renseigné'}</p>
      <p><strong>Message :</strong></p>
      <blockquote style="background: #f4f4f4; padding: 15px; border-left: 5px solid #10b981; margin: 15px 0;">
        ${message.replace(/\n/g, '<br>')}
      </blockquote>
      <hr>
      <p style="font-size: 12px; color: #666;">Ce message a été généré automatiquement par la plateforme Karochebama.</p>
    `
  });
}

/**
 * Notification pour un nouveau formulaire commercial
 */
export async function sendAdminCommercialNotification(
  type: string,
  agentName: string,
  clientName: string,
  product: string,
  quantity: string,
  location: string
) {
  return sendAdminEmail({
    subject: `[Formulaire Commercial] Nouvelle demande de type : ${type}`,
    html: `
      <h2>Nouvelle soumission de formulaire commercial</h2>
      <p><strong>Type de formulaire :</strong> ${type}</p>
      <p><strong>Nom de l'agent :</strong> ${agentName}</p>
      <p><strong>Nom du client :</strong> ${clientName}</p>
      <p><strong>Produit :</strong> ${product}</p>
      <p><strong>Quantité :</strong> ${quantity}</p>
      <p><strong>Localisation :</strong> ${location}</p>
      <hr>
      <p style="font-size: 12px; color: #666;">Ce message a été généré automatiquement par la plateforme Karochebama.</p>
    `
  });
}

/**
 * Notification pour une nouvelle demande de partenariat
 */
export async function sendAdminPartnerNotification(
  name: string,
  type: string,
  email: string,
  phone: string,
  location: string,
  description: string
) {
  return sendAdminEmail({
    subject: `[Candidature Partenaire] Nouvelle demande de ${name}`,
    html: `
      <h2>Nouvelle candidature de partenaire reçue</h2>
      <p><strong>Nom du partenaire :</strong> ${name}</p>
      <p><strong>Type de partenariat :</strong> ${type}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Téléphone :</strong> ${phone}</p>
      <p><strong>Localisation :</strong> ${location}</p>
      <p><strong>Description du projet :</strong></p>
      <blockquote style="background: #f4f4f4; padding: 15px; border-left: 5px solid #10b981; margin: 15px 0;">
        ${description.replace(/\n/g, '<br>')}
      </blockquote>
      <hr>
      <p style="font-size: 12px; color: #666;">Ce message a été généré automatiquement par la plateforme Karochebama.</p>
    `
  });
}
