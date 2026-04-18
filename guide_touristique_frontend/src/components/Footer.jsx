import React from 'react';

const Footer = () => {
  const accent = '#0284c7';
  const border = '#e2e8f0';

  const styles = {
    footer: {
      backgroundColor: '#ffffff',
      borderTop: `1px solid ${border}`,
      padding: '56px 24px 32px',
      color: '#0f172a',
      marginTop: 'auto',
    },
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '36px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    title: {
      fontSize: '16px',
      fontWeight: 700,
      color: accent,
      marginBottom: '4px',
    },
    text: {
      color: '#64748b',
      fontSize: '14px',
      lineHeight: 1.65,
    },
    memberList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    copyright: {
      textAlign: 'center',
      marginTop: '48px',
      paddingTop: '24px',
      borderTop: `1px solid ${border}`,
      color: '#94a3b8',
      fontSize: '12px',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.column}>
          <div style={styles.title}>HiddenSpots</div>
          <p style={styles.text}>
            Discover the most beautiful and secret locations shared by our community of travelers
            and explorers.
          </p>
        </div>

        <div style={styles.column}>
          <div style={styles.title}>Team Members</div>
          <ul style={styles.memberList}>
            <li style={{ color: '#334155', fontSize: '14px' }}>Mohamed Moughamir</li>
            <li style={{ color: '#334155', fontSize: '14px' }}>Adam Boussid</li>
            <li style={{ color: '#334155', fontSize: '14px' }}>Saad Elmahi</li>
            <li style={{ color: '#334155', fontSize: '14px' }}>Soukaina Gourram</li>
            <li style={{ color: '#334155', fontSize: '14px' }}>Doha Elgarouaz</li>
          </ul>
        </div>

        <div style={styles.column}>
          <div style={styles.title}>Project</div>
          <div style={styles.text}>Guide Touristique Frontend</div>
          <div style={styles.text}>Built with React & Passion</div>
        </div>
      </div>

      <div style={styles.copyright}>© 2026 HiddenSpots. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
