import React from 'react';

const Dashboard = () => {
  const styles = {
    container: {
      padding: '100px 20px',
      minHeight: '80vh',
      backgroundColor: '#0a0e1a',
      color: '#e8eaf0',
      textAlign: 'center',
    },
    title: {
      fontSize: '2.5rem',
      marginBottom: '20px',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <p>Welcome to your hidden spots dashboard.</p>
    </div>
  );
};

export default Dashboard;
