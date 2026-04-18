import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const accent = '#0284c7';
  const border = '#e2e8f0';

  const styles = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      zIndex: 1000,
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
    },
    logo: {
      color: accent,
      fontSize: '22px',
      fontWeight: 800,
      textDecoration: 'none',
      cursor: 'pointer',
      letterSpacing: '-0.02em',
    },
    linksContainer: {
      display: 'flex',
      gap: '28px',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    link: {
      color: '#475569',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: 600,
      transition: 'color 0.2s',
      cursor: 'pointer',
    },
    buttonsContainer: {
      display: 'flex',
      gap: '12px',
    },
    loginBtn: {
      backgroundColor: 'transparent',
      color: '#0f172a',
      border: `1px solid ${border}`,
      padding: '9px 18px',
      borderRadius: '999px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 600,
      transition: 'all 0.2s',
    },
    registerBtn: {
      backgroundColor: accent,
      color: '#ffffff',
      border: 'none',
      padding: '9px 18px',
      borderRadius: '999px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 600,
      transition: 'all 0.2s',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
    },
  };

  const linkHover = (e, enter) => {
    e.currentTarget.style.color = enter ? accent : '#475569';
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        smia
      </div>

      <div style={styles.linksContainer}>
        <Link
          to="/"
          style={styles.link}
          onMouseEnter={(e) => linkHover(e, true)}
          onMouseLeave={(e) => linkHover(e, false)}
        >
          Home
        </Link>
        <Link
          to="/explore"
          style={styles.link}
          onMouseEnter={(e) => linkHover(e, true)}
          onMouseLeave={(e) => linkHover(e, false)}
        >
          Explore
        </Link>
        <Link
          to="/hotels"
          style={styles.link}
          onMouseEnter={(e) => linkHover(e, true)}
          onMouseLeave={(e) => linkHover(e, false)}
        >
          Hotels
        </Link>
        <Link
          to="/restaurants"
          style={styles.link}
          onMouseEnter={(e) => linkHover(e, true)}
          onMouseLeave={(e) => linkHover(e, false)}
        >
          Restaurants
        </Link>
        <Link
          to="/about"
          style={styles.link}
          onMouseEnter={(e) => linkHover(e, true)}
          onMouseLeave={(e) => linkHover(e, false)}
        >
          About
        </Link>
      </div>

      <div style={styles.buttonsContainer}>
        <button style={styles.loginBtn} onClick={() => navigate('/login')}>
          Login
        </button>
        <button style={styles.registerBtn} onClick={() => navigate('/register')}>
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
