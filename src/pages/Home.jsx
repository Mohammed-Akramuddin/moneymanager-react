import React from 'react';
import Dashboard from '../components/Dashboard';
import HomePage from '../components/HomePage';
import useUser from '../hooks/useUser';

function Home() {
  useUser();

  const handleNavigate = (path) => {
    // You can implement navigation logic here
    // For example, using React Router's navigate function
    window.location.href = path;
  };

  return (
    <Dashboard>
      <HomePage onNavigate={handleNavigate} />
    </Dashboard>
  );
}

export default Home;