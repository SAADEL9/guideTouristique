import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const styles = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: '#0d1424',
      borderBottom: '1px solid #1e2a3a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      zIndex: 1000,
    },
    logo: {
      color: '#3b82f6',
      fontSize: '24px',
      fontWeight: 'bold',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    linksContainer: {
      display: 'flex',
      gap: '30px',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    link: {
      color: '#e8eaf0',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'color 0.2s',
      cursor: 'pointer',
    },
    buttonsContainer: {
      display: 'flex',
      gap: '15px',
    },
    loginBtn: {
      backgroundColor: 'transparent',
      color: '#e8eaf0',
      border: '1px solid #1e2a3a',
      padding: '8px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    registerBtn: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      padding: '8px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s',
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        smia
      </div>

      <div style={styles.linksContainer}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/explore" style={styles.link}>Explore</Link>
        <Link to="/hotels" style={styles.link}>Hotels</Link>
        <Link to="/about" style={styles.link}>About</Link>
      </div>

      <div style={styles.buttonsContainer}>
        <button style={styles.loginBtn} onClick={() => navigate('/login')}>Login</button>
        <button style={styles.registerBtn} onClick={() => navigate('/register')}>Register</button>
      </div>
    </nav>
  );
};

export default Navbar;
