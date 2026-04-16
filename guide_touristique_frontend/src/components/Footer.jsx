import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: '#0d1424',
      borderTop: '1px solid #1e2a3a',
      padding: '60px 80px',
      color: '#e8eaf0',
      marginTop: 'auto',
    },
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#3b82f6',
      marginBottom: '10px',
    },
    text: {
      color: '#6b7a99',
      fontSize: '14px',
      lineHeight: '1.6',
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
      marginTop: '60px',
      paddingTop: '20px',
      borderTop: '1px solid #1e2a3a',
      color: '#6b7a99',
      fontSize: '12px',
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.column}>
          <div style={styles.title}>HiddenSpots</div>
          <p style={styles.text}>
            Discover the most beautiful and secret locations shared by our community of travelers and explorers.
          </p>
        </div>
        
        <div style={styles.column}>
          <div style={styles.title}>Team Members</div>
          <ul style={styles.memberList}>
            <li style={{color: '#e8eaf0'}}>Mohamed Moughamir</li>
            <li style={{color: '#e8eaf0'}}>Adam Boussid</li>
            <li style={{color: '#e8eaf0'}}>Saad Elmahi</li>
            <li style={{color: '#e8eaf0'}}>Soukaina Gourram</li>
            <li style={{color: '#e8eaf0'}}>Doha Elgarouaz</li>
          </ul>
        </div>

        <div style={styles.column}>
          <div style={styles.title}>Project</div>
          <div style={styles.text}>Guide Touristique Frontend</div>
          <div style={styles.text}>Built with React & Passion</div>
        </div>
      </div>
      
      <div style={styles.copyright}>
        © 2025 HiddenSpots. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
