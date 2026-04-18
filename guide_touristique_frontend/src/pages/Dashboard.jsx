import React from 'react';

const Dashboard = () => {
  const styles = {
    container: {
      padding: '48px 24px 64px',
      minHeight: '80vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      textAlign: 'center',
    },
    title: {
      fontSize: 'clamp(28px, 4vw, 2.5rem)',
      marginBottom: '12px',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    text: {
      color: '#64748b',
      fontSize: '16px',
      maxWidth: '480px',
      margin: '0 auto',
      lineHeight: 1.6,
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.text}>Welcome to your hidden spots dashboard.</p>
    </div>
  );
};

export default Dashboard;
