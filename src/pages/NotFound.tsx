import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>🌱</span>
        </div>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Oups ! Page introuvable</h2>
        <p style={styles.description}>
          La page que vous recherchez semble avoir été déplacée, supprimée ou n'a jamais existé. 
          Retournons aux champs pour continuer à grandir ensemble !
        </p>
        <div style={styles.buttonContainer}>
          <Link to="/" style={styles.button}>
            Retourner à l'accueil
          </Link>
          <Link to="/marketplace" style={styles.secondaryButton}>
            Visiter la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '2rem',
    background: 'linear-gradient(135deg, #f4f7f6 0%, #e9efe8 100%)',
    fontFamily: '"Outfit", "Inter", sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
    padding: '3rem 2rem',
    textAlign: 'center',
    maxWidth: '550px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#eaf4eb',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
  },
  icon: {
    fontSize: '2.5rem',
  },
  title: {
    fontSize: '5rem',
    fontWeight: '800',
    margin: '0',
    background: 'linear-gradient(135deg, #2e7d32 0%, #1565c0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1',
  },
  subtitle: {
    fontSize: '1.75rem',
    color: '#2d3748',
    fontWeight: '700',
    margin: '0.5rem 0 1rem 0',
  },
  description: {
    fontSize: '1rem',
    color: '#718096',
    lineHeight: '1.6',
    marginBottom: '2rem',
    maxWidth: '440px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    padding: '0.85rem 1.75rem',
    backgroundColor: '#2e7d32',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
  },
  secondaryButton: {
    padding: '0.85rem 1.75rem',
    backgroundColor: '#ffffff',
    color: '#2e7d32',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.95rem',
    border: '2px solid #e2e8f0',
    transition: 'all 0.2s ease-in-out',
  },
};
